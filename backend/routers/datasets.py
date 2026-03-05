from typing import List

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from dependencies import get_db, get_current_user, require_admin
from models.dataset import DatasetType
from schemas.dataset import DatasetOut, DatasetUploadResponse
from services import dataset_service

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.post("/upload", response_model=DatasetUploadResponse, status_code=201)
def upload(
    file: UploadFile = File(...),
    dataset_type: DatasetType = Form(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Upload a CSV or Excel dataset file.
    The file is parsed, validated, and its rows are persisted as PaddyRecords.
    Admin only.
    """
    return dataset_service.upload_dataset(db, file, dataset_type, current_user.id)


@router.get("/", response_model=List[DatasetOut])
def list_datasets(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """List all uploaded datasets with their metadata."""
    return dataset_service.get_all_datasets(db)


@router.get("/{dataset_id}", response_model=DatasetOut)
def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Retrieve a single dataset's metadata by id."""
    return dataset_service.get_dataset_by_id(db, dataset_id)


@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    """Delete a dataset and all its associated paddy records. Admin only."""
    dataset_service.delete_dataset(db, dataset_id)
    return {"message": f"Dataset {dataset_id} and its records have been deleted."}
