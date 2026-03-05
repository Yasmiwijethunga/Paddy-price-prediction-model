from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

# SQLite engine — check_same_thread=False required for SQLite with FastAPI
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All ORM models inherit from this Base
Base = declarative_base()


def create_tables() -> None:
    """
    Import all models so SQLAlchemy registers them with Base.metadata,
    then create all tables if they do not yet exist.
    """
    # Explicit imports ensure models are registered before create_all
    from models import user, dataset, paddy_record, prediction  # noqa: F401

    Base.metadata.create_all(bind=engine)
