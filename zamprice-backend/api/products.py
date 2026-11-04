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
def list_products(q: str | None = None, category: str | None = None,
                  db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if q:
        query = query.filter(models.Product.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(models.Product.category == category)
    return query.limit(100).all()

@router.get("/{product_id}/comparison", response_model=ComparisonOut,
            dependencies=[Depends(get_current_user)])
def comparison(product_id: int, db: Session = Depends(get_db)):
    result = compare_product(db, product_id)
    if "error" in result:
        raise HTTPException(404, result["error"])
    result["explanation"] = product_explanation(result)
    return result

@router.get("/{product_id}/history", dependencies=[Depends(get_current_user)])
def history(product_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(models.PriceRecord)
        .filter(models.PriceRecord.product_id == product_id)
        .order_by(models.PriceRecord.observed_at.asc())
        .all()
    )
    return [
        {
            "observed_at": r.observed_at,
            "branch_id": r.branch_id,
            "price": float(r.price),
            "promotional_price": float(r.promotional_price) if r.promotional_price else None,
            "quantity": float(r.quantity),
            "unit": r.unit,
        }
        for r in rows
    ]

@router.get("/{product_id}/alternatives", dependencies=[Depends(get_current_user)])
def alternatives(product_id: int, db: Session = Depends(get_db)):
    """Cheaper substitutes: same category, lower unit price."""
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    comp = compare_product(db, product_id)
    if not comp.get("best_value"):
        return {"alternatives": []}
    ref_unit_price = comp["best_value"]["unit_price"]
    ref_canon = comp["best_value"]["canonical_unit"]

    candidates = (
        db.query(models.Product)
        .filter(models.Product.id != product_id)
        .filter(models.Product.category == product.category)
        .limit(50).all()
    )
    results = []
    for cand in candidates:
        c = compare_product(db, cand.id)
        bv = c.get("best_value")
        if bv and bv["canonical_unit"] == ref_canon and bv["unit_price"] < ref_unit_price:
            results.append({
                "product_id": cand.id,
                "product_name": cand.name,
                "best_unit_price": bv["unit_price"],
                "saving_per_unit": round(ref_unit_price - bv["unit_price"], 4),
                "canonical_unit": ref_canon,
                "store": bv["supermarket"],
            })
    results.sort(key=lambda x: -x["saving_per_unit"])
    return {"reference_unit_price": ref_unit_price, "canonical_unit": ref_canon,
            "alternatives": results[:10]}