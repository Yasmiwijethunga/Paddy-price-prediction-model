from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

from models.dataset import DatasetType, DatasetStatus


class DatasetOut(BaseModel):
    """Response body for a single dataset metadata record."""
    id: int
    filename: str
    dataset_type: DatasetType
    uploaded_by: int
    upload_date: datetime
    record_count: int
    status: DatasetStatus

    class Config:
        from_attributes = True


class DatasetUploadResponse(BaseModel):
    """Response body after a file upload attempt."""
    message: str
    dataset: DatasetOut
    errors: Optional[List[str]] = []
