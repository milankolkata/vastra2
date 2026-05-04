"""
Customer Targeting router.
POST   /api/customers                    — create customer
GET    /api/customers                    — list all customers
PUT    /api/customers/{id}               — update customer
DELETE /api/customers/{id}               — delete customer
POST   /api/customers/{id}/images        — upload reference image preference
GET    /api/customers/{id}/images        — list customer's reference images
DELETE /api/customers/images/{pref_id}   — delete a reference image pref
"""
import uuid
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.supabase_client import get_supabase
from services.embedding_service import embed_image
from config import settings

router = APIRouter()


# ── Pydantic schemas ──────────────────────────────────────────
class CustomerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    region_city: Optional[str] = None
    region_state: Optional[str] = None

    # Basic preferences (legacy — kept for backward compat)
    preferred_categories: Optional[List[str]] = []
    preferred_styles: Optional[List[str]] = []
    color_preference: Optional[List[str]] = []

    # Rich Indian wear preferences
    embroidery_preferences: Optional[List[str]] = []   # e.g. ["Zardozi", "Chikankari"]
    print_preferences: Optional[List[str]] = []        # e.g. ["Bandhani", "Block Print"]
    fabric_preferences: Optional[List[str]] = []       # e.g. ["Kanjivaram Silk", "Cotton"]
    occasion_preferences: Optional[List[str]] = []     # e.g. ["Bridal", "Festive"]

    price_min: Optional[float] = None
    price_max: Optional[float] = None
    notes: Optional[str] = None


class CustomerUpdate(CustomerCreate):
    name: Optional[str] = None  # type: ignore[override]


# ── Create customer ───────────────────────────────────────────
@router.post("/customers")
def create_customer(payload: CustomerCreate):
    sb = get_supabase()
    try:
        result = sb.table("customers").insert(payload.model_dump()).execute()
        return {"status": "created", "customer": result.data[0]}
    except Exception as exc:
        raise HTTPException(502, f"Database insert failed: {exc}")


# ── List customers (includes image pref count) ────────────────
@router.get("/customers")
def list_customers():
    sb = get_supabase()
    try:
        customers = sb.table("customers").select("*").order("created_at", desc=True).execute().data or []
        prefs_count_raw = sb.table("customer_image_prefs").select("customer_id").execute().data or []
        count_map: dict[str, int] = {}
        for p in prefs_count_raw:
            cid = p["customer_id"]
            count_map[cid] = count_map.get(cid, 0) + 1
        for c in customers:
            c["image_pref_count"] = count_map.get(c["id"], 0)
        return {"customers": customers}
    except Exception as exc:
        raise HTTPException(502, f"Database query failed: {exc}")


# ── Update customer ───────────────────────────────────────────
@router.put("/customers/{customer_id}")
def update_customer(customer_id: str, payload: CustomerUpdate):
    sb = get_supabase()
    try:
        updates = {k: v for k, v in payload.model_dump().items() if v is not None}
        result = sb.table("customers").update(updates).eq("id", customer_id).execute()
        if not result.data:
            raise HTTPException(404, "Customer not found.")
        return {"status": "updated", "customer": result.data[0]}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(502, f"Update failed: {exc}")


# ── Delete customer ───────────────────────────────────────────
@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: str):
    sb = get_supabase()
    try:
        sb.table("customers").delete().eq("id", customer_id).execute()
        return {"status": "deleted", "id": customer_id}
    except Exception as exc:
        raise HTTPException(502, f"Delete failed: {exc}")


# ── Upload reference image for a customer ────────────────────
@router.post("/customers/{customer_id}/images")
async def add_customer_image(customer_id: str, file: UploadFile = File(...)):
    sb = get_supabase()

    image_bytes = await file.read()
    if len(image_bytes) > 5 * 1024 * 1024:
        raise HTTPException(413, "Image must be under 5 MB.")

    ext = (file.filename or "image.jpg").rsplit(".", 1)[-1]
    storage_path = f"{customer_id}/{uuid.uuid4()}.{ext}"
    try:
        sb.storage.from_(settings.supabase_customer_images_bucket).upload(
            storage_path,
            image_bytes,
            {"content-type": file.content_type or "image/jpeg"},
        )
        image_url = sb.storage.from_(settings.supabase_customer_images_bucket).get_public_url(storage_path)
    except Exception as exc:
        raise HTTPException(502, f"Storage upload failed: {exc}")

    embedding = embed_image(image_bytes)

    try:
        result = sb.table("customer_image_prefs").insert({
            "customer_id": customer_id,
            "image_url": image_url,
            "embedding": embedding,
        }).execute()
        return {"status": "uploaded", "pref": result.data[0]}
    except Exception as exc:
        raise HTTPException(502, f"Database insert failed: {exc}")


# ── List customer reference images ────────────────────────────
@router.get("/customers/{customer_id}/images")
def list_customer_images(customer_id: str):
    sb = get_supabase()
    try:
        result = sb.table("customer_image_prefs").select(
            "id, image_url, created_at"
        ).eq("customer_id", customer_id).execute()
        return {"images": result.data}
    except Exception as exc:
        raise HTTPException(502, f"Query failed: {exc}")


# ── Delete a reference image preference ──────────────────────
@router.delete("/customers/images/{pref_id}")
def delete_customer_image(pref_id: str):
    sb = get_supabase()
    try:
        sb.table("customer_image_prefs").delete().eq("id", pref_id).execute()
        return {"status": "deleted", "id": pref_id}
    except Exception as exc:
        raise HTTPException(502, f"Delete failed: {exc}")
