"""Shared Supabase client with clear error messaging when not configured."""
from __future__ import annotations
from functools import lru_cache
from fastapi import HTTPException
from config import settings


@lru_cache(maxsize=1)
def get_supabase():
    """Return a cached Supabase client; raise 503 if not configured."""
    if not settings.supabase_configured:
        raise HTTPException(
            status_code=503,
            detail=(
                "Supabase is not configured. "
                "Add SUPABASE_URL and SUPABASE_KEY to backend/.env to enable "
                "Design Library, Customer Targeting, and Lead Discovery."
            ),
        )
    from supabase import create_client
    return create_client(settings.supabase_url, settings.supabase_key)


def ensure_buckets() -> None:
    """Create storage buckets if they don't exist (call on startup, best-effort)."""
    if not settings.supabase_configured:
        return
    try:
        sb = get_supabase()
        existing = [b.name for b in sb.storage.list_buckets()]
        for bucket in [settings.supabase_designs_bucket, settings.supabase_customer_images_bucket]:
            if bucket not in existing:
                sb.storage.create_bucket(bucket, options={"public": True})
    except Exception:
        pass  # Buckets may already exist or permissions may differ
