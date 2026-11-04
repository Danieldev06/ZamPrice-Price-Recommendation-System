from datetime import datetime, timezone, timedelta
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.core.security import hash_password
from app import models

Base.metadata.create_all(engine)
db = SessionLocal()

if not db.query(models.User).filter_by(email="admin@zamprice.com").first():
    db.add(models.User(name="Admin", email="admin@zamprice.com",
                       password_hash=hash_password("admin123"), role="admin"))
if not db.query(models.User).filter_by(email="demo@zamprice.com").first():
    db.add(models.User(name="Demo User", email="demo@zamprice.com",
                       password_hash=hash_password("demo123"), role="consumer"))
db.commit()

stores = {}
for name in ["Shoprite", "Choppies", "Pick n Pay"]:
    s = db.query(models.Supermarket).filter_by(name=name).first()
    if not s:
        s = models.Supermarket(name=name); db.add(s); db.commit()
    stores[name] = s

branches = {}
for name, location in [("Shoprite", "Manda Hill"), ("Shoprite", "Cairo Road"),
                       ("Choppies", "Kabwata"), ("Choppies", "Woodlands"),
                       ("Pick n Pay", "Makeni"), ("Pick n Pay", "Arcades")]:
    b = db.query(models.Branch).filter_by(supermarket_id=stores[name].id, location=location).first()
    if not b:
        b = models.Branch(supermarket_id=stores[name].id, location=location)
        db.add(b); db.commit()
    branches[(name, location)] = b

def get_or_create_product(name, brand, category, base_unit):
    p = db.query(models.Product).filter_by(name=name).first()
    if not p:
        p = models.Product(name=name, brand=brand, category=category, base_unit=base_unit)
        db.add(p); db.commit()
    return p

products = {
    "oil_2l":  get_or_create_product("Cooking Oil 2L", "Zambeef", "Cooking Oil", "L"),
    "oil_5l":  get_or_create_product("Cooking Oil 5L", "Zambeef", "Cooking Oil", "L"),
    "meal_25": get_or_create_product("Mealie Meal 25kg", "Brenda", "Mealie Meal", "kg"),
    "meal_10": get_or_create_product("Mealie Meal 10kg", "Brenda", "Mealie Meal", "kg"),
    "sugar_2": get_or_create_product("Sugar 2kg", "Zambia Sugar", "Sugar", "kg"),
    "rice_5":  get_or_create_product("Rice 5kg", "Tastic", "Rice", "kg"),
    "milk_1":  get_or_create_product("Milk 1L", "Parmalat", "Milk", "L"),
}

now = datetime.now(timezone.utc)

def add_price(product_key, store, location, qty, unit, price, days_ago=1, promo=None):
    pid = products[product_key].id
    bid = branches[(store, location)].id
    if db.query(models.PriceRecord).filter_by(product_id=pid, branch_id=bid, price=price).first():
        return
    db.add(models.PriceRecord(product_id=pid, branch_id=bid, quantity=qty, unit=unit,
                              price=price, promotional_price=promo,
                              observed_at=now - timedelta(days=days_ago), source="seed"))

add_price("oil_2l", "Shoprite", "Manda Hill", 2, "L", 89.99)
add_price("oil_2l", "Choppies", "Kabwata", 2, "L", 92.50)
add_price("oil_2l", "Pick n Pay", "Makeni", 2, "L", 87.00, promo=82.00)
add_price("oil_5l", "Shoprite", "Manda Hill", 5, "L", 210.00)
add_price("oil_5l", "Choppies", "Kabwata", 5, "L", 205.00)
add_price("meal_25", "Shoprite", "Manda Hill", 25, "kg", 290.00)
add_price("meal_25", "Choppies", "Kabwata", 25, "kg", 285.00)
add_price("meal_25", "Pick n Pay", "Makeni", 25, "kg", 295.00)
add_price("meal_10", "Shoprite", "Manda Hill", 10, "kg", 130.00)
add_price("meal_10", "Choppies", "Kabwata", 10, "kg", 118.00)
add_price("sugar_2", "Shoprite", "Manda Hill", 2, "kg", 55.00)
add_price("sugar_2", "Choppies", "Kabwata", 2, "kg", 53.00)
add_price("sugar_2", "Pick n Pay", "Makeni", 2, "kg", 58.00)
add_price("rice_5", "Shoprite", "Manda Hill", 5, "kg", 95.00)
add_price("rice_5", "Choppies", "Kabwata", 5, "kg", 99.00)
add_price("milk_1", "Shoprite", "Cairo Road", 1, "L", 22.50)
add_price("milk_1", "Choppies", "Woodlands", 1, "L", 21.00)
add_price("milk_1", "Pick n Pay", "Arcades", 1, "L", 23.00)
# extra milk observations so a single-store basket is possible for the demo
add_price("milk_1", "Shoprite", "Manda Hill", 1, "L", 22.00, days_ago=2)
add_price("milk_1", "Choppies", "Kabwata", 1, "L", 21.50, days_ago=1)
add_price("milk_1", "Pick n Pay", "Makeni", 1, "L", 22.75, days_ago=3)

db.commit()
print("Seed complete.")
