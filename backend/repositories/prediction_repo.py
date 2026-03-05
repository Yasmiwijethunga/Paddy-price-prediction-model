from sqlalchemy.orm import Session

from models.prediction import Prediction


def create_prediction(db: Session, prediction: Prediction) -> Prediction:
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction


def get_prediction_by_id(db: Session, prediction_id: int) -> Prediction | None:
    return db.query(Prediction).filter(Prediction.id == prediction_id).first()


def get_predictions_by_user(db: Session, user_id: int) -> list[Prediction]:
    return (
        db.query(Prediction)
        .filter(Prediction.requested_by == user_id)
        .order_by(Prediction.prediction_date.desc())
        .all()
    )


def get_all_predictions(db: Session) -> list[Prediction]:
    return (
        db.query(Prediction)
        .order_by(Prediction.prediction_date.desc())
        .all()
    )
