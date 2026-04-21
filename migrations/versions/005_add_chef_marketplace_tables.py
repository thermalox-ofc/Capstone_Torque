"""Add chef marketplace tables

Revision ID: 005
Revises: 004
Create Date: 2026-04-12
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'chef_profile',
        sa.Column('chef_id', sa.Integer(), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('display_name', sa.String(length=120), nullable=False),
        sa.Column('headline', sa.String(length=180), nullable=False),
        sa.Column('bio', sa.Text(), nullable=False),
        sa.Column('location', sa.String(length=120), nullable=False),
        sa.Column('service_area', sa.String(length=160), nullable=False),
        sa.Column('price_starting_at', sa.Numeric(10, 2), nullable=False),
        sa.Column('rating', sa.Numeric(3, 2), nullable=False),
        sa.Column('review_count', sa.Integer(), nullable=False),
        sa.Column('response_time', sa.String(length=80), nullable=False),
        sa.Column('years_experience', sa.Integer(), nullable=False),
        sa.Column('hero_image_url', sa.String(length=500), nullable=True),
        sa.Column('cuisine_tags', sa.JSON(), nullable=True),
        sa.Column('is_featured', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('chef_id'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index(op.f('ix_chef_profile_slug'), 'chef_profile', ['slug'], unique=True)

    op.create_table(
        'menu_item',
        sa.Column('menu_item_id', sa.Integer(), nullable=False),
        sa.Column('chef_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=140), nullable=False),
        sa.Column('course', sa.String(length=60), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('price_per_guest', sa.Numeric(10, 2), nullable=False),
        sa.Column('dietary_tags', sa.JSON(), nullable=True),
        sa.Column('is_signature', sa.Boolean(), nullable=False),
        sa.Column('display_order', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['chef_id'], ['chef_profile.chef_id']),
        sa.PrimaryKeyConstraint('menu_item_id'),
    )
    op.create_index(op.f('ix_menu_item_chef_id'), 'menu_item', ['chef_id'], unique=False)

    op.create_table(
        'booking_request',
        sa.Column('booking_request_id', sa.Integer(), nullable=False),
        sa.Column('chef_id', sa.Integer(), nullable=False),
        sa.Column('client_name', sa.String(length=120), nullable=False),
        sa.Column('client_email', sa.String(length=320), nullable=False),
        sa.Column('client_phone', sa.String(length=30), nullable=True),
        sa.Column('event_date', sa.Date(), nullable=False),
        sa.Column('guest_count', sa.Integer(), nullable=False),
        sa.Column('event_location', sa.String(length=180), nullable=False),
        sa.Column('occasion', sa.String(length=120), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('estimated_budget', sa.Numeric(10, 2), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['chef_id'], ['chef_profile.chef_id']),
        sa.PrimaryKeyConstraint('booking_request_id'),
    )
    op.create_index(op.f('ix_booking_request_chef_id'), 'booking_request', ['chef_id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_booking_request_chef_id'), table_name='booking_request')
    op.drop_table('booking_request')
    op.drop_index(op.f('ix_menu_item_chef_id'), table_name='menu_item')
    op.drop_table('menu_item')
    op.drop_index(op.f('ix_chef_profile_slug'), table_name='chef_profile')
    op.drop_table('chef_profile')
