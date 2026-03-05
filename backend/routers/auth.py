from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from dependencies import get_db, get_current_user
from schemas.user import UserCreate, UserLogin, Token, UserOut
from services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    return auth_service.register_user(db, data)


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and receive a JWT access token."""
    return auth_service.login_user(db, data.username, data.password)


@router.get("/me", response_model=UserOut)
def me(current_user=Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user
