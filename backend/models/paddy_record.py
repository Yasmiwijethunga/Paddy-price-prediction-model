from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class PaddyRecord(Base):
    """
    Central data table.  One row represents one year of aggregated data
    for Anuradhapura District, Maha Season, Nadu variety.

    All three scope fields (district, season, variety) are injected by the
    system at parse time — they are never read from the uploaded file.
    """

    __tablename__ = "paddy_records"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)

    # Scope (always fixed)
    year = Column(Integer, nullable=False, index=True)
    season = Column(String(20), default="Maha", nullable=False)
    variety = Column(String(50), default="Nadu", nullable=False)
    district = Column(String(100), default="Anuradhapura", nullable=False)

    # ── Production Variables ─────────────────────────────────────────────
    cultivated_area = Column(Float, nullable=True)    # hectares
    total_production = Column(Float, nullable=True)   # metric tons
    harvest_quantity = Column(Float, nullable=True)   # metric tons

    # ── Climate Variables ────────────────────────────────────────────────
    rainfall = Column(Float, nullable=True)           # mm
    temperature = Column(Float, nullable=True)        # °C

    # ── Agricultural Input Costs ─────────────────────────────────────────
    fertilizer_price = Column(Float, nullable=True)   # LKR
    seed_cost = Column(Float, nullable=True)          # LKR
    pesticide_cost = Column(Float, nullable=True)     # LKR

    # ── Demand Indicators ────────────────────────────────────────────────
    population = Column(Integer, nullable=True)
    rice_consumption = Column(Float, nullable=True)   # metric tons

    # ── Market Data ──────────────────────────────────────────────────────
    paddy_price = Column(Float, nullable=True)        # LKR per bushel

    # Relationship
    dataset = relationship("Dataset", back_populates="records")

    def __repr__(self) -> str:
        return (
            f"<PaddyRecord id={self.id} year={self.year} "
            f"district={self.district} paddy_price={self.paddy_price}>"
        )
