"""Festival opportunities endpoints."""
from fastapi import APIRouter, Query
from services.festival_service import get_upcoming_festivals, get_all_festivals_calendar

router = APIRouter()


@router.get("/festivals/upcoming")
def upcoming_festivals(n: int = Query(default=5, ge=1, le=10)):
    """Return next N upcoming Indian festivals with countdowns and recommendations."""
    return {"festivals": get_upcoming_festivals(n=n)}


@router.get("/festivals/calendar")
def festivals_calendar():
    """Return full year festival calendar sorted by proximity."""
    return {"calendar": get_all_festivals_calendar()}
