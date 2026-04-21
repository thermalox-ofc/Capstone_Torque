"""
View Integration Tests
Tests route accessibility, auth requirements, and response codes
"""
import pytest
from unittest.mock import patch, MagicMock
import json
from datetime import date, timedelta

from app.models.chef import ChefProfile, BookingRequest


@pytest.mark.integration
class TestPublicRoutes:
    """Tests for publicly accessible routes"""

    def test_index_page(self, client, app):
        """Home page should be accessible"""
        with app.app_context():
            response = client.get('/')
            assert response.status_code == 200
            assert b'Bring a restaurant-quality chef into your home' in response.data

    def test_chef_directory_page(self, client, app):
        """Chef directory should be accessible"""
        with app.app_context():
            response = client.get('/chefs')
            assert response.status_code == 200
            assert b'Explore private chefs' in response.data

    def test_chef_detail_page(self, client, app):
        """Chef detail page should be accessible"""
        with app.app_context():
            chef = ChefProfile.get_featured()
            response = client.get(f'/chefs/{chef.slug}')
            assert response.status_code == 200
            assert chef.display_name.encode() in response.data

    def test_booking_request_submission(self, client, app):
        """Booking form should create a booking request"""
        with app.app_context():
            chef = ChefProfile.get_featured()
            before_count = BookingRequest.count()
            response = client.post(
                f'/chefs/{chef.slug}/book',
                data={
                    'client_name': 'Taylor Guest',
                    'client_email': 'taylor@example.com',
                    'client_phone': '555-0100',
                    'event_date': (date.today() + timedelta(days=14)).isoformat(),
                    'guest_count': '8',
                    'event_location': 'Brooklyn, NY',
                    'occasion': 'Birthday dinner',
                    'estimated_budget': '1200',
                    'notes': 'Two vegetarian guests',
                },
                follow_redirects=True,
            )
            assert response.status_code == 200
            assert BookingRequest.count() == before_count + 1
            assert b'booking inquiry is on its way' in response.data

    def test_login_page(self, client, app):
        """Login page should be accessible"""
        with app.app_context():
            # /login now redirects to /auth/login
            response = client.get('/login')
            assert response.status_code == 302

            response = client.get('/auth/login')
            assert response.status_code == 200

    def test_about_page(self, client, app):
        """About page should be accessible"""
        with app.app_context():
            response = client.get('/about')
            assert response.status_code == 200

    def test_help_page(self, client, app):
        """Help page should be accessible"""
        with app.app_context():
            response = client.get('/help')
            assert response.status_code == 200

    def test_404_page(self, client, app):
        """Non-existent page should return 404"""
        with app.app_context():
            response = client.get('/nonexistent-page-xyz')
            assert response.status_code == 404


@pytest.mark.integration
class TestTechnicianRoutes:
    """Tests for technician route access"""

    def test_current_jobs_requires_login(self, client, app):
        """Current jobs should redirect unauthenticated users"""
        with app.app_context():
            response = client.get('/technician/current-jobs')
            assert response.status_code in (302, 303)

    def test_current_jobs_authenticated(self, authenticated_session, app):
        """Current jobs should be accessible to authenticated technicians"""
        with app.app_context():
            with patch('app.views.technician.job_service') as mock_js:
                mock_js.get_current_jobs.return_value = ([], 0, 0)
                response = authenticated_session.get('/technician/current-jobs')
                assert response.status_code == 200

    def test_new_job_requires_login(self, client, app):
        """New job page should redirect unauthenticated users"""
        with app.app_context():
            response = client.get('/technician/jobs/new')
            assert response.status_code in (302, 303)

    def test_services_page_authenticated(self, authenticated_session, app):
        """Services page should be accessible to authenticated technicians"""
        with app.app_context():
            with patch('app.views.technician.Service') as mock_s:
                mock_s.get_all_sorted.return_value = []
                response = authenticated_session.get('/technician/services')
                assert response.status_code == 200

    def test_parts_page_authenticated(self, authenticated_session, app):
        """Parts page should be accessible to authenticated technicians"""
        with app.app_context():
            with patch('app.views.technician.Part') as mock_p:
                mock_p.get_all_sorted.return_value = []
                response = authenticated_session.get('/technician/parts')
                assert response.status_code == 200

    def test_dashboard_authenticated(self, authenticated_session, app):
        """Technician dashboard should be accessible"""
        with app.app_context():
            with patch('app.views.technician.job_service') as mock_js:
                mock_js.get_job_statistics.return_value = {}
                mock_js.get_current_jobs.return_value = ([], 0, 0)
                response = authenticated_session.get('/technician/dashboard')
                assert response.status_code == 200


@pytest.mark.integration
class TestAdminRoutes:
    """Tests for administrator route access"""

    def test_admin_dashboard_requires_admin(self, authenticated_session, app):
        """Admin dashboard should redirect non-admin users"""
        with app.app_context():
            response = authenticated_session.get('/administrator/dashboard')
            assert response.status_code in (302, 303)

    def test_admin_dashboard_accessible(self, admin_session, app):
        """Admin dashboard should be accessible to admins"""
        with app.app_context():
            with patch('app.views.administrator.job_service') as mock_js, \
                 patch('app.views.administrator.billing_service') as mock_bs, \
                 patch('app.views.administrator.customer_service') as mock_cs:
                mock_js.get_job_statistics.return_value = {}
                mock_js.get_current_jobs.return_value = ([], 0, 0)
                mock_bs.get_billing_statistics.return_value = {}
                mock_bs.get_overdue_bills.return_value = []
                mock_cs.get_all_customers.return_value = []
                mock_cs.get_customers_with_filter.return_value = []

                response = admin_session.get('/administrator/dashboard')
                assert response.status_code == 200

    def test_billing_requires_admin(self, authenticated_session, app):
        """Billing page should redirect non-admin users"""
        with app.app_context():
            response = authenticated_session.get('/administrator/billing')
            assert response.status_code in (302, 303)

    def test_reports_requires_admin(self, authenticated_session, app):
        """Reports page should redirect non-admin users"""
        with app.app_context():
            response = authenticated_session.get('/administrator/reports')
            assert response.status_code in (302, 303)

    def test_overdue_bills_requires_admin(self, authenticated_session, app):
        """Overdue bills page should redirect non-admin users"""
        with app.app_context():
            response = authenticated_session.get('/administrator/overdue-bills')
            assert response.status_code in (302, 303)


@pytest.mark.integration
class TestAPIEndpoints:
    """Tests for API endpoints"""

    def test_api_services(self, authenticated_session, app):
        """API services endpoint should return JSON"""
        with app.app_context():
            with patch('app.views.technician.Service') as mock_s:
                mock_s.get_all_sorted.return_value = []
                response = authenticated_session.get('/technician/api/services')
                assert response.status_code == 200
                assert response.content_type == 'application/json'
                data = response.get_json()
                assert isinstance(data, list)

    def test_api_parts(self, authenticated_session, app):
        """API parts endpoint should return JSON"""
        with app.app_context():
            with patch('app.views.technician.Part') as mock_p:
                mock_p.get_all_sorted.return_value = []
                response = authenticated_session.get('/technician/api/parts')
                assert response.status_code == 200
                assert response.content_type == 'application/json'
                data = response.get_json()
                assert isinstance(data, list)


@pytest.mark.integration
class TestAuthRoutes:
    """Tests for authentication routes"""

    def test_logout_clears_session(self, authenticated_session, app):
        """Logout should clear session and redirect"""
        with app.app_context():
            response = authenticated_session.get('/logout')
            assert response.status_code in (302, 303)

    def test_auth_status_endpoint(self, client, app):
        """Auth status endpoint should return provider config"""
        with app.app_context():
            response = client.get('/auth/status')
            assert response.status_code == 200
            data = response.get_json()
            assert 'neon_auth_configured' in data

    def test_select_tenant_requires_login(self, client, app):
        """Tenant selection should redirect unauthenticated users"""
        with app.app_context():
            response = client.get('/auth/select-tenant')
            assert response.status_code in (302, 303)

    def test_register_org_requires_login(self, client, app):
        """Register organization should redirect unauthenticated users"""
        with app.app_context():
            response = client.get('/auth/register-organization')
            assert response.status_code in (302, 303)


@pytest.mark.integration
class TestSecurityIntegration:
    """Security integration tests"""

    def test_xss_protection(self, client, app):
        """XSS payloads should be escaped in responses"""
        with app.app_context():
            xss_payload = "<script>alert('xss')</script>"
            # Test that the login page does not contain unescaped XSS in query params
            response = client.get(f'/auth/login?error={xss_payload}')
            assert b"<script>alert('xss')</script>" not in response.data
            assert response.status_code == 200

    def test_session_cleanup_on_logout(self, authenticated_session, app):
        """Session should be cleared on logout"""
        with app.app_context():
            with authenticated_session.session_transaction() as sess:
                assert sess.get('logged_in') is True

            authenticated_session.get('/logout')

            with authenticated_session.session_transaction() as sess:
                assert sess.get('logged_in') is not True
