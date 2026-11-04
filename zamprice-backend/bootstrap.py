from pathlib import Path

FILES = {
    "app/__init__.py": "",
    "app/core/__init__.py": "",
    "app/db/__init__.py": "",
    "app/api/__init__.py": "",
    "app/schemas/__init__.py": "",
    "app/services/__init__.py": "",

    "app/core/config.py": '''
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    DATABASE_URL: str = "sqlite:///./zamprice.db"
    JWT_SECRET: str = "dev-secret"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    STALE_DAYS: int = 14
    DEFAULT_CONVENIENCE_COST: float = 30.0
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_list(self):
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

settings = Settings()
''',

    "app/core/security.py": '''
from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
from app.core.config import settings

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except ValueError:
        return False

def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": subject, "iat": now,
               "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
''',

    "app/core/deps.py": '''
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import decode_token
from app.db.session import get_db
from app import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def require_admin(user: models.User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user
''',

    "app/db/base.py": '''
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
''',

    "app/db/session.py": '''
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True,
                       connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
''',

    "app/models/__init__.py": '''
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, String, Float, Boolean, DateTime, UniqueConstraint, func
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
    brand: Mapped[str | None] = mapped_column(String(80), nullable=True)
    category: Mapped[str | None] = mapped_column(String(80), index=True, nullable=True)
    base_unit: Mapped[str] = mapped_column(String(10), default="item")

class PriceRecord(Base):
    __tablename__ = "price_records"
    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    branch_id: Mapped[int] = mapped_column(ForeignKey("branches.id", ondelete="CASCADE"), index=True)
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(10))
    price: Mapped[float] = mapped_column(Float)
    promotional_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    promotion_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    source: Mapped[str | None] = mapped_column(String(120), nullable=True)
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
''',

    "app/services/units.py": '''
from typing import Tuple

_TO_CANONICAL = {"kg": ("kg", 1.0), "g": ("kg", 0.001),
                 "L": ("L", 1.0), "ml": ("L", 0.001), "item": ("item", 1.0)}

def canonicalise(quantity: float, unit: str) -> Tuple[float, str]:
    key = unit.strip()
    if key not in _TO_CANONICAL:
        raise ValueError("Unsupported unit: " + unit)
    canon, factor = _TO_CANONICAL[key]
    return float(quantity) * factor, canon

def unit_price(price: float, quantity: float, unit: str) -> Tuple[float, str]:
    q, canon = canonicalise(quantity, unit)
    if q <= 0:
        raise ValueError("Quantity must be > 0")
    return round(float(price) / q, 4), canon
''',

    "app/services/comparison.py": '''
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session, joinedload
from app.core.config import settings
from app import models
from app.services.units import unit_price

def _effective_price(rec, now):
    if rec.promotional_price is not None:
        if rec.promotion_end is None or rec.promotion_end >= now:
            return float(rec.promotional_price)
    return float(rec.price)

def _is_stale(rec, now):
    obs = rec.observed_at
    if obs.tzinfo is None:
        obs = obs.replace(tzinfo=timezone.utc)
    return (now - obs) > timedelta(days=settings.STALE_DAYS)

def compare_product(db: Session, product_id: int) -> dict:
    product = db.get(models.Product, product_id)
    if not product:
        return {"error": "Product not found"}
    now = datetime.now(timezone.utc)
    records = (db.query(models.PriceRecord)
               .options(joinedload(models.PriceRecord.branch).joinedload(models.Branch.supermarket))
               .filter(models.PriceRecord.product_id == product_id).all())
    options = []
    for r in records:
        if not r.available:
            continue
        eff = _effective_price(r, now)
        try:
            up, canon = unit_price(eff, r.quantity, r.unit)
        except ValueError:
            continue
        options.append({
            "branch_id": r.branch_id,
            "supermarket": r.branch.supermarket.name,
            "location": r.branch.location,
            "price": float(r.price),
            "promotional_price": float(r.promotional_price) if r.promotional_price else None,
            "effective_price": eff, "quantity": float(r.quantity), "unit": r.unit,
            "unit_price": up, "canonical_unit": canon, "available": True,
            "observed_at": r.observed_at, "stale": _is_stale(r, now),
        })
    if not options:
        return {"product_id": product_id, "product_name": product.name,
                "options": [], "cheapest": None, "best_value": None}
    fresh = [o for o in options if not o["stale"]] or options
    best_total = min(fresh, key=lambda o: o["effective_price"])
    best_unit = min(fresh, key=lambda o: o["unit_price"])
    for o in options:
        o["saving_vs_best"] = round(o["effective_price"] - best_total["effective_price"], 2)
        o["is_best_total"] = o is best_total
        o["is_best_unit"] = o is best_unit
    return {"product_id": product_id, "product_name": product.name,
            "options": options, "cheapest": best_total, "best_value": best_unit}
''',

    "app/services/basket.py": '''
from itertools import combinations
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from app import models
from app.services.comparison import _effective_price, _is_stale
from app.services.units import unit_price

def _price_map(db: Session, product_ids):
    now = datetime.now(timezone.utc)
    records = (db.query(models.PriceRecord)
               .options(joinedload(models.PriceRecord.branch).joinedload(models.Branch.supermarket))
               .filter(models.PriceRecord.product_id.in_(product_ids)).all())
    out = {pid: {} for pid in product_ids}
    for r in records:
        if not r.available or _is_stale(r, now):
            continue
        eff = _effective_price(r, now)
        try:
            up, canon = unit_price(eff, r.quantity, r.unit)
        except ValueError:
            continue
        out[r.product_id][r.branch_id] = {
            "branch_id": r.branch_id, "supermarket": r.branch.supermarket.name,
            "location": r.branch.location, "effective_price": eff,
            "unit_price": up, "canonical_unit": canon,
        }
    return out

def _plan(items, p_map, branch_ids, w, conv_cost):
    lines, total = [], 0.0
    for item in items:
        cands = [p_map[item["product_id"]][bid] for bid in branch_ids if bid in p_map[item["product_id"]]]
        if not cands:
            return None
        chosen = min(cands, key=lambda c: c["effective_price"])
        line_total = round(chosen["effective_price"] * item["quantity"], 2)
        total += line_total
        lines.append({"product_id": item["product_id"], "product_name": item["name"],
                      "branch_id": chosen["branch_id"], "supermarket": chosen["supermarket"],
                      "location": chosen["location"], "unit_price": chosen["unit_price"],
                      "quantity": item["quantity"], "line_total": line_total})
    return {"total": round(total, 2), "score": round(total + w * conv_cost * len(branch_ids), 2),
            "store_count": len(branch_ids),
            "stores": sorted({l["supermarket"] for l in lines}), "lines": lines}

def optimize(db: Session, items, mode, w, conv_cost, budget):
    pids = [i["product_id"] for i in items]
    p_map = _price_map(db, pids)
    candidates = sorted({bid for pid in pids for bid in p_map[pid]})
    if not candidates:
        return {"plans": [], "baseline_single_store": None, "saving_vs_baseline": None,
                "error": "No eligible price data"}
    plans = []
    best_multi = None
    for k in range(1, min(len(candidates), 6) + 1):
        for subset in combinations(candidates, k):
            p = _plan(items, p_map, set(subset), 0.0, conv_cost)
            if p and (best_multi is None or p["total"] < best_multi["total"]):
                best_multi = p
    if best_multi:
        plans.append({**best_multi, "mode": "cheapest"})
    best_single = None
    for bid in candidates:
        p = _plan(items, p_map, {bid}, 0.0, conv_cost)
        if p and (best_single is None or p["total"] < best_single["total"]):
            best_single = p
    if best_single:
        plans.append({**best_single, "mode": "single_store"})
    if mode == "convenience" or w > 0:
        best_conv = None
        for k in range(1, min(len(candidates), 4) + 1):
            for subset in combinations(candidates, k):
                p = _plan(items, p_map, set(subset), w or 1.0, conv_cost)
                if p and (best_conv is None or p["score"] < best_conv["score"]):
                    best_conv = p
        if best_conv:
            plans.append({**best_conv, "mode": "convenience"})
    seen, unique = set(), []
    for p in plans:
        key = (p["total"], tuple(p["stores"]))
        if key not in seen:
            seen.add(key); unique.append(p)
    for p in unique:
        p["within_budget"] = (p["total"] <= budget) if budget else None
    return {"plans": unique, "baseline_single_store": best_single,
            "saving_vs_baseline": round(best_single["total"] - best_multi["total"], 2)
                                  if best_single and best_multi else None}
''',

    "app/services/explanation.py": '''
def product_explanation(comparison: dict) -> str:
    opts = comparison.get("options") or []
    if not opts:
        return "No eligible price data available for this product."
    cheapest = comparison["cheapest"]; best_value = comparison["best_value"]
    parts = ["Lowest total price at " + cheapest["supermarket"] + " (" + cheapest["location"] + ") - K"
             + format(cheapest["effective_price"], ".2f") + "."]
    if best_value["branch_id"] != cheapest["branch_id"]:
        parts.append("Best unit value is " + best_value["supermarket"] + " at K"
                     + format(best_value["unit_price"], ".2f") + "/" + best_value["canonical_unit"] + ".")
    stale = [o for o in opts if o["stale"]]
    if stale:
        parts.append("Note: " + str(len(stale)) + " price record(s) are older than the freshness window.")
    return " ".join(parts)

def basket_explanation(plan: dict) -> str:
    return (plan["mode"].replace("_", " ").title() + " plan: K" + format(plan["total"], ".2f")
            + " across " + str(plan["store_count"]) + " store(s) - " + ", ".join(plan["stores"]) + ".")
''',

    "app/services/alerts.py": '''
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app import models
from app.services.comparison import compare_product

def evaluate_alerts(db: Session):
    triggered = []
    now = datetime.now(timezone.utc)
    for alert in db.query(models.PriceAlert).filter(models.PriceAlert.status == "active").all():
        comp = compare_product(db, alert.product_id)
        cheapest = comp.get("cheapest")
        if cheapest and cheapest["effective_price"] <= alert.target_price:
            alert.status = "triggered"
            alert.last_triggered_at = now
            triggered.append({"alert_id": alert.id, "user_id": alert.user_id,
                              "product_id": alert.product_id, "product_name": comp["product_name"],
                              "price": cheapest["effective_price"], "supermarket": cheapest["supermarket"]})
    db.commit()
    return triggered
''',

    "app/schemas/auth.py": '''
from pydantic import BaseModel, EmailStr, Field

class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int; name: str; email: EmailStr; role: str
    class Config: from_attributes = True
''',

    "app/schemas/catalog.py": '''
from pydantic import BaseModel

class ProductOut(BaseModel):
    id: int; name: str; brand: str | None = None
    category: str | None = None; base_unit: str
    class Config: from_attributes = True

class PriceRecordIn(BaseModel):
    product_id: int
    branch_id: int
    quantity: float
    unit: str
    price: float
    promotional_price: float | None = None
    available: bool = True
    source: str | None = None
''',

    "app/schemas/comparison.py": '''
from datetime import datetime
from pydantic import BaseModel

class PriceOption(BaseModel):
    branch_id: int; supermarket: str; location: str
    price: float; promotional_price: float | None = None
    effective_price: float; quantity: float; unit: str
    unit_price: float; canonical_unit: str
    available: bool; observed_at: datetime; stale: bool
    saving_vs_best: float; is_best_total: bool; is_best_unit: bool

class ComparisonOut(BaseModel):
    product_id: int; product_name: str
    options: list[PriceOption]
    cheapest: PriceOption | None = None
    best_value: PriceOption | None = None
    explanation: str | None = None
''',

    "app/schemas/basket.py": '''
from pydantic import BaseModel

class BasketItemIn(BaseModel):
    product_id: int
    quantity: float = 1.0

class BasketIn(BaseModel):
    items: list[BasketItemIn]
    mode: str = "cheapest"
    convenience_weight: float = 0.0
    convenience_cost_per_store: float = 30.0
    budget: float | None = None

class BasketLineOut(BaseModel):
    product_id: int; product_name: str
    branch_id: int; supermarket: str; location: str
    unit_price: float; quantity: float; line_total: float

class BasketPlanOut(BaseModel):
    mode: str; total: float; score: float
    store_count: int; stores: list[str]
    lines: list[BasketLineOut]
    within_budget: bool | None = None

class BasketOut(BaseModel):
    plans: list[BasketPlanOut]
    baseline_single_store: BasketPlanOut | None = None
    saving_vs_baseline: float | None = None
''',

    "app/schemas/alert.py": '''
from datetime import datetime
from pydantic import BaseModel

class AlertIn(BaseModel):
    product_id: int
    target_price: float

class AlertOut(BaseModel):
    id: int; product_id: int; target_price: float; status: str
    last_triggered_at: datetime | None = None
    class Config: from_attributes = True
''',

    "app/api/auth.py": '''
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_current_user
from app.db.session import get_db
from app.schemas.auth import RegisterIn, LoginIn, TokenOut, UserOut
from app import models

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(409, "Email already registered")
    user = models.User(name=payload.name, email=payload.email,
                       password_hash=hash_password(payload.password))
    db.add(user); db.commit(); db.refresh(user)
    return user

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    return TokenOut(access_token=create_access_token(str(user.id)))

@router.get("/me", response_model=UserOut)
def me(user: models.User = Depends(get_current_user)):
    return user
''',

    "app/api/products.py": '''
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.catalog import ProductOut
from app.schemas.comparison import ComparisonOut
from app.services.comparison import compare_product
from app.services.explanation import product_explanation
from app import models

router = APIRouter(prefix="/products", tags=["products"])

@router.get("", response_model=list[ProductOut])
def list_products(q: str | None = None, category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if q:
        query = query.filter(models.Product.name.ilike("%" + q + "%"))
    if category:
        query = query.filter(models.Product.category == category)
    return query.limit(100).all()

@router.get("/{product_id}/comparison", response_model=ComparisonOut, dependencies=[Depends(get_current_user)])
def comparison(product_id: int, db: Session = Depends(get_db)):
    result = compare_product(db, product_id)
    if "error" in result:
        raise HTTPException(404, result["error"])
    result["explanation"] = product_explanation(result)
    return result

@router.get("/{product_id}/history", dependencies=[Depends(get_current_user)])
def history(product_id: int, db: Session = Depends(get_db)):
    rows = (db.query(models.PriceRecord)
            .filter(models.PriceRecord.product_id == product_id)
            .order_by(models.PriceRecord.observed_at.asc()).all())
    return [{"observed_at": r.observed_at, "branch_id": r.branch_id, "price": float(r.price),
             "promotional_price": float(r.promotional_price) if r.promotional_price else None,
             "quantity": float(r.quantity), "unit": r.unit} for r in rows]

@router.get("/{product_id}/alternatives", dependencies=[Depends(get_current_user)])
def alternatives(product_id: int, db: Session = Depends(get_db)):
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    comp = compare_product(db, product_id)
    if not comp.get("best_value"):
        return {"alternatives": []}
    ref_up = comp["best_value"]["unit_price"]; ref_canon = comp["best_value"]["canonical_unit"]
    candidates = (db.query(models.Product)
                  .filter(models.Product.id != product_id)
                  .filter(models.Product.category == product.category).limit(50).all())
    results = []
    for cand in candidates:
        c = compare_product(db, cand.id); bv = c.get("best_value")
        if bv and bv["canonical_unit"] == ref_canon and bv["unit_price"] < ref_up:
            results.append({"product_id": cand.id, "product_name": cand.name,
                            "best_unit_price": bv["unit_price"],
                            "saving_per_unit": round(ref_up - bv["unit_price"], 4),
                            "canonical_unit": ref_canon, "store": bv["supermarket"]})
    results.sort(key=lambda x: -x["saving_per_unit"])
    return {"reference_unit_price": ref_up, "canonical_unit": ref_canon, "alternatives": results[:10]}
''',

    "app/api/basket.py": '''
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.basket import BasketIn, BasketOut
from app.services.basket import optimize
from app.services.explanation import basket_explanation
from app import models

router = APIRouter(prefix="/basket", tags=["basket"])

@router.post("/optimize", response_model=BasketOut, dependencies=[Depends(get_current_user)])
def optimise(payload: BasketIn, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(400, "Basket is empty")
    ids = [i.product_id for i in payload.items]
    products = {p.id: p for p in db.query(models.Product).filter(models.Product.id.in_(ids)).all()}
    missing = [i for i in ids if i not in products]
    if missing:
        raise HTTPException(400, "Unknown product ids: " + str(missing))
    items = [{"product_id": i.product_id, "quantity": i.quantity,
              "name": products[i.product_id].name} for i in payload.items]
    result = optimize(db, items, payload.mode, payload.convenience_weight,
                      payload.convenience_cost_per_store, payload.budget)
    for p in result["plans"]:
        p["explanation"] = basket_explanation(p)
    return result
''',

    "app/api/alerts.py": '''
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.alert import AlertIn, AlertOut
from app.services.alerts import evaluate_alerts
from app import models

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=list[AlertOut])
def list_alerts(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.PriceAlert).filter(models.PriceAlert.user_id == user.id).all()

@router.post("", response_model=AlertOut, status_code=201)
def create_alert(payload: AlertIn, user: models.User = Depends(get_current_user),
                 db: Session = Depends(get_db)):
    if not db.get(models.Product, payload.product_id):
        raise HTTPException(404, "Product not found")
    alert = models.PriceAlert(user_id=user.id, product_id=payload.product_id,
                              target_price=payload.target_price)
    db.add(alert); db.commit(); db.refresh(alert)
    return alert

@router.post("/evaluate", dependencies=[Depends(get_current_user)])
def run_evaluation(db: Session = Depends(get_db)):
    return {"triggered": evaluate_alerts(db)}

@router.delete("/{alert_id}", status_code=204)
def delete_alert(alert_id: int, user: models.User = Depends(get_current_user),
                 db: Session = Depends(get_db)):
    a = db.get(models.PriceAlert, alert_id)
    if not a or a.user_id != user.id:
        raise HTTPException(404, "Alert not found")
    db.delete(a); db.commit()
''',

    "app/api/admin.py": '''
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.db.session import get_db
from app.core.deps import require_admin
from app.schemas.catalog import ProductOut, PriceRecordIn
from app import models

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])

@router.post("/products", response_model=ProductOut, status_code=201)
def create_product(name: str, brand: str | None = None,
                   category: str | None = None, base_unit: str = "item",
                   db: Session = Depends(get_db)):
    p = models.Product(name=name, brand=brand, category=category, base_unit=base_unit)
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.post("/prices", status_code=201)
def add_price(payload: PriceRecordIn, db: Session = Depends(get_db)):
    if not db.get(models.Product, payload.product_id):
        raise HTTPException(404, "Product not found")
    if not db.get(models.Branch, payload.branch_id):
        raise HTTPException(404, "Branch not found")
    r = models.PriceRecord(product_id=payload.product_id, branch_id=payload.branch_id,
                           quantity=payload.quantity, unit=payload.unit, price=payload.price,
                           promotional_price=payload.promotional_price,
                           available=payload.available, source=payload.source,
                           observed_at=datetime.now(timezone.utc))
    db.add(r); db.commit()
    return {"id": r.id}

@router.get("/data-quality")
def data_quality(db: Session = Depends(get_db)):
    from app.services.comparison import _is_stale
    now = datetime.now(timezone.utc)
    records = db.query(models.PriceRecord).all()
    stale = sum(1 for r in records if _is_stale(r, now))
    return {"total_price_records": len(records), "stale_records": stale,
            "products": db.query(models.Product).count(),
            "branches": db.query(models.Branch).count()}
''',

    "app/main.py": '''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, products, basket, alerts, admin

app = FastAPI(title="ZamPrice API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_list,
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(basket.router)
app.include_router(alerts.router)
app.include_router(admin.router)

@app.get("/health")
def health():
    return {"status": "ok"}
''',

    "seed.py": '''
from datetime import datetime, timezone, timedelta
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.core.security import hash_password
from app import models

Base.metadata.create_all(engine)
db = SessionLocal()

if not db.query(models.User).filter_by(email="admin@zamprice.local").first():
    db.add(models.User(name="Admin", email="admin@zamprice.local",
                       password_hash=hash_password("admin123"), role="admin"))
if not db.query(models.User).filter_by(email="demo@zamprice.local").first():
    db.add(models.User(name="Demo User", email="demo@zamprice.local",
                       password_hash=hash_password("demo123"), role="consumer"))
db.commit()

stores = {}
for name in ["Shoprite", "Choppies", "Pick n Pay"]:
    s = db.query(models.Supermarket).filter_by(name=name).first()
    if not s:
        s = models.Supermarket(name=name); db.add(s); db.commit()
    stores[name] = s

branches = {}
for name, location in [("Shoprite", "Manda Hill"), ("Shoprite", "Cairo Road"),
                       ("Choppies", "Kabwata"), ("Choppies", "Woodlands"),
                       ("Pick n Pay", "Makeni"), ("Pick n Pay", "Arcades")]:
    b = db.query(models.Branch).filter_by(supermarket_id=stores[name].id, location=location).first()
    if not b:
        b = models.Branch(supermarket_id=stores[name].id, location=location)
        db.add(b); db.commit()
    branches[(name, location)] = b

def get_or_create_product(name, brand, category, base_unit):
    p = db.query(models.Product).filter_by(name=name).first()
    if not p:
        p = models.Product(name=name, brand=brand, category=category, base_unit=base_unit)
        db.add(p); db.commit()
    return p

products = {
    "oil_2l":  get_or_create_product("Cooking Oil 2L", "Zambeef", "Cooking Oil", "L"),
    "oil_5l":  get_or_create_product("Cooking Oil 5L", "Zambeef", "Cooking Oil", "L"),
    "meal_25": get_or_create_product("Mealie Meal 25kg", "Brenda", "Mealie Meal", "kg"),
    "meal_10": get_or_create_product("Mealie Meal 10kg", "Brenda", "Mealie Meal", "kg"),
    "sugar_2": get_or_create_product("Sugar 2kg", "Zambia Sugar", "Sugar", "kg"),
    "rice_5":  get_or_create_product("Rice 5kg", "Tastic", "Rice", "kg"),
    "milk_1":  get_or_create_product("Milk 1L", "Parmalat", "Milk", "L"),
}

now = datetime.now(timezone.utc)

def add_price(product_key, store, location, qty, unit, price, days_ago=1, promo=None):
    pid = products[product_key].id
    bid = branches[(store, location)].id
    if db.query(models.PriceRecord).filter_by(product_id=pid, branch_id=bid, price=price).first():
        return
    db.add(models.PriceRecord(product_id=pid, branch_id=bid, quantity=qty, unit=unit,
                              price=price, promotional_price=promo,
                              observed_at=now - timedelta(days=days_ago), source="seed"))

add_price("oil_2l", "Shoprite", "Manda Hill", 2, "L", 89.99)
add_price("oil_2l", "Choppies", "Kabwata", 2, "L", 92.50)
add_price("oil_2l", "Pick n Pay", "Makeni", 2, "L", 87.00, promo=82.00)
add_price("oil_5l", "Shoprite", "Manda Hill", 5, "L", 210.00)
add_price("oil_5l", "Choppies", "Kabwata", 5, "L", 205.00)
add_price("meal_25", "Shoprite", "Manda Hill", 25, "kg", 290.00)
add_price("meal_25", "Choppies", "Kabwata", 25, "kg", 285.00)
add_price("meal_25", "Pick n Pay", "Makeni", 25, "kg", 295.00)
add_price("meal_10", "Shoprite", "Manda Hill", 10, "kg", 130.00)
add_price("meal_10", "Choppies", "Kabwata", 10, "kg", 118.00)
add_price("sugar_2", "Shoprite", "Manda Hill", 2, "kg", 55.00)
add_price("sugar_2", "Choppies", "Kabwata", 2, "kg", 53.00)
add_price("sugar_2", "Pick n Pay", "Makeni", 2, "kg", 58.00)
add_price("rice_5", "Shoprite", "Manda Hill", 5, "kg", 95.00)
add_price("rice_5", "Choppies", "Kabwata", 5, "kg", 99.00)
add_price("milk_1", "Shoprite", "Cairo Road", 1, "L", 22.50)
add_price("milk_1", "Choppies", "Woodlands", 1, "L", 21.00)
add_price("milk_1", "Pick n Pay", "Arcades", 1, "L", 23.00)

db.commit()
print("Seed complete.")
''',
}

root = Path(__file__).parent
for path, content in FILES.items():
    full = root / path
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(content.strip() + ("\n" if content.strip() else ""), encoding="utf-8")
    print("wrote", path, "(" + str(full.stat().st_size) + " bytes)")

print()
print("Done. Now run:")
print("  python seed.py")
print("  python -m uvicorn app.main:app --reload --port 8000")