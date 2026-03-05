from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from models.user import UserRole


class UserCreate(BaseModel):
    """Request body for registering a new user."""
    username: str
    email: EmailStr
    password: str
    role: Optional[UserRole] = UserRole.user


class UserLogin(BaseModel):
    """Request body for login."""
    username: str
    password: str


class UserOut(BaseModel):
    """Response body — never exposes hashed_password."""
    id: int
    username: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserRoleUpdate(BaseModel):
    """Request body for admin role-change endpoint."""
    role: UserRole


class Token(BaseModel):
    """JWT token response returned on successful login."""
    access_token: str
    token_type: str = "bearer"
    user: UserOut
