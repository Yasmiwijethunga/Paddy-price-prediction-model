import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from database import Base


class DatasetType(str, enum.Enum):
    production = "production"   # cultivated_area, total_production, harvest_quantity
    climate = "climate"         # rainfall, temperature
    cost = "cost"               # fertilizer_price, seed_cost, pesticide_cost
    price = "price"             # paddy_price per year
    combined = "combined"       # all or most variables in one file


class DatasetStatus(str, enum.Enum):
    pending = "pending"     # uploaded but not yet processed
    valid = "valid"         # parsed and records persisted successfully
    invalid = "invalid"     # validation or parsing failed


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    dataset_type = Column(Enum(DatasetType), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    record_count = Column(Integer, default=0, nullable=False)
    status = Column(Enum(DatasetStatus), default=DatasetStatus.pending, nullable=False)

    # Relationships
    uploader = relationship("User", back_populates="datasets")
    records = relationship(
        "PaddyRecord",
        back_populates="dataset",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Dataset id={self.id} filename={self.filename} status={self.status}>"
