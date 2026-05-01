"""
Festival opportunities service.
Loads static festival data, calculates countdowns, generates smart alerts
and actionable recommendations based on current date + optional user sales data.
"""
from __future__ import annotations
import json
import os
from datetime import date, datetime, timedelta
from typing import Optional
import pandas as pd


FESTIVALS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "festivals.json")


def _load_festivals() -> list[dict]:
    with open(FESTIVALS_PATH, encoding="utf-8") as f:
        return json.load(f)


def _festival_date_this_year(festival: dict, year: int) -> date:
    """Approximate festival date using month + midpoint of day range."""
    month = festival["month"]
    day_range = festival.get("typical_day_range", [10, 20])
    day = (day_range[0] + day_range[1]) // 2
    try:
        return date(year, month, day)
    except ValueError:
        return date(year, month, 15)


def _next_occurrence(festival: dict, today: date) -> date:
    """Return the next upcoming date for this festival."""
    this_year = _festival_date_this_year(festival, today.year)
    if this_year >= today:
        return this_year
    return _festival_date_this_year(festival, today.year + 1)


def _urgency_level(days_remaining: int) -> dict:
    if days_remaining < 0:
        return {"label": "Past", "color": "gray", "bg": "bg-gray-100", "text": "text-gray-600", "border": "border-gray-200"}
    elif days_remaining <= 7:
        return {"label": "Urgent", "color": "red", "bg": "bg-red-50", "text": "text-red-700", "border": "border-red-300"}
    elif days_remaining <= 15:
        return {"label": "Soon", "color": "orange", "bg": "bg-orange-50", "text": "text-orange-700", "border": "border-orange-300"}
    elif days_remaining <= 30:
        return {"label": "Upcoming", "color": "yellow", "bg": "bg-yellow-50", "text": "text-yellow-700", "border": "border-yellow-300"}
    else:
        return {"label": "Planned", "color": "green", "bg": "bg-green-50", "text": "text-green-700", "border": "border-green-300"}


def _alert_message(festival: dict, days_remaining: int) -> Optional[str]:
    if days_remaining <= 7:
        return festival.get("prep_message_7d")
    elif days_remaining <= 15:
        return festival.get("prep_message_15d")
    elif days_remaining <= 30:
        return festival.get("prep_message_30d")
    return None


def _historical_insights(festival: dict, df: Optional[pd.DataFrame]) -> list[str]:
    """Generate insights from user's sales data during past festive periods."""
    if df is None or "date" not in df.columns:
        return []

    insights = []
    today = date.today()
    fest_date = _next_occurrence(festival, today)

    # Check previous year's same period ±15 days
    prev_fest = date(fest_date.year - 1, fest_date.month, fest_date.day)
    window_start = prev_fest - timedelta(days=15)
    window_end = prev_fest + timedelta(days=15)

    # Overall baseline
    overall_daily = df["quantity"].sum() / max((df["date"].max() - df["date"].min()).days, 1)

    festive_df = df[(df["date"].dt.date >= window_start) & (df["date"].dt.date <= window_end)]
    if len(festive_df) < 5:
        return []

    festive_daily = festive_df["quantity"].sum() / 30
    if overall_daily > 0:
        uplift = (festive_daily - overall_daily) / overall_daily * 100
        if uplift > 10:
            insights.append(
                f"Last year, your sales increased by ~{round(uplift, 0):.0f}% during {festival['name']} season."
            )

    # Best performing category during festive
    if "category" in festive_df.columns:
        cat = festive_df.groupby("category")["quantity"].sum().idxmax()
        insights.append(f"'{cat}' was your top-selling category during last {festival['name']}.")

    # Best color
    if "color" in festive_df.columns and len(festive_df["color"].dropna()):
        col = festive_df.groupby("color")["quantity"].sum().idxmax()
        insights.append(f"'{col}' was the most popular color during {festival['name']} last year.")

    return insights


def get_upcoming_festivals(
    n: int = 5,
    df: Optional[pd.DataFrame] = None,
    today_override: Optional[date] = None,
) -> list[dict]:
    today = today_override or date.today()
    festivals = _load_festivals()

    enriched = []
    for fest in festivals:
        next_date = _next_occurrence(fest, today)
        days_remaining = (next_date - today).days
        urgency = _urgency_level(days_remaining)
        alert = _alert_message(fest, days_remaining)
        hist_insights = _historical_insights(fest, df)

        enriched.append({
            "id": fest["id"],
            "name": fest["name"],
            "category": fest["category"],
            "date": next_date.strftime("%d %b %Y"),
            "date_iso": next_date.isoformat(),
            "days_remaining": days_remaining,
            "duration_days": fest.get("duration_days", 1),
            "primary_regions": fest["primary_regions"],
            "secondary_regions": fest.get("secondary_regions", []),
            "urgency": urgency,
            "alert": alert,
            "product_suggestions": fest.get("product_suggestions", []),
            "color_suggestions": fest.get("color_suggestions", []),
            "fabric_suggestions": fest.get("fabric_suggestions", []),
            "historical_insights": hist_insights,
            "notes": fest.get("notes", ""),
        })

    # Sort by proximity (upcoming first, then by days remaining)
    enriched = [f for f in enriched if f["days_remaining"] >= 0]
    enriched.sort(key=lambda x: x["days_remaining"])
    return enriched[:n]


def get_all_festivals_calendar(today_override: Optional[date] = None) -> list[dict]:
    today = today_override or date.today()
    festivals = _load_festivals()
    result = []
    for fest in festivals:
        next_date = _next_occurrence(fest, today)
        days_remaining = (next_date - today).days
        result.append({
            "id": fest["id"],
            "name": fest["name"],
            "category": fest["category"],
            "date": next_date.strftime("%d %b %Y"),
            "date_iso": next_date.isoformat(),
            "days_remaining": days_remaining,
            "primary_regions": fest["primary_regions"],
            "urgency": _urgency_level(days_remaining),
        })
    result.sort(key=lambda x: x["days_remaining"])
    return result
