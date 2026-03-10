import os
import shutil

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from config import settings
from models.dataset import DatasetStatus, DatasetType
from models.paddy_record import PaddyRecord
from repositories import dataset_repo, record_repo
from utils.file_parser import parse_file
from utils.validators import validate_columns, validate_record

# Ensure the uploads directory exists on startup
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


def upload_dataset(
    db: Session,
    file: UploadFile,
    dataset_type: DatasetType,
    user_id: int,
) -> dict:
    """
    Full pipeline for a dataset upload:
      1. Save the file to disk
      2. Create a Dataset metadata record (status=pending)
      3. Parse the file with Pandas
      4. Validate column presence
      5. Validate each row; collect errors
      6. Convert valid rows to PaddyRecord ORM objects
      7. Bulk-insert records
      8. Update dataset status → valid / invalid

    Returns a dict with 'message', 'dataset', and 'errors'.
    """
    # Validate extension before saving
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{ext}'. Allowed: {settings.ALLOWED_EXTENSIONS}",
        )

    # Save to disk
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create metadata record
    dataset = dataset_repo.create_dataset(db, file.filename, dataset_type, user_id)

    # Parse
    try:
        records_data = parse_file(file_path)
    except Exception as exc:
        dataset_repo.update_dataset_status(db, dataset.id, DatasetStatus.invalid)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File parsing failed: {exc}",
        )

    # Column-level validation
    is_valid, col_errors = validate_columns(records_data, dataset_type.value)
    if not is_valid:
        dataset_repo.update_dataset_status(db, dataset.id, DatasetStatus.invalid)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=col_errors)

    # Row-level validation and ORM mapping
    orm_records: list[PaddyRecord] = []
    all_errors: list[str] = []

    for i, row in enumerate(records_data, start=1):
        valid, row_errors = validate_record(row, i)
        if row_errors:
            all_errors.extend(row_errors)
        if valid:
            orm_records.append(
                PaddyRecord(
                    dataset_id=dataset.id,
                    year=int(row["year"]),
                    season=settings.SEASON,
                    variety=settings.VARIETY,
                    district=settings.DISTRICT,
                    cultivated_area=_safe_float(row.get("cultivated_area")),
                    total_production=_safe_float(row.get("total_production")),
                    harvest_quantity=_safe_float(row.get("harvest_quantity")),
                    rainfall=_safe_float(row.get("rainfall")),
                    temperature=_safe_float(row.get("temperature")),
                    fertilizer_price=_safe_float(row.get("fertilizer_price")),
                    seed_cost=_safe_float(row.get("seed_cost")),
                    pesticide_cost=_safe_float(row.get("pesticide_cost")),
                    population=_safe_int(row.get("population")),
                    rice_consumption=_safe_float(row.get("rice_consumption")),
                    paddy_price=_safe_float(row.get("paddy_price")),
                )
            )

    if orm_records:
        record_repo.bulk_upsert_records(db, orm_records)

    final_status = DatasetStatus.valid if orm_records else DatasetStatus.invalid
    dataset_repo.update_dataset_status(db, dataset.id, final_status, len(orm_records))
    db.refresh(dataset)

    return {
        "message": f"Dataset uploaded. {len(orm_records)} record(s) saved.",
        "dataset": dataset,
        "errors": all_errors,
    }


def get_all_datasets(db: Session):
    return dataset_repo.get_all_datasets(db)


def get_dataset_by_id(db: Session, dataset_id: int):
    dataset = dataset_repo.get_dataset_by_id(db, dataset_id)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with id={dataset_id} not found.",
        )
    return dataset


def delete_dataset(db: Session, dataset_id: int):
    dataset = dataset_repo.get_dataset_by_id(db, dataset_id)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with id={dataset_id} not found.",
        )
    return dataset_repo.delete_dataset(db, dataset_id)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _safe_float(value) -> float | None:
    try:
        return float(value) if value is not None else None
    except (ValueError, TypeError):
        return None


def _safe_int(value) -> int | None:
    try:
        return int(value) if value is not None else None
    except (ValueError, TypeError):
        return None
