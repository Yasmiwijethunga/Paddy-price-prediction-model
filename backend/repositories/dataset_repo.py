from sqlalchemy.orm import Session

from models.dataset import Dataset, DatasetType, DatasetStatus


def create_dataset(
    db: Session,
    filename: str,
    dataset_type: DatasetType,
    uploaded_by: int,
) -> Dataset:
    dataset = Dataset(
        filename=filename,
        dataset_type=dataset_type,
        uploaded_by=uploaded_by,
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset


def get_dataset_by_id(db: Session, dataset_id: int) -> Dataset | None:
    return db.query(Dataset).filter(Dataset.id == dataset_id).first()


def get_all_datasets(db: Session) -> list[Dataset]:
    return db.query(Dataset).order_by(Dataset.upload_date.desc()).all()


def update_dataset_status(
    db: Session,
    dataset_id: int,
    status: DatasetStatus,
    record_count: int = 0,
) -> Dataset | None:
    dataset = get_dataset_by_id(db, dataset_id)
    if dataset:
        dataset.status = status
        dataset.record_count = record_count
        db.commit()
        db.refresh(dataset)
    return dataset


def delete_dataset(db: Session, dataset_id: int) -> Dataset | None:
    dataset = get_dataset_by_id(db, dataset_id)
    if dataset:
        db.delete(dataset)
        db.commit()
    return dataset
