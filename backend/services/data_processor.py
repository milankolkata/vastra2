"""
Cleans and normalises uploaded sales CSV/Excel files.
Handles flexible column naming and missing data gracefully.
"""
import re
from typing import Optional
import pandas as pd
import numpy as np


# Canonical column names → list of accepted aliases (case-insensitive)
COLUMN_ALIASES = {
    "date": ["date", "sale_date", "order_date", "transaction_date", "day", "sold_on"],
    "product": [
        "product", "product_name", "design", "design_number", "design_no",
        "item", "item_name", "sku", "product_id", "name",
    ],
    "category": [
        "category", "type", "product_type", "item_type", "segment",
        "product_category", "cat",
    ],
    "quantity": [
        "quantity", "qty", "units", "units_sold", "quantity_sold",
        "pieces", "nos", "count", "sold",
    ],
    "price": [
        "price", "unit_price", "selling_price", "mrp", "rate",
        "amount", "sale_price", "sp",
    ],
    "color": ["color", "colour", "shade", "hue", "color_name"],
    "fabric": ["fabric", "material", "cloth", "textile", "fabric_type"],
}


def _normalise_col(col: str) -> str:
    return re.sub(r"[^a-z0-9]", "_", col.strip().lower())


def _map_columns(df: pd.DataFrame) -> dict[str, str]:
    """Return {canonical: actual_df_col} for each matched alias."""
    norm = {_normalise_col(c): c for c in df.columns}
    mapping: dict[str, str] = {}
    for canonical, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            key = _normalise_col(alias)
            if key in norm:
                mapping[canonical] = norm[key]
                break
    return mapping


def load_file(content: bytes, filename: str) -> pd.DataFrame:
    """Parse CSV or Excel bytes into a DataFrame."""
    if filename.lower().endswith((".xlsx", ".xls")):
        return pd.read_excel(content, engine="openpyxl")
    return pd.read_csv(content, encoding="utf-8", on_bad_lines="skip")


def clean_and_normalise(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """
    Returns (cleaned_df, column_map) where column_map shows which canonical
    columns were detected.
    """
    col_map = _map_columns(df)

    # Rename to canonical names
    reverse = {v: k for k, v in col_map.items()}
    df = df.rename(columns=reverse)

    # Keep only canonical columns that exist
    keep = [c for c in COLUMN_ALIASES if c in df.columns]
    df = df[keep].copy()

    # --- Date ---
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], dayfirst=True, errors="coerce")
        df = df.dropna(subset=["date"])
        df = df.sort_values("date")
    else:
        # Synthetic index-based date so the rest of the pipeline still works
        df["date"] = pd.date_range(end=pd.Timestamp.today(), periods=len(df), freq="D")

    # --- Quantity ---
    if "quantity" in df.columns:
        df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0).clip(lower=0)
    else:
        df["quantity"] = 1  # assume 1 unit per row if missing

    # --- Price ---
    if "price" in df.columns:
        df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0).clip(lower=0)
        df["revenue"] = df["quantity"] * df["price"]
    else:
        df["revenue"] = df["quantity"]  # revenue = units when no price

    # --- Product ---
    if "product" not in df.columns:
        df["product"] = "Unknown"

    # --- String columns: strip & title-case ---
    for col in ["product", "category", "color", "fabric"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.title()
            df[col] = df[col].replace({"Nan": "Unknown", "None": "Unknown", "": "Unknown"})

    df = df.reset_index(drop=True)
    return df, col_map


def get_summary(df: pd.DataFrame) -> dict:
    date_range = {}
    if "date" in df.columns and len(df):
        date_range = {
            "start": df["date"].min().strftime("%d %b %Y"),
            "end": df["date"].max().strftime("%d %b %Y"),
            "days": int((df["date"].max() - df["date"].min()).days) + 1,
        }

    return {
        "total_rows": len(df),
        "total_units": int(df["quantity"].sum()),
        "total_revenue": round(float(df["revenue"].sum()), 2),
        "unique_products": int(df["product"].nunique()),
        "date_range": date_range,
        "available_columns": [c for c in ["date", "product", "category", "quantity", "price", "color", "fabric"] if c in df.columns],
    }


def top_products(df: pd.DataFrame, n: int = 10) -> list[dict]:
    grp = (
        df.groupby("product")
        .agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
        .reset_index()
        .sort_values("units", ascending=False)
        .head(n)
    )
    grp["revenue"] = grp["revenue"].round(2)
    return grp.to_dict(orient="records")


def category_breakdown(df: pd.DataFrame) -> list[dict]:
    if "category" not in df.columns:
        return []
    grp = (
        df.groupby("category")
        .agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
        .reset_index()
        .sort_values("units", ascending=False)
    )
    total = grp["units"].sum() or 1
    grp["share_pct"] = (grp["units"] / total * 100).round(1)
    grp["revenue"] = grp["revenue"].round(2)
    return grp.to_dict(orient="records")


def color_trends(df: pd.DataFrame) -> list[dict]:
    if "color" not in df.columns:
        return []
    grp = (
        df.groupby("color")
        .agg(units=("quantity", "sum"))
        .reset_index()
        .sort_values("units", ascending=False)
        .head(10)
    )
    return grp.to_dict(orient="records")


def fabric_trends(df: pd.DataFrame) -> list[dict]:
    if "fabric" not in df.columns:
        return []
    grp = (
        df.groupby("fabric")
        .agg(units=("quantity", "sum"))
        .reset_index()
        .sort_values("units", ascending=False)
        .head(10)
    )
    return grp.to_dict(orient="records")


def dead_stock(df: pd.DataFrame, days: int = 30) -> list[dict]:
    """Products with zero or very low sales in the last `days` days."""
    if "date" not in df.columns:
        return []
    cutoff = df["date"].max() - pd.Timedelta(days=days)
    recent = df[df["date"] >= cutoff]
    recent_sales = recent.groupby("product")["quantity"].sum()

    all_products = df["product"].unique()
    dead: list[dict] = []
    for prod in all_products:
        qty = int(recent_sales.get(prod, 0))
        if qty == 0:
            dead.append({"product": prod, "units_last_30d": 0, "status": "Dead Stock"})
        elif qty <= 2:
            dead.append({"product": prod, "units_last_30d": qty, "status": "Slow Moving"})

    dead.sort(key=lambda x: x["units_last_30d"])
    return dead[:20]


def daily_sales_trend(df: pd.DataFrame) -> list[dict]:
    if "date" not in df.columns:
        return []
    grp = (
        df.groupby(df["date"].dt.date)
        .agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
        .reset_index()
    )
    grp["date"] = grp["date"].astype(str)
    grp["revenue"] = grp["revenue"].round(2)
    return grp.to_dict(orient="records")


def weekly_sales_trend(df: pd.DataFrame) -> list[dict]:
    if "date" not in df.columns:
        return []
    df2 = df.copy()
    df2["week"] = df2["date"].dt.to_period("W").dt.start_time
    grp = (
        df2.groupby("week")
        .agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
        .reset_index()
    )
    grp["week"] = grp["week"].dt.strftime("%d %b %Y")
    grp["revenue"] = grp["revenue"].round(2)
    return grp.to_dict(orient="records")


def monthly_summary(df: pd.DataFrame) -> list[dict]:
    if "date" not in df.columns:
        return []
    df2 = df.copy()
    df2["month"] = df2["date"].dt.to_period("M").dt.start_time
    grp = (
        df2.groupby("month")
        .agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
        .reset_index()
    )
    grp["month"] = grp["month"].dt.strftime("%b %Y")
    grp["revenue"] = grp["revenue"].round(2)
    return grp.to_dict(orient="records")


def preview_rows(df_raw: pd.DataFrame, n: int = 10) -> dict:
    preview = df_raw.head(n).copy()
    # Convert all values to strings for JSON safety
    for col in preview.columns:
        preview[col] = preview[col].astype(str)
    return {
        "columns": list(preview.columns),
        "rows": preview.to_dict(orient="records"),
    }
