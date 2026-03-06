from datetime import datetime, timedelta
import warnings

from jose import jwt, JWTError
import bcrypt as _bcrypt

from config import settings

# ---------------------------------------------------------------------------
# Compatibility shim: passlib 1.7.4 breaks with bcrypt >= 4.x because it
# tries to read bcrypt.__about__.__version__.  Patch it in before importing
# passlib so the CryptContext initialises without error.
# ---------------------------------------------------------------------------
if not hasattr(_bcrypt, "__about__"):
    class _About:
        __version__ = _bcrypt.__version__
    _bcrypt.__about__ = _About()

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    from passlib.context import CryptContext

# bcrypt hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------------------------------------------------------------------
# Password utilities
# ---------------------------------------------------------------------------

def hash_password(plain: str) -> str:
    """Return the bcrypt hash of a plaintext password."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if the plaintext password matches the stored hash."""
    return pwd_context.verify(plain, hashed)


# ---------------------------------------------------------------------------
# JWT utilities
# ---------------------------------------------------------------------------

def create_access_token(data: dict) -> str:
    """
    Encode `data` into a signed JWT.
    Adds an `exp` claim based on ACCESS_TOKEN_EXPIRE_MINUTES from settings.
    """
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT.
    Raises `jose.JWTError` if the token is invalid or expired.
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
