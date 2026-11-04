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
