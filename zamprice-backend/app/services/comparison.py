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
