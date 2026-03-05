"""
prediction_service.py
─────────────────────
Phase 1  — Placeholder prediction engine
Phase 2  — Replace `run_prediction` body with ML model inference (same interface)

Current algorithm:
  1. Fetch the last 5 years of paddy_price records (most-recent first).
  2. Compute a linearly-weighted moving average (most-recent year gets highest weight).
  3. Apply a cost-adjustment factor derived from the sum of fertilizer + seed + pesticide
     costs provided in the request.
  4. Persist to the predictions table and return the ORM object.
"""

from datetime import datetime

from sqlalchemy.orm import Session

from models.prediction import Prediction
from repositories import prediction_repo, record_repo
from schemas.prediction import PredictionRequest

# ── Placeholder constants ──────────────────────────────────────────────────
_DEFAULT_FALLBACK_PRICE = 2500.0   # LKR/bushel used when no historical data
_LOOKBACK_YEARS = 5
_COST_SCALE_FACTOR = 50_000        # every 50 000 LKR in total cost ≈ 10% price rise
_METHOD_TAG = "moving_average_v1_placeholder"


def run_prediction(
    db: Session,
    request: PredictionRequest,
    user_id: int,
) -> Prediction:
    """
    Execute a price prediction and persist the result.

    ─────────────────────────────────────────────────────────────────────────
    TO INTEGRATE AN ML MODEL (Phase 2)
    ─────────────────────────────────────────────────────────────────────────
    Replace the body of this function with:

        feature_vector = _build_feature_vector(request)
        model = _load_model()
        predicted_price = float(model.predict([feature_vector])[0])
        method_tag = "random_forest_v1"   # or whatever model you use

    The rest of the function (building Prediction, calling prediction_repo)
    remains unchanged.
    ─────────────────────────────────────────────────────────────────────────
    """

    # ── Step 1: Get historical prices ──────────────────────────────────────
    price_records = record_repo.get_price_records(db, n_years=_LOOKBACK_YEARS)

    if not price_records:
        base_price = _DEFAULT_FALLBACK_PRICE
    else:
        # Linearly-weighted moving average
        # price_records is ordered most-recent first; reverse for weighting
        prices = list(reversed([r.paddy_price for r in price_records if r.paddy_price]))
        weights = list(range(1, len(prices) + 1))   # [1, 2, 3, …]
        base_price = sum(p * w for p, w in zip(prices, weights)) / sum(weights)

    # ── Step 2: Cost adjustment factor ─────────────────────────────────────
    adjustment_factor = 1.0
    total_input_cost = (
        (request.fertilizer_price or 0.0)
        + (request.seed_cost or 0.0)
        + (request.pesticide_cost or 0.0)
    )
    if total_input_cost > 0:
        # e.g. 50 000 LKR total cost → +10 % price
        adjustment_factor = 1.0 + (total_input_cost / _COST_SCALE_FACTOR) * 0.1

    predicted_price = round(base_price * adjustment_factor, 2)

    # ── Step 3: Build input snapshot ───────────────────────────────────────
    input_params = {
        "target_year":       request.target_year,
        "cultivated_area":   request.cultivated_area,
        "total_production":  request.total_production,
        "harvest_quantity":  request.harvest_quantity,
        "rainfall":          request.rainfall,
        "temperature":       request.temperature,
        "fertilizer_price":  request.fertilizer_price,
        "seed_cost":         request.seed_cost,
        "pesticide_cost":    request.pesticide_cost,
        "population":        request.population,
        "rice_consumption":  request.rice_consumption,
        "lookback_years_used": len(price_records),
        "adjustment_factor": round(adjustment_factor, 4),
    }

    # ── Step 4: Persist and return ─────────────────────────────────────────
    prediction = Prediction(
        requested_by=user_id,
        prediction_date=datetime.utcnow(),
        target_year=request.target_year,
        input_parameters=input_params,
        predicted_price=predicted_price,
        method=_METHOD_TAG,
        notes=request.notes,
    )
    return prediction_repo.create_prediction(db, prediction)
