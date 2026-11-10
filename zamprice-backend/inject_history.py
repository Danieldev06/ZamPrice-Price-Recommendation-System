import random
from datetime import datetime, timedelta, timezone
from app.db.session import SessionLocal
from app import models

def inject_history():
    db = SessionLocal()
    
    # 1. Get all current price records to use as our "base" prices
    base_records = db.query(models.PriceRecord).all()
    
    if not base_records:
        print("❌ No price records found. Please run 'python seed.py' first to populate the database.")
        return

    print(f"Found {len(base_records)} base price records. Generating 60 days of history...")
    
    now = datetime.now(timezone.utc)
    days_of_history = 60
    new_records_count = 0

    # 2. Loop through the last 60 days
    for days_ago in range(1, days_of_history + 1):
        # Create a timestamp for that specific day in the past
        past_date = now - timedelta(days=days_ago)
        
        for base in base_records:
            # 3. Create realistic price fluctuation (between -8% and +8%)
            variation = random.uniform(-0.08, 0.08)
            new_price = round(base.price * (1 + variation), 2)
            
            # 4. Create the new historical record
            history_record = models.PriceRecord(
                product_id=base.product_id,
                branch_id=base.branch_id,
                quantity=base.quantity,
                unit=base.unit,
                price=new_price,
                available=True,
                observed_at=past_date,
                source="simulated_history"
            )
            db.add(history_record)
            new_records_count += 1

    # 5. Save to database
    db.commit()
    db.close()
    
    print(f" Successfully injected {new_records_count} historical price records over the last {days_of_history} days!")

if __name__ == "__main__":
    inject_history()