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
