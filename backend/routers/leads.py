"""
Lead Discovery router.
GET /api/leads/search?city=Mumbai&business_type=saree+shop&max_results=20
"""
from fastapi import APIRouter, Query
from services.places_service import search_businesses

router = APIRouter()


@router.get("/leads/search")
def search_leads(
    city: str = Query(..., description="City to search in, e.g. Mumbai"),
    business_type: str = Query(
        default="ethnic wear boutique saree shop kurti",
        description="Type of business to search for",
    ),
    max_results: int = Query(default=20, ge=1, le=50),
):
    """
    Search for ethnic wear businesses in a city using Google Places API.
    Returns name, address, rating, phone, and Maps URL for each business.
    """
    businesses = search_businesses(
        city=city.strip(),
        business_type=business_type.strip(),
        max_results=max_results,
    )
    return {
        "city": city,
        "business_type": business_type,
        "total": len(businesses),
        "businesses": businesses,
    }
