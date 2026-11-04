from itertools import combinations
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from app import models
from app.services.comparison import _effective_price, _is_stale
from app.services.units import unit_price

def _price_map(db: Session, product_ids: list[int]) -> dict[int, dict[int, dict]]:
    """{product_id: {branch_id: {price, unit_price, ...}}}"""
    now = datetime.now(timezone.utc)
    records = (
        db.query(models.PriceRecord)
        .options(joinedload(models.PriceRecord.branch).joinedload(models.Branch.supermarket))
        .filter(models.PriceRecord.product_id.in_(product_ids))
        .all()
    )
    out: dict[int, dict[int, dict]] = {pid: {} for pid in product_ids}
    for r in records:
        if not r.available or _is_stale(r, now):
            continue
        eff = _effective_price(r, now)
        try:
            up, canon = unit_price(eff, r.quantity, r.unit)
        except ValueError:
            continue
        out[r.product_id][r.branch_id] = {
            "branch_id": r.branch_id,
            "supermarket": r.branch.supermarket.name,
            "location": r.branch.location,
            "effective_price": eff,
            "unit_price": up,
            "canonical_unit": canon,
        }
    return out

def _plan(items, p_map, branch_ids: set[int], w: float, conv_cost: float) -> dict | None:
    lines, total = [], 0.0
    for item in items:
        candidates = [p_map[item["product_id"]][bid] for bid in branch_ids if bid in p_map[item["product_id"]]]
        if not candidates:
            return None
        chosen = min(candidates, key=lambda c: c["effective_price"])
        line_total = round(chosen["effective_price"] * item["quantity"], 2)
        total += line_total
        lines.append({
            "product_id": item["product_id"],
            "product_name": item["name"],
            "branch_id": chosen["branch_id"],
            "supermarket": chosen["supermarket"],
            "location": chosen["location"],
            "unit_price": chosen["unit_price"],
            "quantity": item["quantity"],
            "line_total": line_total,
        })
    score = round(total + w * conv_cost * len(branch_ids), 2)
    return {
        "total": round(total, 2),
        "score": score,
        "store_count": len(branch_ids),
        "stores": sorted({l["supermarket"] for l in lines}),
        "lines": lines,
    }

def optimize(db: Session, items: list[dict], mode: str, w: float, conv_cost: float, budget: float | None) -> dict:
    product_ids = [i["product_id"] for i in items]
    p_map = _price_map(db, product_ids)

    # candidate branches = union of branches that carry at least one item
    candidates = sorted({bid for pid in product_ids for bid in p_map[pid]})
    if not candidates:
        return {"plans": [], "baseline_single_store": None, "saving_vs_baseline": None,
                "error": "No eligible price data for any item"}

    plans: list[dict] = []
    # 1) cheapest multi-store  (w = 0)
    best_multi = None
    for k in range(1, min(len(candidates), 6) + 1):  # cap at 6 stores
        for subset in combinations(candidates, k):
            p = _plan(items, p_map, set(subset), 0.0, conv_cost)
            if p and (best_multi is None or p["total"] < best_multi["total"]):
                best_multi = p
    if best_multi: plans.append({**best_multi, "mode": "cheapest"})

    # 2) best single store
    best_single = None
    for bid in candidates:
        p = _plan(items, p_map, {bid}, 0.0, conv_cost)
        if p and (best_single is None or p["total"] < best_single["total"]):
            best_single = p
    if best_single: plans.append({**best_single, "mode": "single_store"})

    # 3) convenience (w > 0)
    if mode == "convenience" or w > 0:
        best_conv = None
        for k in range(1, min(len(candidates), 4) + 1):
            for subset in combinations(candidates, k):
                p = _plan(items, p_map, set(subset), w or 1.0, conv_cost)
                if p and (best_conv is None or p["score"] < best_conv["score"]):
                    best_conv = p
        if best_conv: plans.append({**best_conv, "mode": "convenience"})

    # dedupe by (total, stores)
    seen, unique = set(), []
    for p in plans:
        key = (p["total"], tuple(p["stores"]))
        if key not in seen:
            seen.add(key); unique.append(p)

    for p in unique:
        p["within_budget"] = (p["total"] <= budget) if budget else None

    return {
        "plans": unique,
        "baseline_single_store": best_single,
        "saving_vs_baseline": round(best_single["total"] - best_multi["total"], 2) if best_single and best_multi else None,
    }