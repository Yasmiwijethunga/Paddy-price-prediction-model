from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.user import UserRole
from repositories import user_repo


def get_all_users(db: Session):
    return user_repo.get_all_users(db)


def update_role(db: Session, user_id: int, role: UserRole):
    user = user_repo.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id={user_id} not found.",
        )
    return user_repo.update_user_role(db, user_id, role)


def deactivate_user(db: Session, user_id: int):
    user = user_repo.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id={user_id} not found.",
        )
    return user_repo.deactivate_user(db, user_id)
