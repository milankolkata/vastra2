"""
Design Library router.
POST   /api/designs            — upload a design (image + metadata)
GET    /api/designs            — list designs (with optional filters)
DELETE /api/designs/{id}       — delete a design
GET    /api/designs/{id}/matches — top matching customers
"""
import uuid
import io
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from services.supabase_client import get_supabase
from services.embedding_service import embed_image, extract_dominant_colors
from services.matching_service import match_design_to_customers
from config import settings

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


# ── Upload a design ───────────────────────────────────────────
@router.post("/designs")
async def create_design(
    file: UploadFile = File(...),
    name: str = Form(...),
    category: str = Form(""),
    color: str = Form(""),
    fabric: str = Form(""),
    work_type: str = Form(""),
    price: Optional[float] = Form(None),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES and not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        raise HTTPException(400, "Only JPEG, PNG, or WebP images are accepted.")

    image_bytes = await file.read()
    if len(image_bytes) > 5 * 1024 * 1024:
        raise HTTPException(413, "Image must be under 5 MB.")

    sb = get_supabase()

    # 1. Upload image to Supabase Storage
    ext = (file.filename or "image.jpg").rsplit(".", 1)[-1]
    storage_path = f"{uuid.uuid4()}.{ext}"
    try:
        sb.storage.from_(settings.supabase_designs_bucket).upload(
            storage_path,
            image_bytes,
            {"content-type": file.content_type or "image/jpeg"},
        )
        image_url = sb.storage.from_(settings.supabase_designs_bucket).get_public_url(storage_path)
    except Exception as exc:
        raise HTTPException(502, f"Storage upload failed: {exc}")

    # 2. Generate CLIP embedding + Design Intelligence
    embedding = embed_image(image_bytes)
    auto_colors = extract_dominant_colors(image_bytes, top_n=5)

    # Auto-fill color if not provided
    effective_color = color.strip() or (auto_colors[0]["name_approx"] if auto_colors else "")

    # 3. Insert into DB
    row = {
        "name": name.strip(),
        "category": category.strip() or None,
        "color": effective_color or None,
        "fabric": fabric.strip() or None,
        "work_type": work_type.strip() or None,
        "price": price,
        "image_url": image_url,
        "embedding": embedding,
        "auto_colors": auto_colors,
    }
    try:
        result = sb.table("designs").insert(row).execute()
        created = result.data[0]
    except Exception as exc:
        raise HTTPException(502, f"Database insert failed: {exc}")

    return {
        "status": "created",
        "design": _safe_design(created),
        "design_intelligence": {
            "dominant_colors": auto_colors,
            "embedding_available": embedding is not None,
            "auto_detected_color": auto_colors[0]["name_approx"] if auto_colors else None,
        },
    }


# ── List designs with optional filters ───────────────────────
@router.get("/designs")
def list_designs(
    category: str = Query(default=""),
    color: str = Query(default=""),
    fabric: str = Query(default=""),
):
    sb = get_supabase()
    try:
        q = sb.table("designs").select(
            "id, name, category, color, fabric, work_type, price, image_url, auto_colors, created_at"
        ).order("created_at", desc=True)
        if category:
            q = q.ilike("category", f"%{category}%")
        if color:
            q = q.ilike("color", f"%{color}%")
        if fabric:
            q = q.ilike("fabric", f"%{fabric}%")
        result = q.execute()
        return {"designs": result.data}
    except Exception as exc:
        raise HTTPException(502, f"Database query failed: {exc}")


# ── Delete a design ───────────────────────────────────────────
@router.delete("/designs/{design_id}")
def delete_design(design_id: str):
    sb = get_supabase()
    try:
        # Fetch to get image_url for storage deletion
        row = sb.table("designs").select("image_url").eq("id", design_id).single().execute()
        if not row.data:
            raise HTTPException(404, "Design not found.")
        # Delete from DB
        sb.table("designs").delete().eq("id", design_id).execute()
        return {"status": "deleted", "id": design_id}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(502, f"Delete failed: {exc}")


# ── Get matching customers for a design ───────────────────────
@router.get("/designs/{design_id}/matches")
def get_design_matches(design_id: str, top_n: int = Query(default=10, le=50)):
    sb = get_supabase()
    try:
        design_row = sb.table("designs").select("*").eq("id", design_id).single().execute()
        if not design_row.data:
            raise HTTPException(404, "Design not found.")
        design = design_row.data

        customers = sb.table("customers").select("*").execute().data or []
        if not customers:
            return {"matches": [], "total_customers": 0}

        # Load customer image embeddings
        prefs = sb.table("customer_image_prefs").select("customer_id, embedding").execute().data or []
        emb_map: dict[str, list] = {}
        for p in prefs:
            cid = p["customer_id"]
            if p.get("embedding"):
                emb_map.setdefault(cid, []).append(p["embedding"])

        matches = match_design_to_customers(design, customers, emb_map, top_n=top_n)
        return {"matches": matches, "total_customers": len(customers)}

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(502, f"Matching failed: {exc}")


# ── Helpers ───────────────────────────────────────────────────
def _safe_design(d: dict) -> dict:
    """Strip large embedding from response."""
    return {k: v for k, v in d.items() if k != "embedding"}
