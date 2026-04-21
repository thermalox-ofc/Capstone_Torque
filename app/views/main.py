"""
Main Routes Blueprint
Contains home page, login, public functionality routes
"""
from datetime import date, datetime
import logging
from decimal import Decimal, InvalidOperation

from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, session

from app.extensions import db
from app.models.chef import ChefProfile, BookingRequest
from app.services.customer_service import CustomerService
from app.services.job_service import JobService
from app.services.billing_service import BillingService
from app.utils.decorators import handle_database_errors, log_function_call
from app.utils.validators import validate_customer_data, sanitize_input
from app.utils.security import require_auth, InputSanitizer, SQLInjectionProtection
from app.utils.error_handler import ValidationError, BusinessLogicError

# Create blueprint
main_bp = Blueprint('main', __name__)
logger = logging.getLogger(__name__)

# Initialize services
customer_service = CustomerService()
job_service = JobService()
billing_service = BillingService()


@main_bp.route('/')
@handle_database_errors
@log_function_call
def index():
    """Public chef marketplace landing page."""
    try:
        chefs = ChefProfile.get_all_public()
        featured_chef = ChefProfile.get_featured() or (chefs[0] if chefs else None)
        marketplace_stats = {
            'chef_count': len(chefs),
            'booking_count': BookingRequest.count(),
            'avg_rating': featured_chef.rating_display if featured_chef else '5.0',
        }
        return render_template(
            'index.html',
            featured_chef=featured_chef,
            chefs=chefs,
            marketplace_stats=marketplace_stats,
            today=date.today(),
        )
    except Exception as exc:
        logger.error(f"Marketplace home page loading failed: {exc}")
        flash('The chef marketplace is warming up. Please try again in a moment.', 'error')
        return render_template(
            'index.html',
            featured_chef=None,
            chefs=[],
            marketplace_stats={'chef_count': 0, 'booking_count': 0, 'avg_rating': '5.0'},
            today=date.today(),
        )


@main_bp.route('/chefs')
@handle_database_errors
def chef_directory():
    """Public directory of chefs."""
    chefs = ChefProfile.get_all_public()
    return render_template('chef/directory.html', chefs=chefs)


@main_bp.route('/chefs/<slug>')
@handle_database_errors
def chef_detail(slug):
    """Chef profile and booking form."""
    chef = ChefProfile.find_by_slug(slug)
    if not chef:
        return render_template('errors/404.html'), 404
    return render_template('chef/detail.html', chef=chef, today=date.today())


@main_bp.route('/chefs/<slug>/book', methods=['POST'])
@handle_database_errors
def book_chef(slug):
    """Create a booking request for a chef."""
    chef = ChefProfile.find_by_slug(slug)
    if not chef:
        return render_template('errors/404.html'), 404

    form_data = {
        'client_name': sanitize_input(request.form.get('client_name', '')),
        'client_email': sanitize_input(request.form.get('client_email', '')),
        'client_phone': sanitize_input(request.form.get('client_phone', '')),
        'event_date': sanitize_input(request.form.get('event_date', '')),
        'guest_count': sanitize_input(request.form.get('guest_count', '')),
        'event_location': sanitize_input(request.form.get('event_location', '')),
        'occasion': sanitize_input(request.form.get('occasion', '')),
        'estimated_budget': sanitize_input(request.form.get('estimated_budget', '')),
        'notes': sanitize_input(request.form.get('notes', '')),
    }

    errors = _validate_booking_form(form_data)
    if errors:
        for error in errors:
            flash(error, 'error')
        return render_template('chef/detail.html', chef=chef, today=date.today(), form_data=form_data), 400

    booking = BookingRequest(
        chef_id=chef.chef_id,
        client_name=form_data['client_name'],
        client_email=form_data['client_email'],
        client_phone=form_data['client_phone'] or None,
        event_date=datetime.strptime(form_data['event_date'], '%Y-%m-%d').date(),
        guest_count=int(form_data['guest_count']),
        event_location=form_data['event_location'],
        occasion=form_data['occasion'],
        notes=form_data['notes'] or None,
        estimated_budget=_parse_budget(form_data['estimated_budget']),
    )
    db.session.add(booking)
    db.session.commit()

    flash('Your booking request is in. The chef will follow up shortly.', 'success')
    return redirect(url_for('main.booking_confirmation', booking_request_id=booking.booking_request_id))


@main_bp.route('/bookings/<int:booking_request_id>/confirmation')
@handle_database_errors
def booking_confirmation(booking_request_id):
    """Confirmation page after a booking request."""
    booking = BookingRequest.find_by_id(booking_request_id)
    if not booking:
        return render_template('errors/404.html'), 404
    return render_template('chef/confirmation.html', booking=booking)


@main_bp.route('/chef-studio')
@handle_database_errors
def chef_studio():
    """Simple internal view of incoming booking requests."""
    chefs = ChefProfile.get_all_public()
    bookings = list(
        db.session.execute(
            db.select(BookingRequest).order_by(BookingRequest.created_at.desc())
        ).scalars()
    )
    return render_template('chef/studio.html', chefs=chefs, bookings=bookings)


@main_bp.route('/login')
def login():
    """Redirect to auth login page"""
    return redirect(url_for('auth.login'))


@main_bp.route('/logout')
def logout():
    """Logout - clear session and redirect"""
    from flask import current_app
    import requests as http_requests

    # Try to sign out from Neon Auth
    neon_auth_url = (current_app.config.get('NEON_AUTH_URL') or '').rstrip('/')
    if neon_auth_url:
        try:
            http_requests.post(f"{neon_auth_url}/sign-out", timeout=5)
        except Exception:
            pass

    session.clear()
    flash('You have successfully logged out', 'info')
    return redirect(url_for('main.index'))


@main_bp.route('/dashboard')
@require_auth()
@handle_database_errors
@log_function_call
def dashboard():
    """Dashboard - System overview"""
    # Check if logged in (simplified version)
    if not session.get('logged_in'):
        flash('Please login first', 'warning')
        return redirect(url_for('auth.login'))
    
    try:
        user_type = session.get('current_role', 'technician')

        # Select template based on role
        if user_type in ('owner', 'admin'):
            template = 'administrator/dashboard.html'
        else:
            template = 'technician/dashboard.html'

        # Get statistics
        job_stats = job_service.get_job_statistics()
        billing_stats = billing_service.get_billing_statistics()

        # Get recent activities
        recent_jobs, _, _ = job_service.get_current_jobs(page=1, per_page=10)
        overdue_bills = billing_service.get_overdue_bills()

        return render_template(template,
                             user_type=user_type,
                             job_stats=job_stats,
                             billing_stats=billing_stats,
                             recent_jobs=recent_jobs,
                             overdue_bills=overdue_bills)

    except Exception as e:
        logger.error(f"Dashboard loading failed: {e}")
        flash('Failed to load dashboard', 'error')
        return render_template('technician/dashboard.html',
                             user_type='technician',
                             job_stats={},
                             billing_stats={},
                             recent_jobs=[],
                             overdue_bills=[])


def _validate_booking_form(form_data):
    """Validate booking submission payload."""
    errors = []

    if not form_data['client_name']:
        errors.append('Your name is required.')

    if not form_data['client_email'] or not InputSanitizer.validate_email(form_data['client_email']):
        errors.append('A valid email address is required.')

    if not form_data['event_location']:
        errors.append('Please share where the event will take place.')

    if not form_data['occasion']:
        errors.append('Tell the chef what kind of event this is.')

    try:
        guest_count = int(form_data['guest_count'])
        if guest_count < 1:
            raise ValueError
    except (TypeError, ValueError):
        errors.append('Guest count must be at least 1.')

    try:
        submitted_date = datetime.strptime(form_data['event_date'], '%Y-%m-%d').date()
        if submitted_date < date.today():
            errors.append('Event date must be today or later.')
    except ValueError:
        errors.append('Choose a valid event date.')

    if form_data['estimated_budget']:
        try:
            if Decimal(form_data['estimated_budget']) < 0:
                errors.append('Budget cannot be negative.')
        except InvalidOperation:
            errors.append('Budget must be a valid number.')

    return errors


def _parse_budget(raw_budget):
    """Parse optional estimated budget."""
    if not raw_budget:
        return None
    try:
        return Decimal(raw_budget)
    except InvalidOperation:
        return None


@main_bp.route('/api/search/customers')
@require_auth()
@handle_database_errors
def api_search_customers():
    """API: Search customers"""
    query = InputSanitizer.sanitize_string(request.args.get('q', ''))
    search_type = InputSanitizer.sanitize_string(request.args.get('type', 'both'))
    
    # Check for SQL injection
    if SQLInjectionProtection.scan_sql_injection(query):
        raise ValidationError("Search criteria contains illegal characters")
    
    if not query:
        return jsonify([])
    
    try:
        customers = customer_service.search_customers(query, search_type)
        return jsonify([{
            'customer_id': c.customer_id,
            'full_name': c.full_name,
            'email': c.email,
            'phone': c.phone
        } for c in customers])
        
    except Exception as e:
        logger.error(f"Customer search failed: {e}")
        return jsonify({'error': 'Search failed'}), 500


@main_bp.route('/api/customers/<int:customer_id>')
@handle_database_errors
def api_get_customer(customer_id):
    """API: Get customer details"""
    try:
        customer = customer_service.get_customer_by_id(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        stats = customer_service.get_customer_statistics(customer_id)
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Get customer details failed: {e}")
        return jsonify({'error': 'Failed to get customer information'}), 500


@main_bp.route('/customers')
@handle_database_errors
@log_function_call
def customers():
    """Customer list page"""
    try:
        # Get search parameters
        search_query = sanitize_input(request.args.get('search', ''))
        search_type = sanitize_input(request.args.get('search_type', 'both'))
        
        # Search or get all customers
        if search_query:
            customers = customer_service.search_customers(search_query, search_type)
        else:
            customers = customer_service.get_all_customers()
        
        return render_template('customers/list.html',
                             customers=customers,
                             search_query=search_query,
                             search_type=search_type)
        
    except Exception as e:
        logger.error(f"Customer list loading failed: {e}")
        flash('Failed to load customer list', 'error')
        return render_template('customers/list.html',
                             customers=[],
                             search_query='',
                             search_type='both')


@main_bp.route('/customers/new')
def new_customer():
    """New customer page"""
    return render_template('customers/form.html',
                         customer=None,
                         action='create')


@main_bp.route('/customers', methods=['POST'])
@handle_database_errors
def create_customer():
    """Create new customer"""
    # Get form data
    customer_data = {
        'first_name': sanitize_input(request.form.get('first_name', '')),
        'family_name': sanitize_input(request.form.get('family_name', '')),
        'email': sanitize_input(request.form.get('email', '')),
        'phone': sanitize_input(request.form.get('phone', ''))
    }
    
    try:
        # Validate data
        validation_result = validate_customer_data(customer_data)
        if not validation_result.is_valid:
            for error in validation_result.get_errors():
                flash(error, 'error')
            return render_template('customers/form.html',
                                 customer=customer_data,
                                 action='create')
        
        # Create customer
        success, errors, customer = customer_service.create_customer(customer_data)
        
        if success:
            flash(f'Customer {customer.full_name} created successfully!', 'success')
            return redirect(url_for('main.customers'))
        else:
            for error in errors:
                flash(error, 'error')
            return render_template('customers/form.html',
                                 customer=customer_data,
                                 action='create')
            
    except Exception as e:
        logger.error(f"Failed to create customer: {e}")
        flash('Failed to create customer, please try again later', 'error')
        return render_template('customers/form.html',
                             customer=customer_data,
                             action='create')


@main_bp.route('/customers/<int:customer_id>')
@handle_database_errors
@log_function_call
def customer_detail(customer_id):
    """Customer detail page"""
    try:
        customer = customer_service.get_customer_by_id(customer_id)
        if not customer:
            flash('Customer not found', 'error')
            return redirect(url_for('main.customers'))
        
        # Get customer statistics
        stats = customer_service.get_customer_statistics(customer_id)
        
        return render_template('customers/detail.html',
                             customer=customer,
                             stats=stats)
        
    except Exception as e:
        logger.error(f"Customer detail loading failed: {e}")
        flash('Failed to load customer details', 'error')
        return redirect(url_for('main.customers'))


@main_bp.route('/customers/<int:customer_id>/edit')
@handle_database_errors
def edit_customer(customer_id):
    """Edit customer page"""
    try:
        customer = customer_service.get_customer_by_id(customer_id)
        if not customer:
            flash('Customer not found', 'error')
            return redirect(url_for('main.customers'))
        
        return render_template('customers/form.html',
                             customer=customer,
                             action='edit')
        
    except Exception as e:
        logger.error(f"Failed to load customer edit page: {e}")
        flash('Failed to load edit page', 'error')
        return redirect(url_for('main.customers'))


@main_bp.route('/customers/<int:customer_id>', methods=['POST'])
@handle_database_errors
def update_customer(customer_id):
    """Update customer information"""
    # Get form data
    customer_data = {
        'first_name': sanitize_input(request.form.get('first_name', '')),
        'family_name': sanitize_input(request.form.get('family_name', '')),
        'email': sanitize_input(request.form.get('email', '')),
        'phone': sanitize_input(request.form.get('phone', ''))
    }
    
    try:
        # Validate data
        validation_result = validate_customer_data(customer_data)
        if not validation_result.is_valid:
            for error in validation_result.get_errors():
                flash(error, 'error')
            customer = customer_service.get_customer_by_id(customer_id)
            return render_template('customers/form.html',
                                 customer=customer,
                                 action='edit')
        
        # Update customer
        success, errors, customer = customer_service.update_customer(customer_id, customer_data)
        
        if success:
            flash(f'Customer {customer.full_name} updated successfully!', 'success')
            return redirect(url_for('main.customer_detail', customer_id=customer_id))
        else:
            for error in errors:
                flash(error, 'error')
            customer = customer_service.get_customer_by_id(customer_id)
            return render_template('customers/form.html',
                                 customer=customer,
                                 action='edit')
            
    except Exception as e:
        logger.error(f"Failed to update customer: {e}")
        flash('Failed to update customer, please try again later', 'error')
        customer = customer_service.get_customer_by_id(customer_id)
        return render_template('customers/form.html',
                             customer=customer,
                             action='edit')


@main_bp.route('/about')
def about():
    """About page"""
    return render_template('about.html')


@main_bp.route('/help')
def help_page():
    """Help page"""
    return render_template('help.html')


# Error handling
@main_bp.errorhandler(404)
def not_found_error(error):
    """404 error handler"""
    return render_template('errors/404.html'), 404


@main_bp.errorhandler(500)
def internal_error(error):
    """500 error handler"""
    return render_template('errors/500.html'), 500 
