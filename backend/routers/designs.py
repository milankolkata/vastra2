"""
Design Library router.
POST   /api/designs            — upload a design (image + metadata)
GET    /api/designs            — list designs (with optional filters)
DELETE /api/designs/{id}       — delete a design
GET    /api/designs/{id}/matches — top matching customers
GET    /api/designs/taxonomy   — return all embroidery/print/fabric/occasion lists
"""
import uuid
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from services.supabase_client import get_supabase
from services.embedding_service import embed_image, extract_dominant_colors
from services.matching_service import match_design_to_customers
from services.auto_tagging_service import auto_tag_design
from services.indian_wear_knowledge import (
    infer_occasions,
    all_embroidery_types,
    all_print_types,
    all_fabric_types,
    all_occasions,
)
from config import settings

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


# ── Taxonomy endpoint (used by frontend dropdowns) ────────────
@router.get("/designs/taxonomy")
def get_taxonomy():
    return {
        "embroidery_types": all_embroidery_types(),
        "print_types": all_print_types(),
        "fabric_types": all_fabric_types(),
        "occasions": all_occasions(),
    }


# ── Upload a design ───────────────────────────────────────────
@router.post("/designs")
async def create_design(
    file: UploadFile = File(...),
    name: str = Form(...),
    category: str = Form(""),
    color: str = Form(""),
    fabric: str = Form(""),
    work_type: str = Form(""),
    embroidery_type: str = Form(""),
    print_type: str = Form(""),
    occasion_tags: str = Form(""),   # JSON-encoded list e.g. '["Bridal","Festive"]'
    price: Optional[float] = Form(None),
):
    if (
        file.content_type not in ALLOWED_IMAGE_TYPES
        and not (file.filename or "").lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
    ):
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

    # 2. Generate CLIP embedding + Design Intelligence colors
    embedding = embed_image(image_bytes)
    auto_colors = extract_dominant_colors(image_bytes, top_n=5)

    # Auto-fill color if not provided
    effective_color = color.strip() or (auto_colors[0]["name_approx"] if auto_colors else "")

    # 3. AI auto-tagging (fills embroidery/print/occasion when user left them blank)
    ai_tags = auto_tag_design(image_bytes)
    effective_embroidery = embroidery_type.strip() or ai_tags.get("embroidery_type") or ""
    effective_print      = print_type.strip()      or ai_tags.get("print_type")      or ""
    effective_fabric     = fabric.strip()           or ai_tags.get("fabric_hint")     or ""
    effective_work_type  = work_type.strip() or effective_embroidery or effective_print or ""

    # 4. Parse occasion_tags
    import json as _json
    try:
        parsed_occasions: list = _json.loads(occasion_tags) if occasion_tags.strip() else []
    except Exception:
        parsed_occasions = [t.strip() for t in occasion_tags.split(",") if t.strip()]

    # Merge AI-suggested occasions with user-provided
    ai_occasions = ai_tags.get("occasion_tags") or []
    if not parsed_occasions and ai_occasions:
        parsed_occasions = ai_occasions

    # 5. Infer occasions from attributes if still empty
    if not parsed_occasions:
        parsed_occasions = infer_occasions(
            embroidery_type=effective_embroidery or None,
            print_type=effective_print or None,
            fabric=effective_fabric or None,
            category=category.strip() or None,
        )

    # 6. Insert into DB
    row = {
        "name": name.strip(),
        "category": category.strip() or None,
        "color": effective_color or None,
        "fabric": effective_fabric or None,
        "work_type": effective_work_type or None,
        "embroidery_type": effective_embroidery or None,
        "print_type": effective_print or None,
        "occasion_tags": parsed_occasions or None,
        "price": price,
        "image_url": image_url,
        "embedding": embedding,
        "auto_colors": auto_colors,
        "auto_tags": ai_tags if ai_tags.get("confidence") else None,
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
            "ai_tags": ai_tags,
            "inferred_occasions": parsed_occasions,
        },
    }


# ── List designs with optional filters ───────────────────────
@router.get("/designs")
def list_designs(
    category: str = Query(default=""),
    color: str = Query(default=""),
    fabric: str = Query(default=""),
    embroidery_type: str = Query(default=""),
    print_type: str = Query(default=""),
):
    sb = get_supabase()
    try:
        q = sb.table("designs").select(
            "id, name, category, color, fabric, work_type, embroidery_type, "
            "print_type, occasion_tags, price, image_url, auto_colors, auto_tags, created_at"
        ).order("created_at", desc=True)
        if category:
            q = q.ilike("category", f"%{category}%")
        if color:
            q = q.ilike("color", f"%{color}%")
        if fabric:
            q = q.ilike("fabric", f"%{fabric}%")
        if embroidery_type:
            q = q.ilike("embroidery_type", f"%{embroidery_type}%")
        if print_type:
            q = q.ilike("print_type", f"%{print_type}%")
        result = q.execute()
        return {"designs": result.data}
    except Exception as exc:
        raise HTTPException(502, f"Database query failed: {exc}")


# ── Delete a design ───────────────────────────────────────────
@router.delete("/designs/{design_id}")
def delete_design(design_id: str):
    sb = get_supabase()
    try:
        row = sb.table("designs").select("image_url").eq("id", design_id).single().execute()
        if not row.data:
            raise HTTPException(404, "Design not found.")
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
    return {k: v for k, v in d.items() if k != "embedding"}
