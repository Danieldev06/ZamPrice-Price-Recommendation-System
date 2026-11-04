from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.db.session import get_db
from app.core.deps import require_admin
from app.schemas.catalog import ProductOut, PriceRecordIn
from app import models

router = APIRouter(prefix="/admin", tags=["admin"],
                   dependencies=[Depends(require_admin)])

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
    r = models.PriceRecord(
        product_id=payload.product_id,
        branch_id=payload.branch_id,
        quantity=payload.quantity,
        unit=payload.unit,
        price=payload.price,
        promotional_price=payload.promotional_price,
        available=payload.available,
        source=payload.source,
        observed_at=datetime.now(timezone.utc),
    )
    db.add(r); db.commit()
    return {"id": r.id}

@router.get("/data-quality")
def data_quality(db: Session = Depends(get_db)):
    from app.services.comparison import _is_stale
    now = datetime.now(timezone.utc)
    records = db.query(models.PriceRecord).all()
    stale = sum(1 for r in records if _is_stale(r, now))
    return {
        "total_price_records": len(records),
        "stale_records": stale,
        "products": db.query(models.Product).count(),
        "branches": db.query(models.Branch).count(),
    }