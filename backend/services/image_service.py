"""
Image Service — fetches and caches product images via Unsplash API.

Without an Unsplash key the service automatically falls back to
picsum.photos (a free CDN of real stock photos, deterministic per query).
This means cards always show a real photograph, not a colour gradient.

To get ethnic-wear-specific photos:
  Add UNSPLASH_ACCESS_KEY to backend/.env (free at unsplash.com/developers).
"""
from __future__ import annotations
import hashlib
import threading
try:
    import requests as _requests
    _REQUESTS_OK = True
except ImportError:
    _REQUESTS_OK = False

from config import settings

_CACHE: dict[str, str] = {}
_LOCK = threading.Lock()

UNSPLASH_API = "https://api.unsplash.com/search/photos"


def _picsum_fallback(query: str) -> str:
    """
    Deterministic picsum.photos URL derived from the query string.
    Same query always returns the same image — no API key needed.
    """
    seed = hashlib.md5(query.encode()).hexdigest()[:10]
    return f"https://picsum.photos/seed/{seed}/400/600"


def fetch_image_url(query: str) -> str:
    """
    Return a portrait image URL for the given query.
    Priority:
      1. In-memory cache
      2. Unsplash API (if UNSPLASH_ACCESS_KEY is configured) → ethnic-wear photos
      3. picsum.photos fallback (always works, general stock photography)
    """
    with _LOCK:
        if query in _CACHE:
            return _CACHE[query]

    if not settings.unsplash_configured or not _REQUESTS_OK:
        url = _picsum_fallback(query)
        with _LOCK:
            _CACHE[query] = url
        return url

    with _LOCK:
        if query in _CACHE:
            return _CACHE[query]

    try:
        resp = _requests.get(
            UNSPLASH_API,
            params={
                "query": query,
                "per_page": 1,
                "orientation": "portrait",
                "content_filter": "high",
            },
            headers={"Authorization": f"Client-ID {settings.unsplash_access_key}"},
            timeout=5,
        )
        resp.raise_for_status()
        results = resp.json().get("results", [])
        if results:
            url = results[0]["urls"]["regular"]
            with _LOCK:
                _CACHE[query] = url
            return url
    except Exception:
        pass

    # Unsplash call failed — use picsum fallback
    url = _picsum_fallback(query)
    with _LOCK:
        _CACHE[query] = url
    return url


def batch_fetch(queries: list[str]) -> dict[str, str]:
    """Fetch multiple images; returns {query: url} mapping."""
    return {q: fetch_image_url(q) for q in queries}
