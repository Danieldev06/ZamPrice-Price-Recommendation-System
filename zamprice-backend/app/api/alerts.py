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
