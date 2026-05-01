"""
Trends router — production-grade market intelligence API.

GET  /api/trends                    list trends (filterable, paginated)
GET  /api/trends/{id}               single trend detail
GET  /api/trends/{id}/match         match trend with user catalog
"""
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from services.trends_service import get_trends, get_trend_by_id, get_catalog_matches
from services.supabase_client import get_supabase

router = APIRouter()


@router.get("/trends")
def list_trends(
    product_type: str  = Query(default=""),
    work_type:    str  = Query(default=""),
    fabric_type:  str  = Query(default=""),
    region:       str  = Query(default=""),
    time_filter:  str  = Query(default="all"),
    is_fabric:    bool = Query(default=False),
    limit:        int  = Query(default=50, le=100),
    offset:       int  = Query(default=0, ge=0),
):
    """Return paginated, filtered trending designs."""
    trends, total = get_trends(
        product_type=product_type or None,
        work_type=work_type   or None,
        fabric_type=fabric_type or None,
        region=region         or None,
        time_filter=time_filter,
        is_fabric=is_fabric,
        limit=limit,
        offset=offset,
    )
    return {
        "trends": trends,
        "total": total,
        "limit": limit,
        "offset": offset,
        "has_more": offset + limit < total,
    }


@router.get("/trends/{trend_id}")
def get_trend(trend_id: str):
    """Return a single trend by ID."""
    trend = get_trend_by_id(trend_id)
    if not trend:
        raise HTTPException(404, "Trend not found.")
    return {"trend": trend}


@router.get("/trends/{trend_id}/match")
def match_trend_with_catalog(trend_id: str):
    """Find user catalog designs that match this trend."""
    trend = get_trend_by_id(trend_id, with_image=False)
    if not trend:
        raise HTTPException(404, "Trend not found.")

    try:
        sb = get_supabase()
        designs = sb.table("designs").select(
            "id, name, category, color, fabric, work_type, price, image_url"
        ).execute().data or []
    except Exception:
        designs = []

    matches = get_catalog_matches(trend, designs)
    return {
        "trend_id": trend_id,
        "trend_title": trend["title"],
        "matches": matches,
        "total_designs": len(designs),
    }
