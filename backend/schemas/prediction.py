from datetime import datetime
from typing import Optional, Dict, Any

from pydantic import BaseModel


class PredictionRequest(BaseModel):
    """
    Request body for running a price prediction.

    Only `target_year` is required.  All other fields are optional
    inputs that influence the cost-adjustment factor in the placeholder model.
    """
    target_year: int

    # Optional inputs — used by placeholder adjustment and will become
    # ML feature inputs in Phase 2
    cultivated_area: Optional[float] = None
    total_production: Optional[float] = None
    harvest_quantity: Optional[float] = None
    rainfall: Optional[float] = None
    temperature: Optional[float] = None
    fertilizer_price: Optional[float] = None
    seed_cost: Optional[float] = None
    pesticide_cost: Optional[float] = None
    population: Optional[int] = None
    rice_consumption: Optional[float] = None
    notes: Optional[str] = None


class PredictionResult(BaseModel):
    """Response body for a completed prediction record."""
    id: int
    target_year: int
    predicted_price: float
    method: str
    prediction_date: datetime
    input_parameters: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None
    requested_by: int

    class Config:
        from_attributes = True
