import os


class Settings:
    APP_NAME: str = "Paddy Price Prediction System"
    DESCRIPTION: str = (
        "A data-driven web system for predicting paddy prices in "
        "Anuradhapura District, Sri Lanka — Maha Season, Nadu Variety."
    )
    VERSION: str = "1.0.0"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "paddy-secret-key-change-in-production-2024")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Databasec
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./paddy_price.db")

    # File upload
    UPLOAD_DIR: str = "uploads"
    ALLOWED_EXTENSIONS: tuple = (".csv", ".xlsx", ".xls")

    # Research scope constants — these are injected at parse time, never read from files
    DISTRICT: str = "Anuradhapura"
    SEASON: str = "Maha"
    VARIETY: str = "Nadu"

    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    FRONTEND_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


settings = Settings()
