"""
Run once to create the initial admin account.
Usage (from the backend/ folder):
    python create_admin.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, create_tables
from models.user import User
from utils.security import hash_password

USERNAME = "admin"
EMAIL    = "admin@paddy.lk"
PASSWORD = "admin123"

create_tables()
db = SessionLocal()
try:
    if db.query(User).filter(User.username == USERNAME).first():
        print(f"[INFO] Admin '{USERNAME}' already exists — nothing to do.")
    else:
        admin = User(
            username=USERNAME,
            email=EMAIL,
            hashed_password=hash_password(PASSWORD),
            role="admin",
        )
        db.add(admin)
        db.commit()
        print(f"[OK] Admin created successfully.")
        print(f"     Username : {USERNAME}")
        print(f"     Password : {PASSWORD}")
        print(f"     Email    : {EMAIL}")
        print(f"\n  Change the password after first login!")
finally:
    db.close()
