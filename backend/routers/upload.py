"""Upload endpoint — accepts CSV/Excel, returns preview + full analysis."""
import io
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.data_processor import (
    load_file, clean_and_normalise, get_summary, top_products,
    category_breakdown, color_trends, fabric_trends, dead_stock,
    daily_sales_trend, weekly_sales_trend, monthly_summary, preview_rows,
)
from services.forecaster import generate_forecast
from services.insights_generator import generate_insights

router = APIRouter()

ALLOWED_TYPES = {
    "text/csv", "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/octet-stream",
}
MAX_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(400, "No file provided.")

    name_lower = file.filename.lower()
    if not (name_lower.endswith(".csv") or name_lower.endswith(".xlsx") or name_lower.endswith(".xls")):
        raise HTTPException(400, "Only CSV and Excel files are accepted.")

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(413, "File exceeds 10 MB limit.")

    try:
        df_raw = load_file(io.BytesIO(content), file.filename)
    except Exception as exc:
        raise HTTPException(422, f"Could not parse file: {exc}")

    if len(df_raw) == 0:
        raise HTTPException(422, "The uploaded file appears to be empty.")

    preview = preview_rows(df_raw)

    try:
        df, col_map = clean_and_normalise(df_raw.copy())
    except Exception as exc:
        raise HTTPException(422, f"Data cleaning failed: {exc}")

    summary = get_summary(df)
    top = top_products(df)
    categories = category_breakdown(df)
    colors = color_trends(df)
    fabrics = fabric_trends(df)
    dead = dead_stock(df)
    daily = daily_sales_trend(df)
    weekly = weekly_sales_trend(df)
    monthly = monthly_summary(df)
    forecast = generate_forecast(df)
    insights = generate_insights(df, summary)

    return {
        "status": "success",
        "filename": file.filename,
        "preview": preview,
        "column_mapping": col_map,
        "summary": summary,
        "top_products": top,
        "category_breakdown": categories,
        "color_trends": colors,
        "fabric_trends": fabrics,
        "dead_stock": dead,
        "daily_trend": daily,
        "weekly_trend": weekly,
        "monthly_summary": monthly,
        "forecast": forecast,
        "insights": insights,
    }
