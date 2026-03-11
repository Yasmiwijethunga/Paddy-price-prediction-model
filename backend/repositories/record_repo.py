from typing import Optional

from sqlalchemy.orm import Session

from models.paddy_record import PaddyRecord


def bulk_create_records(db: Session, records: list[PaddyRecord]) -> None:
    """Persist a list of PaddyRecord ORM objects in a single commit."""
    db.add_all(records)
    db.commit()


_MERGEABLE_FIELDS = [
    "cultivated_area", "total_production", "harvest_quantity",
    "rainfall", "temperature",
    "fertilizer_price", "seed_cost", "pesticide_cost",
    "population", "rice_consumption", "paddy_price",
]


def bulk_upsert_records(db: Session, records: list[PaddyRecord]) -> None:
    """
    For each record, if a row already exists for the same (year, season,
    district, variety), merge non-None fields into it instead of inserting
    a duplicate row.  Commits once at the end.
    """
    for rec in records:
        existing = (
            db.query(PaddyRecord)
            .filter(
                PaddyRecord.year == rec.year,
                PaddyRecord.season == rec.season,
                PaddyRecord.district == rec.district,
                PaddyRecord.variety == rec.variety,
            )
            .first()
        )
        if existing is None:
            db.add(rec)
        else:
            for field in _MERGEABLE_FIELDS:
                val = getattr(rec, field)
                if val is not None:
                    setattr(existing, field, val)
            existing.dataset_id = rec.dataset_id
    db.commit()


def get_all_records(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> list[PaddyRecord]:
    return (
        db.query(PaddyRecord)
        .order_by(PaddyRecord.year.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_records_by_year(db: Session, year: int) -> list[PaddyRecord]:
    return db.query(PaddyRecord).filter(PaddyRecord.year == year).all()


def get_record_by_id(db: Session, record_id: int) -> Optional[PaddyRecord]:
    return db.query(PaddyRecord).filter(PaddyRecord.id == record_id).first()


def get_available_years(db: Session) -> list[int]:
    """Return a sorted list of distinct years present in the table."""
    results = (
        db.query(PaddyRecord.year)
        .distinct()
        .order_by(PaddyRecord.year.asc())
        .all()
    )
    return [row[0] for row in results]


def get_price_records(
    db: Session,
    n_years: Optional[int] = None,
) -> list[PaddyRecord]:
    """
    Return records that have a non-null paddy_price, ordered most-recent first.
    `n_years` limits how many results are returned (for moving average calculations).
    """
    query = (
        db.query(PaddyRecord)
        .filter(PaddyRecord.paddy_price.isnot(None))
        .order_by(PaddyRecord.year.desc())
    )
    if n_years:
        query = query.limit(n_years)
    return query.all()
