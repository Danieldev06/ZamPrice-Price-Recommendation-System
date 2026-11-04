from datetime import datetime
from pydantic import BaseModel

class AlertIn(BaseModel):
    product_id: int
    target_price: float

class AlertOut(BaseModel):
    id: int; product_id: int; target_price: float; status: str
    last_triggered_at: datetime | None = None
    class Config: from_attributes = True
