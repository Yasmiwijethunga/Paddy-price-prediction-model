from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from dependencies import get_db, require_admin
from schemas.user import UserOut, UserRoleUpdate
from services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    """List all registered users. Admin only."""
    return user_service.get_all_users(db)


@router.put("/{user_id}/role", response_model=UserOut)
def update_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    """Change a user's role (admin / user). Admin only."""
    return user_service.update_role(db, user_id, data.role)


@router.delete("/{user_id}", response_model=UserOut)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    """Deactivate (soft-delete) a user account. Admin only."""
    return user_service.deactivate_user(db, user_id)
