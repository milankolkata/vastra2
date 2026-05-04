"""
Smart Customer Targeting — scores customers against a design.

Scoring weights (text-based portion sums to 1.0 before CLIP redistribution)
────────────────────────────────────────────────────────────────────────────
  Embroidery type   25 %  (semantic — Zardozi partially matches "heavy embroidery")
  Print type        15 %  (semantic — Bandhani partially matches "tie dye")
  Occasion match    15 %  (inferred from design; compared to customer occasion prefs)
  Category          12 %
  Fabric            11 %  (family matching — Kanjivaram ≈ silk)
  Color             10 %  (+ auto-color fallback)
  Image similarity  12 %  (CLIP cosine; weight redistributed if unavailable)

  Price range gives a +5 pt bonus (capped at 100).
  Region affinity  gives a +3 pt bonus when design craft origin matches customer state.

Backward-compatible: old customers with only preferred_styles / preferred_categories
still score correctly via knowledge-base normalisation of legacy style strings.
"""
from __future__ import annotations
import numpy as np
import urllib.parse

from services.embedding_service import cosine_similarity
from services.indian_wear_knowledge import (
    embroidery_similarity,
    print_similarity,
    fabric_similarity,
    infer_occasions,
    occasion_match_score,
    region_affinity,
    normalize_embroidery,
    normalize_print,
    SAME_GROUP_SCORE,
)


# ─────────────────────────────────────────────────────────────────────────────
# Scoring weights
# ─────────────────────────────────────────────────────────────────────────────

W_EMBROIDERY  = 0.25
W_PRINT       = 0.15
W_OCCASION    = 0.15
W_CATEGORY    = 0.12
W_FABRIC      = 0.11
W_COLOR       = 0.10
W_IMAGE       = 0.12

BONUS_PRICE   = 5.0
BONUS_REGION  = 3.0


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _best_embroidery_score(design_work: str, customer_prefs: list[str]) -> float:
    """Best semantic embroidery similarity across all customer preferences."""
    if not design_work or not customer_prefs:
        return 0.0
    return max(embroidery_similarity(design_work, p) for p in customer_prefs)


def _best_print_score(design_print: str, customer_prefs: list[str]) -> float:
    """Best semantic print similarity across all customer preferences."""
    if not design_print or not customer_prefs:
        return 0.0
    return max(print_similarity(design_print, p) for p in customer_prefs)


def _best_fabric_score(design_fabric: str, customer_prefs: list[str]) -> float:
    """Best semantic fabric similarity across all customer preferences."""
    if not design_fabric or not customer_prefs:
        return 0.0
    return max(fabric_similarity(design_fabric, p) for p in customer_prefs)


def _category_score(design_cat: str, customer_cats: list[str]) -> float:
    if not design_cat or not customer_cats:
        return 0.0
    dc = design_cat.lower()
    return 1.0 if any(dc == c.lower() for c in customer_cats) else 0.0


def _color_score(design_color: str, design_auto_colors: list[dict], customer_colors: list[str]) -> float:
    """
    Match design color against customer color preferences.
    Falls back to auto-detected dominant colors if the manual color field is empty.
    """
    if not customer_colors:
        return 0.0

    pref = [c.lower() for c in customer_colors]

    # 1. Exact manual color
    if design_color:
        if design_color.lower() in pref:
            return 1.0

    # 2. Auto-detected dominant colors (partial credit proportional to color share)
    if design_auto_colors:
        for ac in design_auto_colors[:3]:
            name = (ac.get("name_approx") or "").lower()
            if name and name in pref:
                pct = ac.get("percentage", 0) / 100
                return min(1.0, 0.6 + 0.4 * pct)

    return 0.0


def _build_customer_embroidery_prefs(customer: dict) -> list[str]:
    """
    Merge new embroidery_preferences with legacy preferred_styles.
    Normalises both through the knowledge base so Zardozi ≡ zardozi ≡ zari.
    """
    prefs: list[str] = []
    for raw in (customer.get("embroidery_preferences") or []):
        prefs.append(raw)
    # Legacy: preferred_styles may contain embroidery names
    for raw in (customer.get("preferred_styles") or []):
        canon = normalize_embroidery(raw)
        if canon:
            prefs.append(canon)
        else:
            prefs.append(raw)  # keep unknown for fuzzy pass
    return prefs


def _build_customer_print_prefs(customer: dict) -> list[str]:
    prefs: list[str] = []
    for raw in (customer.get("print_preferences") or []):
        prefs.append(raw)
    # Legacy: preferred_styles may contain print names
    for raw in (customer.get("preferred_styles") or []):
        canon = normalize_print(raw)
        if canon:
            prefs.append(canon)
    return prefs


# ─────────────────────────────────────────────────────────────────────────────
# Core scoring function
# ─────────────────────────────────────────────────────────────────────────────

def score_customer(
    *,
    design: dict,
    customer: dict,
    customer_embeddings: list[list[float]],
) -> dict:
    """
    Return { score: 0-100, reasons: [...], whatsapp_url: str }
    for a single customer–design pair.
    """
    reasons: list[str] = []
    raw = 0.0
    weight_total = 0.0

    def _add(w: float, s: float, reason: str | None = None):
        nonlocal raw, weight_total
        raw += w * s
        weight_total += w
        if reason and s >= 0.5:
            reasons.append(reason)

    # ── Extract design attributes ─────────────────────────────
    d_embroidery = design.get("embroidery_type") or design.get("work_type") or ""
    d_print      = design.get("print_type") or ""
    d_category   = design.get("category") or ""
    d_fabric     = design.get("fabric") or ""
    d_color      = design.get("color") or ""
    d_auto_colors = design.get("auto_colors") or []
    d_occasions  = design.get("occasion_tags") or []

    # Infer occasions if not stored
    if not d_occasions:
        d_occasions = infer_occasions(
            embroidery_type=d_embroidery or None,
            print_type=d_print or None,
            fabric=d_fabric or None,
            category=d_category or None,
        )

    # ── Embroidery / Work type (25%) ──────────────────────────
    emb_prefs = _build_customer_embroidery_prefs(customer)
    if d_embroidery and emb_prefs:
        sim = _best_embroidery_score(d_embroidery, emb_prefs)
        if sim >= 0.9:
            _add(W_EMBROIDERY, sim, f"Embroidery '{d_embroidery}' is their preferred style")
        elif sim >= SAME_GROUP_SCORE - 0.01:
            _add(W_EMBROIDERY, sim, f"Embroidery '{d_embroidery}' is in a similar style family they like")
        else:
            _add(W_EMBROIDERY, sim)
    else:
        _add(W_EMBROIDERY, 0.4)  # neutral when data missing

    # ── Print type (15%) ─────────────────────────────────────
    prt_prefs = _build_customer_print_prefs(customer)
    if d_print and prt_prefs:
        sim = _best_print_score(d_print, prt_prefs)
        if sim >= 0.9:
            _add(W_PRINT, sim, f"Print '{d_print}' matches their taste")
        elif sim >= SAME_GROUP_SCORE - 0.01:
            _add(W_PRINT, sim, f"Print '{d_print}' is from a style family they prefer")
        else:
            _add(W_PRINT, sim)
    elif not d_print and not prt_prefs:
        # Neither has print preference — neutral, don't penalise
        _add(W_PRINT, 0.5)
    else:
        _add(W_PRINT, 0.3)

    # ── Occasion match (15%) ─────────────────────────────────
    occ_prefs = customer.get("occasion_preferences") or []
    if d_occasions and occ_prefs:
        sim = occasion_match_score(d_occasions, occ_prefs)
        if sim >= 0.4:
            top_occ = d_occasions[0] if d_occasions else ""
            _add(W_OCCASION, sim, f"Perfect for {top_occ} — matches their shopping occasions")
        else:
            _add(W_OCCASION, sim)
    else:
        _add(W_OCCASION, 0.5)  # neutral

    # ── Category (12%) ───────────────────────────────────────
    cat_prefs = [c for c in (customer.get("preferred_categories") or [])]
    if d_category and cat_prefs:
        sim = _category_score(d_category, cat_prefs)
        _add(W_CATEGORY, sim, f"Category '{d_category}' matches their preference" if sim else None)
    else:
        _add(W_CATEGORY, 0.4)

    # ── Fabric (11%) ─────────────────────────────────────────
    fab_prefs = customer.get("fabric_preferences") or []
    if d_fabric and fab_prefs:
        sim = _best_fabric_score(d_fabric, fab_prefs)
        if sim >= 0.9:
            _add(W_FABRIC, sim, f"Fabric '{d_fabric}' is their preference")
        elif sim >= SAME_GROUP_SCORE - 0.01:
            _add(W_FABRIC, sim, f"Fabric '{d_fabric}' is in their preferred fabric family")
        else:
            _add(W_FABRIC, sim)
    else:
        _add(W_FABRIC, 0.4)

    # ── Color (10%) ──────────────────────────────────────────
    color_prefs = [c for c in (customer.get("color_preference") or [])]
    if color_prefs:
        sim = _color_score(d_color, d_auto_colors, color_prefs)
        _add(W_COLOR, sim, f"Color '{d_color or 'detected'}' is in their preference" if sim >= 0.5 else None)
    else:
        _add(W_COLOR, 0.4)

    # ── Visual similarity via CLIP (12%) ─────────────────────
    d_embedding = design.get("embedding")
    if d_embedding and customer_embeddings:
        avg_emb = np.mean([np.array(e) for e in customer_embeddings if e], axis=0).tolist()
        sim = cosine_similarity(d_embedding, avg_emb)
        _add(W_IMAGE, sim, "High visual similarity to their reference images" if sim > 0.65 else None)
    # else: skip — weight_total normalisation handles missing embeddings

    # ── Normalise ─────────────────────────────────────────────
    score = (raw / weight_total * 100) if weight_total > 0 else 50.0

    # ── Price bonus (+5) ──────────────────────────────────────
    d_price = design.get("price")
    p_min = customer.get("price_min")
    p_max = customer.get("price_max")
    if d_price and p_min is not None and p_max is not None:
        if float(p_min) <= float(d_price) <= float(p_max):
            score = min(100.0, score + BONUS_PRICE)
            reasons.append(f"Price ₹{d_price} fits their budget ₹{int(p_min)}–₹{int(p_max)}")

    # ── Region affinity bonus (+3) ────────────────────────────
    raf = region_affinity(
        embroidery_type=d_embroidery or None,
        print_type=d_print or None,
        customer_state=customer.get("region_state"),
    )
    if raf > 0:
        score = min(100.0, score + BONUS_REGION)
        reasons.append("This craft originates from their home region")

    score = round(score, 1)

    if not reasons:
        reasons.append("General style alignment")

    # ─────────────────────────────────────────────────────────
    # WhatsApp message
    # ─────────────────────────────────────────────────────────
    phone = (customer.get("phone") or "").strip().replace(" ", "").replace("-", "")
    if phone.startswith("+"):
        phone = phone[1:]
    elif not phone.startswith("91") and len(phone) == 10:
        phone = "91" + phone

    design_name = design.get("name", "a new design")
    cust_name = customer.get("name", "Customer")
    craft_note = ""
    if d_embroidery and d_embroidery not in ("Plain / No Embroidery", ""):
        craft_note = f" featuring {d_embroidery}"
    elif d_print and d_print not in ("Plain / No Print", ""):
        craft_note = f" with {d_print}"
    top_occ = d_occasions[0] if d_occasions else ""
    occ_note = f" Perfect for {top_occ}." if top_occ else ""

    wa_text = (
        f"Hello {cust_name}! 👗 We just added *{design_name}*{craft_note} to our collection "
        f"and thought you'd love it — it's a great match for your style.{occ_note} "
        f"{'Price: ₹' + str(d_price) + '.' if d_price else ''} "
        f"Interested? Reply to see more details or book yours today! 🙏"
    )
    wa_url = f"https://wa.me/{phone}?text={urllib.parse.quote(wa_text)}" if phone else None

    return {
        "customer_id": customer.get("id"),
        "customer_name": customer.get("name"),
        "phone": customer.get("phone"),
        "region": f"{customer.get('region_city', '')} {customer.get('region_state', '')}".strip(),
        "score": score,
        "reasons": reasons[:4],
        "whatsapp_url": wa_url,
    }


def match_design_to_customers(
    design: dict,
    customers: list[dict],
    customer_embeddings_map: dict[str, list[list[float]]],
    top_n: int = 10,
) -> list[dict]:
    """Match a design against all customers. Returns top_n sorted by score."""
    results = [
        score_customer(
            design=design,
            customer=c,
            customer_embeddings=customer_embeddings_map.get(c["id"], []),
        )
        for c in customers
    ]
    results.sort(key=lambda x: -x["score"])
    return results[:top_n]
