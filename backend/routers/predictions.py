from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db, get_current_user, require_admin
from repositories import prediction_repo
from schemas.prediction import PredictionRequest, PredictionResult
from services import prediction_service

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.post("/run", response_model=PredictionResult, status_code=201)
def run_prediction(
    request: PredictionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Run a paddy price prediction for the given target year and optional inputs.
    The result is saved to prediction history automatically.
    """
    return prediction_service.run_prediction(db, request, current_user.id)


@router.get("/history", response_model=List[PredictionResult])
def my_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Return all past predictions made by the currently authenticated user."""
    return prediction_repo.get_predictions_by_user(db, current_user.id)


@router.get("/history/all", response_model=List[PredictionResult])
def all_history(
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    """Return prediction history for all users. Admin only."""
    return prediction_repo.get_all_predictions(db)


@router.get("/{prediction_id}", response_model=PredictionResult)
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Retrieve a single prediction by id.
    Users can only view their own predictions; admins can view any.
    """
    pred = prediction_repo.get_prediction_by_id(db, prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail=f"Prediction id={prediction_id} not found.")
    if pred.requested_by != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to view this prediction.")
    return pred
