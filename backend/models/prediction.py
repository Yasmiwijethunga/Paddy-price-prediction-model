from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


class Prediction(Base):
    """
    Stores every prediction run as a history log entry.

    The `method` field identifies the prediction strategy used:
      - Phase 1  →  "moving_average_v1_placeholder"
      - Phase 2  →  e.g. "random_forest_v1" once ML is integrated

    `input_parameters` is a JSON snapshot of all inputs supplied at
    the time of prediction, ensuring the run is reproducible for audit.
    """

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    requested_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    prediction_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    target_year = Column(Integer, nullable=False)
    input_parameters = Column(JSON, nullable=True)         # full snapshot
    predicted_price = Column(Float, nullable=False)        # LKR per bushel
    method = Column(
        String(100),
        default="moving_average_v1_placeholder",
        nullable=False,
    )
    notes = Column(String(500), nullable=True)

    # Relationship
    requester = relationship("User", back_populates="predictions")

    def __repr__(self) -> str:
        return (
            f"<Prediction id={self.id} year={self.target_year} "
            f"price={self.predicted_price} method={self.method}>"
        )
