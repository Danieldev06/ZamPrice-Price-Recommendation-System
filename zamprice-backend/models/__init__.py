from datetime import datetime, timezone
from sqlalchemy import (
    ForeignKey, String, Float, Integer, Boolean, DateTime, UniqueConstraint, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="consumer")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    shopping_lists: Mapped[list["ShoppingList"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    alerts: Mapped[list["PriceAlert"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class Supermarket(Base):
    __tablename__ = "supermarkets"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    branches: Mapped[list["Branch"]] = relationship(back_populates="supermarket", cascade="all, delete-orphan")

class Branch(Base):
    __tablename__ = "branches"
    id: Mapped[int] = mapped_column(primary_key=True)
    supermarket_id: Mapped[int] = mapped_column(ForeignKey("supermarkets.id", ondelete="CASCADE"))
    location: Mapped[str] = mapped_column(String(120))
    supermarket: Mapped[Supermarket] = relationship(back_populates="branches")
    __table_args__ = (UniqueConstraint("supermarket_id", "location", name="uq_branch"),)

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    brand: Mapped[str | None] = mapped_column(String(80))
    category: Mapped[str | None] = mapped_column(String(80), index=True)
    # canonical unit for the *product definition*; individual price records may record their own quantity+unit
    base_unit: Mapped[str] = mapped_column(String(10), default="item")  # "kg" | "L" | "item"

class PriceRecord(Base):
    __tablename__ = "price_records"
    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    branch_id: Mapped[int] = mapped_column(ForeignKey("branches.id", ondelete="CASCADE"), index=True)
    quantity: Mapped[float] = mapped_column(Float)       # e.g. 2.0 for 2kg
    unit: Mapped[str] = mapped_column(String(10))        # "kg"|"g"|"L"|"ml"|"item"
    price: Mapped[float] = mapped_column(Float)          # displayed price
    promotional_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    promotion_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    source: Mapped[str | None] = mapped_column(String(120))

    product: Mapped[Product] = relationship()
    branch: Mapped[Branch] = relationship()

class ShoppingList(Base):
    __tablename__ = "shopping_lists"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(120), default="My list")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    user: Mapped[User] = relationship(back_populates="shopping_lists")
    items: Mapped[list["ListItem"]] = relationship(back_populates="list", cascade="all, delete-orphan")

class ListItem(Base):
    __tablename__ = "list_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    list_id: Mapped[int] = mapped_column(ForeignKey("shopping_lists.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[float] = mapped_column(Float, default=1.0)
    list: Mapped[ShoppingList] = relationship(back_populates="items")

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    target_price: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default="active")
    last_triggered_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    user: Mapped[User] = relationship(back_populates="alerts")