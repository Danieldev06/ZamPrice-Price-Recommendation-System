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
