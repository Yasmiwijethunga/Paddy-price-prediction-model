from typing import Any

# ---------------------------------------------------------------------------
# Column requirements per dataset type
# ---------------------------------------------------------------------------

REQUIRED_COLUMNS: dict[str, list[str]] = {
    "production": ["year", "cultivated_area", "total_production", "harvest_quantity"],
    "climate":    ["year", "rainfall", "temperature"],
    "cost":       ["year", "fertilizer_price", "seed_cost", "pesticide_cost"],
    "price":      ["year", "paddy_price"],
    "combined":   ["year"],   # combined files only require 'year'; other columns optional
}

# Columns that must be numeric when present
NUMERIC_COLUMNS: list[str] = [
    "cultivated_area",
    "total_production",
    "harvest_quantity",
    "rainfall",
    "temperature",
    "fertilizer_price",
    "seed_cost",
    "pesticide_cost",
    "population",
    "rice_consumption",
    "paddy_price",
]

VALID_YEAR_RANGE = (1900, 2100)


# ---------------------------------------------------------------------------
# Validators
# ---------------------------------------------------------------------------

def validate_columns(
    records: list[dict[str, Any]],
    dataset_type: str,
) -> tuple[bool, list[str]]:
    """
    Check that required columns exist in the uploaded file.

    Returns ``(is_valid, errors)`` where errors is a list of human-readable
    messages.
    """
    errors: list[str] = []

    if not records:
        return False, ["The uploaded file contains no data rows."]

    present_cols = set(records[0].keys())
    required = REQUIRED_COLUMNS.get(dataset_type, ["year"])
    missing = [col for col in required if col not in present_cols]

    if missing:
        errors.append(f"Missing required columns: {missing}")
        return False, errors

    return True, errors


def validate_record(
    record: dict[str, Any],
    row_number: int,
) -> tuple[bool, list[str]]:
    """
    Validate a single data row.

    Checks:
      - 'year' column is present and is a valid 4-digit integer
      - Numeric columns, when present, can be cast to float
    """
    errors: list[str] = []

    # Year validation
    year_raw = record.get("year")
    if year_raw is None:
        errors.append(f"Row {row_number}: 'year' column is missing or empty.")
    else:
        try:
            year = int(year_raw)
            if not (VALID_YEAR_RANGE[0] <= year <= VALID_YEAR_RANGE[1]):
                errors.append(
                    f"Row {row_number}: year {year} is outside the valid range "
                    f"({VALID_YEAR_RANGE[0]}–{VALID_YEAR_RANGE[1]})."
                )
        except (ValueError, TypeError):
            errors.append(
                f"Row {row_number}: 'year' must be a 4-digit integer, "
                f"got '{year_raw}'."
            )

    # Numeric column validation
    for col in NUMERIC_COLUMNS:
        value = record.get(col)
        if value is not None:
            try:
                float(value)
            except (ValueError, TypeError):
                errors.append(
                    f"Row {row_number}: '{col}' must be numeric, got '{value}'."
                )

    return len(errors) == 0, errors
