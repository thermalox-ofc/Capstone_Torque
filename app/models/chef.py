"""
Chef marketplace models.
"""
from datetime import date
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import Boolean, Date, ForeignKey, Integer, Numeric, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.base import BaseModelMixin, TimestampMixin


class ChefProfile(db.Model, BaseModelMixin, TimestampMixin):
    """Public-facing chef profile."""

    __tablename__ = 'chef_profile'

    chef_id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    headline: Mapped[str] = mapped_column(String(180), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(120), nullable=False)
    service_area: Mapped[str] = mapped_column(String(160), nullable=False)
    price_starting_at: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=95.00)
    rating: Mapped[Decimal] = mapped_column(Numeric(3, 2), nullable=False, default=4.90)
    review_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    response_time: Mapped[str] = mapped_column(String(80), nullable=False, default='Within 2 hours')
    years_experience: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    hero_image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    cuisine_tags: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    menu_items: Mapped[List["MenuItem"]] = relationship(
        "MenuItem",
        back_populates="chef",
        cascade="all, delete-orphan",
        order_by=lambda: MenuItem.display_order,
    )
    booking_requests: Mapped[List["BookingRequest"]] = relationship(
        "BookingRequest",
        back_populates="chef",
        cascade="all, delete-orphan",
        order_by=lambda: BookingRequest.created_at.desc(),
    )

    @classmethod
    def find_by_slug(cls, slug: str) -> Optional["ChefProfile"]:
        query = db.select(cls).where(cls.slug == slug)
        return db.session.execute(query).scalar_one_or_none()

    @classmethod
    def get_featured(cls) -> Optional["ChefProfile"]:
        query = db.select(cls).where(cls.is_featured == True).order_by(cls.rating.desc())
        return db.session.execute(query).scalars().first()

    @classmethod
    def get_all_public(cls) -> List["ChefProfile"]:
        query = db.select(cls).order_by(cls.is_featured.desc(), cls.rating.desc(), cls.display_name.asc())
        return list(db.session.execute(query).scalars())

    @property
    def starting_price_display(self) -> str:
        return f"{float(self.price_starting_at):.0f}"

    @property
    def rating_display(self) -> str:
        return f"{float(self.rating):.1f}"

    @property
    def cuisines_display(self) -> str:
        return ", ".join(self.cuisine_tags or [])


class MenuItem(db.Model, BaseModelMixin, TimestampMixin):
    """Menu items offered by a chef."""

    __tablename__ = 'menu_item'

    menu_item_id: Mapped[int] = mapped_column(primary_key=True)
    chef_id: Mapped[int] = mapped_column(Integer, ForeignKey('chef_profile.chef_id'), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(140), nullable=False)
    course: Mapped[str] = mapped_column(String(60), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price_per_guest: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    dietary_tags: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    is_signature: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    chef: Mapped["ChefProfile"] = relationship("ChefProfile", back_populates="menu_items")

    @property
    def dietary_tags_display(self) -> str:
        return " · ".join(self.dietary_tags or [])


class BookingRequest(db.Model, BaseModelMixin, TimestampMixin):
    """Inquiry submitted by a potential client."""

    __tablename__ = 'booking_request'

    STATUS_NEW = 'new'
    STATUS_CONTACTED = 'contacted'
    STATUS_BOOKED = 'booked'
    STATUS_DECLINED = 'declined'

    booking_request_id: Mapped[int] = mapped_column(primary_key=True)
    chef_id: Mapped[int] = mapped_column(Integer, ForeignKey('chef_profile.chef_id'), nullable=False, index=True)
    client_name: Mapped[str] = mapped_column(String(120), nullable=False)
    client_email: Mapped[str] = mapped_column(String(320), nullable=False)
    client_phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    guest_count: Mapped[int] = mapped_column(Integer, nullable=False)
    event_location: Mapped[str] = mapped_column(String(180), nullable=False)
    occasion: Mapped[str] = mapped_column(String(120), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    estimated_budget: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=STATUS_NEW)

    chef: Mapped["ChefProfile"] = relationship("ChefProfile", back_populates="booking_requests")
