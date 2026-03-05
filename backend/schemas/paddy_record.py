from typing import Optional

from pydantic import BaseModel


class PaddyRecordOut(BaseModel):
    """Response body for a single paddy data record row."""
    id: int
    dataset_id: int
    year: int
    season: str
    variety: str
    district: str

    # Production
    cultivated_area: Optional[float] = None
    total_production: Optional[float] = None
    harvest_quantity: Optional[float] = None

    # Climate
    rainfall: Optional[float] = None
    temperature: Optional[float] = None

    # Input Costs
    fertilizer_price: Optional[float] = None
    seed_cost: Optional[float] = None
    pesticide_cost: Optional[float] = None

    # Demand
    population: Optional[int] = None
    rice_consumption: Optional[float] = None

    # Market
    paddy_price: Optional[float] = None

    class Config:
        from_attributes = True
