from typing import Tuple

# Everything is normalised to kg / L / item.
_TO_CANONICAL = {
    "kg": ("kg", 1.0),
    "g":  ("kg", 0.001),
    "L":  ("L",  1.0),
    "ml": ("L",  0.001),
    "item": ("item", 1.0),
}

def canonicalise(quantity: float, unit: str) -> Tuple[float, str]:
    key = unit.strip()
    if key not in _TO_CANONICAL:
        raise ValueError(f"Unsupported unit: {unit}")
    canonical_unit, factor = _TO_CANONICAL[key]
    return float(quantity) * factor, canonical_unit

def unit_price(price: float, quantity: float, unit: str) -> Tuple[float, str]:
    q, canon = canonicalise(quantity, unit)
    if q <= 0:
        raise ValueError("Quantity must be > 0")
    return round(float(price) / q, 4), canon