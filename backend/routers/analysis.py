from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from dependencies import get_db, get_current_user
from services import analysis_service

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.get("/summary")
def summary(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """
    Return overall statistics:
    total records, year range, min/max/avg paddy price.
    """
    return analysis_service.get_summary(db)


@router.get("/trends")
def trends(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """
    Return year-over-year price trend data with production and climate variables.
    Each entry includes a price_change_percent relative to the previous year.
    """
    return analysis_service.get_trends(db)


@router.get("/by-year/{year}")
def by_year(year: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """
    Return a full variable breakdown for a specific year:
    production, climate, input costs, demand, and paddy price.
    """
    return analysis_service.get_by_year(db, year)


@router.get("/correlations")
def correlations(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """
    Return Pearson correlation coefficients between paddy_price and each
    predictor variable.  Requires at least 3 records.
    """
    return analysis_service.get_correlations(db)
