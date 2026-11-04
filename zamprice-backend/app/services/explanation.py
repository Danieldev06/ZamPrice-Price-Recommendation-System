def product_explanation(comparison: dict) -> str:
    opts = comparison.get("options") or []
    if not opts:
        return "No eligible price data available for this product."
    cheapest = comparison["cheapest"]; best_value = comparison["best_value"]
    parts = ["Lowest total price at " + cheapest["supermarket"] + " (" + cheapest["location"] + ") - K"
             + format(cheapest["effective_price"], ".2f") + "."]
    if best_value["branch_id"] != cheapest["branch_id"]:
        parts.append("Best unit value is " + best_value["supermarket"] + " at K"
                     + format(best_value["unit_price"], ".2f") + "/" + best_value["canonical_unit"] + ".")
    stale = [o for o in opts if o["stale"]]
    if stale:
        parts.append("Note: " + str(len(stale)) + " price record(s) are older than the freshness window.")
    return " ".join(parts)

def basket_explanation(plan: dict) -> str:
    return (plan["mode"].replace("_", " ").title() + " plan: K" + format(plan["total"], ".2f")
            + " across " + str(plan["store_count"]) + " store(s) - " + ", ".join(plan["stores"]) + ".")
