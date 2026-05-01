"""
Google Places API integration for Lead Discovery.
Uses the Places Text Search endpoint (no scraping).
"""
from __future__ import annotations
import hashlib
import time
from typing import Optional
from fastapi import HTTPException
from config import settings

# ── Simple in-memory TTL cache (1 hour) ───────────────────────
_cache: dict[str, tuple[list[dict], float]] = {}
_CACHE_TTL = 3600


def _cache_key(city: str, business_type: str) -> str:
    return hashlib.md5(f"{city.lower()}|{business_type.lower()}".encode()).hexdigest()


def search_businesses(
    city: str,
    business_type: str = "ethnic wear boutique saree shop",
    max_results: int = 20,
) -> list[dict]:
    """
    Search Google Places for ethnic wear businesses in the given city.
    Returns a list of business dicts with: name, address, rating, phone, maps_url.
    """
    if not settings.google_places_configured:
        raise HTTPException(
            status_code=503,
            detail=(
                "Google Places API key is not configured. "
                "Add GOOGLE_PLACES_API_KEY to backend/.env to enable Lead Discovery."
            ),
        )

    key = _cache_key(city, business_type)
    cached = _cache.get(key)
    if cached and (time.time() - cached[1]) < _CACHE_TTL:
        return cached[0]

    try:
        import googlemaps  # type: ignore
    except ImportError:
        raise HTTPException(500, "googlemaps package is not installed. Run: pip install googlemaps")

    gmaps = googlemaps.Client(key=settings.google_places_api_key)
    query = f"{business_type} in {city} India"

    try:
        response = gmaps.places(query=query)
    except Exception as exc:
        raise HTTPException(502, f"Google Places API error: {exc}")

    businesses: list[dict] = []
    results = response.get("results", [])

    for place in results[:max_results]:
        place_id = place.get("place_id", "")
        name = place.get("name", "")
        address = place.get("formatted_address", "")
        rating = place.get("rating")
        total_ratings = place.get("user_ratings_total", 0)

        # Fetch phone number from Place Details (extra API call)
        phone: Optional[str] = None
        website: Optional[str] = None
        try:
            detail = gmaps.place(
                place_id=place_id,
                fields=["formatted_phone_number", "website"],
            )
            phone = detail.get("result", {}).get("formatted_phone_number")
            website = detail.get("result", {}).get("website")
        except Exception:
            pass

        maps_url = f"https://www.google.com/maps/place/?q=place_id:{place_id}"

        businesses.append({
            "id": place_id,
            "name": name,
            "address": address,
            "rating": rating,
            "total_ratings": total_ratings,
            "phone": phone,
            "website": website,
            "maps_url": maps_url,
        })

    _cache[key] = (businesses, time.time())
    return businesses
