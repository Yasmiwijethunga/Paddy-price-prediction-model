from typing import Any

from sqlalchemy.orm import Session

from repositories import record_repo


def get_summary(db: Session) -> dict[str, Any]:
    """Return high-level statistics across all price records."""
    records = record_repo.get_price_records(db)
    if not records:
        return {"message": "No paddy records with price data are available yet."}

    prices = [r.paddy_price for r in records if r.paddy_price is not None]
    years = [r.year for r in records]

    return {
        "total_records": len(records),
        "year_range": {"min": min(years), "max": max(years)},
        "price_stats": {
            "min_price":  round(min(prices), 2),
            "max_price":  round(max(prices), 2),
            "avg_price":  round(sum(prices) / len(prices), 2),
        },
        "district": records[0].district if records else None,
        "season":   records[0].season   if records else None,
        "variety":  records[0].variety  if records else None,
    }


def get_trends(db: Session) -> list[dict[str, Any]]:
    """
    Return year-over-year price trend data alongside key production variables.
    Each entry includes a price_change_percent relative to the previous year.
    """
    records = sorted(record_repo.get_price_records(db), key=lambda r: r.year)
    trends: list[dict[str, Any]] = []

    for i, r in enumerate(records):
        prev_price = records[i - 1].paddy_price if i > 0 else None
        change_pct: float | None = None
        if prev_price and r.paddy_price:
            change_pct = round(((r.paddy_price - prev_price) / prev_price) * 100, 2)

        trends.append({
            "year":                 r.year,
            "paddy_price":          r.paddy_price,
            "price_change_percent": change_pct,
            "cultivated_area":      r.cultivated_area,
            "total_production":     r.total_production,
            "harvest_quantity":     r.harvest_quantity,
            "rainfall":             r.rainfall,
            "temperature":          r.temperature,
        })

    return trends


def get_by_year(db: Session, year: int) -> dict[str, Any]:
    """Return a fully detailed breakdown for a specific year."""
    records = record_repo.get_records_by_year(db, year)
    if not records:
        return {"message": f"No data records found for year {year}."}

    r = records[0]
    return {
        "year":     r.year,
        "district": r.district,
        "season":   r.season,
        "variety":  r.variety,
        "production": {
            "cultivated_area":  r.cultivated_area,
            "total_production": r.total_production,
            "harvest_quantity": r.harvest_quantity,
        },
        "climate": {
            "rainfall":    r.rainfall,
            "temperature": r.temperature,
        },
        "input_costs": {
            "fertilizer_price": r.fertilizer_price,
            "seed_cost":        r.seed_cost,
            "pesticide_cost":   r.pesticide_cost,
        },
        "demand": {
            "population":       r.population,
            "rice_consumption": r.rice_consumption,
        },
        "paddy_price": r.paddy_price,
    }


def get_correlations(db: Session) -> dict[str, Any]:
    """
    Compute Pearson correlation coefficients between paddy_price and each
    predictor variable.  Requires at least 3 records with price data.
    """
    records = record_repo.get_price_records(db)
    if len(records) < 3:
        return {"message": "At least 3 price records are required for correlation analysis."}

    prices = [r.paddy_price for r in records]

    variables = [
        "cultivated_area", "total_production", "harvest_quantity",
        "rainfall", "temperature", "fertilizer_price",
        "seed_cost", "pesticide_cost", "rice_consumption",
    ]

    correlations: dict[str, float | None] = {}
    for var in variables:
        vals = [getattr(r, var) for r in records]
        correlations[var] = _pearson_r(vals, prices)

    return {
        "note": "Pearson correlation with paddy_price (range: -1.0 to +1.0)",
        "correlations_with_paddy_price": correlations,
    }


# ---------------------------------------------------------------------------
# Internal helper
# ---------------------------------------------------------------------------

def _pearson_r(x_vals: list, y_vals: list) -> float | None:
    """Simple Pearson r — filters out None pairs."""
    pairs = [
        (float(x), float(y))
        for x, y in zip(x_vals, y_vals)
        if x is not None and y is not None
    ]
    n = len(pairs)
    if n < 2:
        return None

    xs, ys = zip(*pairs)
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n

    numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    denom_x = sum((x - mean_x) ** 2 for x in xs) ** 0.5
    denom_y = sum((y - mean_y) ** 2 for y in ys) ** 0.5

    if denom_x == 0 or denom_y == 0:
        return None

    return round(numerator / (denom_x * denom_y), 4)
