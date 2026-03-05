import os
from typing import Any

import pandas as pd


def parse_file(file_path: str) -> list[dict[str, Any]]:
    """
    Read a CSV or Excel file with Pandas and return a list of row dicts.

    Column names are normalised:
      - stripped of leading/trailing whitespace
      - lowercased
      - spaces replaced with underscores

    NaN values are replaced with None so downstream code can do simple
    ``if value is not None`` checks.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".csv":
        df = pd.read_csv(file_path)
    elif ext in (".xlsx", ".xls"):
        df = pd.read_excel(file_path)
    else:
        raise ValueError(
            f"Unsupported file type '{ext}'. Allowed: .csv, .xlsx, .xls"
        )

    # Normalise column names
    df.columns = [
        col.strip().lower().replace(" ", "_") for col in df.columns
    ]

    # Replace NaN with None (JSON-serialisable)
    df = df.where(pd.notnull(df), None)

    return df.to_dict(orient="records")
