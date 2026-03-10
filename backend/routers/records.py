import csv
import io
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from dependencies import get_db, get_current_user
from repositories import record_repo
from schemas.paddy_record import PaddyRecordOut

router = APIRouter(prefix="/records", tags=["Records"])


@router.get("/years")
def get_available_years(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Return a sorted list of years that have at least one paddy record."""
    return {"years": record_repo.get_available_years(db)}


@router.get("/", response_model=List[PaddyRecordOut])
def list_records(
    year: Optional[int] = Query(None, description="Filter records by a specific year"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """
    Retrieve paddy data records.
    Optionally filter by year.  Supports pagination via skip/limit.
    """
    if year is not None:
        return record_repo.get_records_by_year(db, year)
    return record_repo.get_all_records(db, skip=skip, limit=limit)


@router.get("/export/csv")
def export_records_csv(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Download all paddy records as a CSV file."""
    records = record_repo.get_all_records(db, skip=0, limit=10000)

    columns = [
        "id", "year", "season", "variety", "district",
        "cultivated_area", "total_production", "harvest_quantity",
        "rainfall", "temperature",
        "fertilizer_price", "seed_cost", "pesticide_cost",
        "population", "rice_consumption", "paddy_price",
    ]

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=columns, extrasaction="ignore")
    writer.writeheader()
    for rec in records:
        writer.writerow({col: getattr(rec, col, "") for col in columns})

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=paddy_records.csv"},
    )


@router.get("/{record_id}", response_model=PaddyRecordOut)
def get_record(
    record_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Retrieve a single paddy record by its primary key."""
    record = record_repo.get_record_by_id(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Record id={record_id} not found.")
    return record
