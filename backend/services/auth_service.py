from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories import user_repo
from schemas.user import UserCreate
from utils.security import verify_password, create_access_token


def register_user(db: Session, data: UserCreate):
    """
    Validate uniqueness, hash the password, persist, and return the new User.
    Raises 400 if username or email is already taken.
    """
    if user_repo.get_user_by_username(db, data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already registered.",
        )
    if user_repo.get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered.",
        )

    from utils.security import hash_password
    hashed = hash_password(data.password)
    return user_repo.create_user(db, data.username, data.email, hashed, data.role)


def login_user(db: Session, username: str, password: str) -> dict:
    """
    Verify credentials and return a JWT token payload dict.
    Raises 401 on bad credentials or inactive account.
    """
    user = user_repo.get_user_by_username(db, username)

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}
