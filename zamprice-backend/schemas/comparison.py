from datetime import datetime
from pydantic import BaseModel

class PriceOption(BaseModel):
    branch_id: int; supermarket: str; location: str
    price: float; promotional_price: float | None
    effective_price: float; quantity: float; unit: str
    unit_price: float; canonical_unit: str
    available: bool; observed_at: datetime; stale: bool
    saving_vs_best: float; is_best_total: bool; is_best_unit: bool

class ComparisonOut(BaseModel):
    product_id: int; product_name: str
    options: list[PriceOption]
    cheapest: PriceOption | None
    best_value: PriceOption | None
    explanation: str | None = None