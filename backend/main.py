"""
main.py  ─  FastAPI application factory

Run the server:
    cd backend
    uvicorn main:app --reload --port 8000

Interactive API docs:
    http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import create_tables
from routers import auth, users, datasets, records, analysis, predictions

# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
)

# ---------------------------------------------------------------------------
# CORS middleware
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers  — all prefixed with /api/v1
# ---------------------------------------------------------------------------

API_PREFIX = "/api/v1"

app.include_router(auth.router,        prefix=API_PREFIX)
app.include_router(users.router,       prefix=API_PREFIX)
app.include_router(datasets.router,    prefix=API_PREFIX)
app.include_router(records.router,     prefix=API_PREFIX)
app.include_router(analysis.router,    prefix=API_PREFIX)
app.include_router(predictions.router, prefix=API_PREFIX)

# ---------------------------------------------------------------------------
# Startup event — create all DB tables if they do not exist
# ---------------------------------------------------------------------------

@app.on_event("startup")
def on_startup() -> None:
    create_tables()


# ---------------------------------------------------------------------------
# Root health-check endpoint
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
def root():
    return {
        "system":   settings.APP_NAME,
        "version":  settings.VERSION,
        "district": settings.DISTRICT,
        "season":   settings.SEASON,
        "variety":  settings.VARIETY,
        "status":   "running",
        "docs":     "/docs",
    }
