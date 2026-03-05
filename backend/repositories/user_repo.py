from sqlalchemy.orm import Session

from models.user import User, UserRole


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_all_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.created_at.desc()).all()


def create_user(
    db: Session,
    username: str,
    email: str,
    hashed_password: str,
    role: UserRole = UserRole.user,
) -> User:
    user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_role(db: Session, user_id: int, role: UserRole) -> User | None:
    user = get_user_by_id(db, user_id)
    if user:
        user.role = role
        db.commit()
        db.refresh(user)
    return user


def deactivate_user(db: Session, user_id: int) -> User | None:
    user = get_user_by_id(db, user_id)
    if user:
        user.is_active = False
        db.commit()
        db.refresh(user)
    return user
