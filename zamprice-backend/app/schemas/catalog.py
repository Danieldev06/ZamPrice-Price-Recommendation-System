from pydantic import BaseModel

class ProductOut(BaseModel):
    id: int; name: str; brand: str | None = None
    category: str | None = None; base_unit: str
    class Config: from_attributes = True

class PriceRecordIn(BaseModel):
    product_id: int
    branch_id: int
    quantity: float
    unit: str
    price: float
    promotional_price: float | None = None
    available: bool = True
    source: str | None = None
