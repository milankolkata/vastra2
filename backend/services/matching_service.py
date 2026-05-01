"""
Smart Customer Targeting — scores customers against a design.

Scoring weights
───────────────
  Category match   20 %
  Color match      20 %
  Style / work     30 %
  Image similarity 30 %  (skipped if no CLIP embeddings available; weights redistributed)

Price range gives a +5% bonus (capped at 100%).
"""
from __future__ import annotations
import numpy as np
from services.embedding_service import cosine_similarity


# ── Types ──────────────────────────────────────────────────────

def score_customer(
    *,
    design: dict,
    customer: dict,
    customer_embeddings: list[list[float]],  # list of reference image embeddings
) -> dict:
    """
    Return { score: 0-100, reasons: [...], whatsapp_message: str }
    for a single customer–design pair.
    """
    reasons: list[str] = []
    raw = 0.0
    weight_total = 0.0

    def _add(w: float, s: float, reason: str | None = None):
        nonlocal raw, weight_total
        raw += w * s
        weight_total += w
        if reason and s > 0:
            reasons.append(reason)

    # ── Category ─────────────────────────────────────────
    pref_cats = [c.lower() for c in (customer.get("preferred_categories") or [])]
    d_cat = (design.get("category") or "").lower()
    if d_cat and pref_cats:
        match = 1.0 if d_cat in pref_cats else 0.0
        _add(0.20, match, f"Category '{design.get('category')}' matches your preference" if match else None)
    else:
        _add(0.20, 0.5)  # neutral when data is missing

    # ── Color ────────────────────────────────────────────
    pref_colors = [c.lower() for c in (customer.get("color_preference") or [])]
    d_color = (design.get("color") or "").lower()
    if d_color and pref_colors:
        match = 1.0 if d_color in pref_colors else 0.0
        _add(0.20, match, f"Color '{design.get('color')}' is in their preference" if match else None)
    else:
        _add(0.20, 0.5)

    # ── Style / Work type ────────────────────────────────
    pref_styles = [s.lower() for s in (customer.get("preferred_styles") or [])]
    d_work = (design.get("work_type") or "").lower()
    if d_work and pref_styles:
        match = 1.0 if d_work in pref_styles else 0.0
        _add(0.30, match, f"Style '{design.get('work_type')}' matches their taste" if match else None)
    else:
        _add(0.30, 0.5)

    # ── Image similarity ─────────────────────────────────
    d_embedding = design.get("embedding")
    if d_embedding and customer_embeddings:
        # Average customer reference embeddings
        avg_emb = np.mean([np.array(e) for e in customer_embeddings if e], axis=0).tolist()
        sim = cosine_similarity(d_embedding, avg_emb)
        _add(0.30, sim, "High visual similarity to their reference images" if sim > 0.65 else None)
    else:
        # No embeddings — skip this weight entirely (already handled by weight_total normalisation)
        pass

    # ── Normalise ─────────────────────────────────────────
    score = (raw / weight_total * 100) if weight_total > 0 else 50.0

    # ── Price bonus ───────────────────────────────────────
    d_price = design.get("price")
    p_min = customer.get("price_min")
    p_max = customer.get("price_max")
    if d_price and p_min is not None and p_max is not None:
        if p_min <= float(d_price) <= p_max:
            score = min(100.0, score + 5.0)
            reasons.append(f"Price ₹{d_price} is within their budget ₹{int(p_min)}–₹{int(p_max)}")

    score = round(score, 1)
    if not reasons:
        reasons.append("General preference alignment")

    # ── WhatsApp message ──────────────────────────────────
    phone = (customer.get("phone") or "").strip().replace(" ", "").replace("-", "")
    if phone.startswith("+"):
        phone = phone[1:]
    elif not phone.startswith("91") and len(phone) == 10:
        phone = "91" + phone

    design_name = design.get("name", "a new design")
    cust_name = customer.get("name", "Customer")
    wa_text = (
        f"Hello {cust_name}! 👗 We just added *{design_name}* to our collection "
        f"and thought you'd love it. It's a perfect match for your preferences. "
        f"{'Price: ₹' + str(d_price) + '.' if d_price else ''} "
        f"Interested? Reply to see more details or book yours today! 🙏"
    )
    import urllib.parse
    wa_url = f"https://wa.me/{phone}?text={urllib.parse.quote(wa_text)}" if phone else None

    return {
        "customer_id": customer.get("id"),
        "customer_name": customer.get("name"),
        "phone": customer.get("phone"),
        "region": f"{customer.get('region_city', '')} {customer.get('region_state', '')}".strip(),
        "score": score,
        "reasons": reasons[:3],
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
