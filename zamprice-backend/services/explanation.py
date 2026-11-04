def product_explanation(comparison: dict) -> str:
    opts = comparison.get("options") or []
    if not opts:
        return "No eligible price data available for this product."
    cheapest = comparison["cheapest"]; best_value = comparison["best_value"]
    parts = []
    parts.append(
        f"Lowest total price at {cheapest['supermarket']} ({cheapest['location']}) "
        f"— K{cheapest['effective_price']:.2f}."
    )
    if best_value["branch_id"] != cheapest["branch_id"]:
        parts.append(
            f"Best unit value is {best_value['supermarket']} at "
            f"K{best_value['unit_price']:.2f}/{best_value['canonical_unit']}."
        )
    stale = [o for o in opts if o["stale"]]
    if stale:
        parts.append(f"Note: {len(stale)} price record(s) are older than the freshness window.")
    return " ".join(parts)

def basket_explanation(plan: dict) -> str:
    return (
        f"{plan['mode'].replace('_', ' ').title()} plan: K{plan['total']:.2f} across "
        f"{plan['store_count']} store(s) — {', '.join(plan['stores'])}."
    )