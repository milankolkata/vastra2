"""
Auto-tagging service — uses the CLIP model (already loaded for embeddings)
to detect embroidery type, print type, and occasion suitability from a
design image via zero-shot text-image similarity.

100% free — no external API, no paid service.
Gracefully returns empty tags if sentence-transformers / CLIP is unavailable.
"""
from __future__ import annotations
import io
import logging
from typing import Optional
import numpy as np
from PIL import Image

log = logging.getLogger(__name__)

# ── Reuse the CLIP model already loaded in embedding_service ──
_clip_model = None
_clip_available = False

try:
    from sentence_transformers import SentenceTransformer  # type: ignore
    _clip_model = SentenceTransformer("clip-ViT-B-32")
    _clip_available = True
except Exception as exc:
    log.warning("CLIP unavailable for auto-tagging (%s). Install sentence-transformers to enable.", exc)


# ─────────────────────────────────────────────────────────────────────────────
# CLIP text prompts for zero-shot classification
# Each prompt describes what that embroidery / print LOOKS LIKE visually.
# More descriptive = better CLIP accuracy.
# ─────────────────────────────────────────────────────────────────────────────

EMBROIDERY_PROMPTS: dict[str, str] = {
    "Zardozi": (
        "intricate gold silver metallic thread embroidery on rich fabric, "
        "bridal Indian lehenga or saree with zari work"
    ),
    "Chikankari": (
        "delicate white shadow work thread embroidery on light fabric, "
        "Lucknowi kurta saree with fine white stitching"
    ),
    "Kantha": (
        "colorful running stitch folk art embroidery on cotton saree, "
        "Bengal hand stitched textile with geometric or floral motifs"
    ),
    "Phulkari": (
        "bright orange yellow colorful geometric flower embroidery on dupatta, "
        "Punjab phulkari dense thread work covering the fabric"
    ),
    "Kashmiri Embroidery": (
        "fine colorful wool thread embroidery on Kashmir shawl or fabric, "
        "paisley and floral motifs in multicolor sozni stitch"
    ),
    "Aari / Maggam": (
        "dense chain stitch embroidery on South Indian bridal blouse or lehenga, "
        "aari work with stones beads and thread close together"
    ),
    "Mirror Work": (
        "small round shiny mirrors stitched into colorful embroidered fabric, "
        "Gujarat Rajasthani tribal mirror shisha work textile"
    ),
    "Gota Patti": (
        "gold silver metallic ribbon flat applique on fabric, "
        "Rajasthani gota work with shiny strip edging on ethnic wear"
    ),
    "Mukaish / Kamdani": (
        "tiny shimmering metallic dots or specks scattered across sheer fabric, "
        "Lucknowi mukaish badla work on chiffon or georgette"
    ),
    "Dabka": (
        "raised coiled metallic wire embroidery creating textured patterns, "
        "three-dimensional dabka thread on bridal Pakistani or Indian garment"
    ),
    "Beadwork": (
        "decorative beads pearls and moti sequins embroidered on ethnic Indian fabric, "
        "heavily beaded blouse lehenga or saree border"
    ),
    "Sequin Work": (
        "shiny round metallic sequins paillettes covering Indian garment, "
        "glittery sparkling sequence work on lehenga or blouse"
    ),
    "Resham / Silk Thread": (
        "colorful silk thread floral or geometric embroidery on saree or kurta, "
        "smooth lustrous resham thread work ethnic Indian fabric"
    ),
    "Sujni": (
        "folk running stitch embroidery on Bihar textile, "
        "colorful hand stitched cotton fabric with narrative motifs"
    ),
    "Banjara": (
        "tribal colorful patchwork and thread embroidery with coins and shells, "
        "Lambani Banjara embroidered textile from Telangana"
    ),
    "Kutch Embroidery": (
        "colorful thread embroidery with mirror work on white or vibrant Gujarat fabric, "
        "Kutchi rabari embroidery with geometric patterns"
    ),
    "Tukdi Patchwork": (
        "patchwork of colorful fabric pieces stitched together with embroidery, "
        "Gujarat rabari tukdi patchwork ethnic textile"
    ),
    "Plain / No Embroidery": (
        "plain fabric with no embroidery, solid color or woven pattern only, "
        "no thread work no sequins no mirror work"
    ),
}

PRINT_PROMPTS: dict[str, str] = {
    "Block Print": (
        "hand printed geometric or floral pattern using wooden block stamp, "
        "Rajasthani Jaipur block print fabric with repeating motif"
    ),
    "Bandhani": (
        "tie-dye small circular dots pattern on colorful fabric, "
        "Gujarat Rajasthani bandhani chunri with yellow red or green dots"
    ),
    "Batik": (
        "wax resist dyed fabric with irregular organic crackle pattern, "
        "batik printed textile with flowing abstract design"
    ),
    "Kalamkari": (
        "hand drawn or pen painted mythological figures floral motifs on cotton, "
        "Andhra kalamkari natural dye printed narrative fabric"
    ),
    "Ajrakh": (
        "geometric resist block print with earthy blue red indigo tones, "
        "Kutch ajrakh hand printed cotton with symmetric medallion pattern"
    ),
    "Dabu": (
        "mud resist block print on fabric with earthy muted tones, "
        "Rajasthani dabu print natural color cotton textile"
    ),
    "Leheriya": (
        "diagonal wave stripe tie-dye pattern on Rajasthani fabric, "
        "multicolor leheriya saree with angled stripe lines"
    ),
    "Shibori": (
        "indigo blue pleated fold dyed fabric with irregular white pattern, "
        "shibori Japanese style dye on Indian textile"
    ),
    "Ikat": (
        "blurred edged woven geometric pattern on ethnic Indian fabric, "
        "pochampally or orissa ikat with feathery chevron diamond shapes"
    ),
    "Jamdani": (
        "fine muslin woven fabric with delicate floral geometric motifs, "
        "jamdani saree with translucent extra-weft pattern"
    ),
    "Digital Print": (
        "modern precisely printed pattern on fabric using digital technology, "
        "photo-realistic or graphic design printed Indian saree or dress"
    ),
    "Screen Print": (
        "flat color printed pattern on fabric using screen stencil, "
        "screen printed ethnic motif on cotton textile"
    ),
    "Warli": (
        "tribal stick figure white painting on dark brown or ochre fabric, "
        "Maharashtra Warli art printed on textile"
    ),
    "Madhubani": (
        "colorful detailed folk painting with fish bird peacock human figures on fabric, "
        "Bihar Mithila madhubani printed or painted textile"
    ),
    "Floral Print": (
        "flower rose bouquet botanical printed pattern on fabric, "
        "floral printed saree or kurta Indian ethnic wear"
    ),
    "Geometric Print": (
        "geometric shapes chevron grid triangles printed on fabric, "
        "modern geometric pattern Indian textile"
    ),
    "Paisley": (
        "curved teardrop mango boteh paisley print on fabric, "
        "paisley printed Indian ethnic saree or dupatta"
    ),
    "Patola": (
        "double ikat woven rich geometric pattern on silk saree, "
        "Patan patola silk with elephant parrot geometric repeat"
    ),
    "Pochampally": (
        "ikat woven geometric diamond chevron pattern on Telangana fabric, "
        "pochampally cotton or silk saree with angular woven design"
    ),
    "Zari / Brocade Woven": (
        "gold silver metallic thread woven into fabric as brocade pattern, "
        "Banarasi kinkhab zari woven saree with floral buttas"
    ),
    "Plain / No Print": (
        "solid color plain fabric with no print pattern, "
        "unpatterned uniform color saree or dress fabric"
    ),
}

# Minimum CLIP similarity to trust a prediction (below this → None returned)
MIN_CONFIDENCE = 0.18


# ─────────────────────────────────────────────────────────────────────────────
# Core classifier
# ─────────────────────────────────────────────────────────────────────────────

def _classify(
    image: "Image.Image",
    prompts: dict[str, str],
    top_k: int = 1,
) -> list[tuple[str, float]]:
    """
    Zero-shot image classification via CLIP text-image similarity.
    Returns list of (label, score) sorted descending, length top_k.
    """
    if not _clip_available or _clip_model is None:
        return []

    labels = list(prompts.keys())
    texts  = list(prompts.values())

    img_emb  = _clip_model.encode(image, convert_to_numpy=True)
    text_embs = _clip_model.encode(texts, convert_to_numpy=True)

    # Normalise
    img_emb   = img_emb / (np.linalg.norm(img_emb) + 1e-9)
    text_embs = text_embs / (np.linalg.norm(text_embs, axis=1, keepdims=True) + 1e-9)

    sims = text_embs @ img_emb  # shape (N,)

    # Softmax-scale for interpretability
    exps = np.exp(sims * 10)     # temperature 0.1
    probs = exps / exps.sum()

    ranked = sorted(zip(labels, probs.tolist()), key=lambda x: -x[1])
    return ranked[:top_k]


def _to_confidence(score: float) -> str:
    if score >= 0.35:
        return "high"
    if score >= 0.22:
        return "medium"
    return "low"


# ─────────────────────────────────────────────────────────────────────────────
# Public API — same signature as before so the router needs no changes
# ─────────────────────────────────────────────────────────────────────────────

def auto_tag_design(image_bytes: bytes) -> dict:
    """
    Analyze a design image and return auto-detected tags using CLIP.

    Returns dict with keys:
      embroidery_type, print_type, fabric_hint, occasion_tags,
      work_description, confidence
    All values may be None / empty list if CLIP is unavailable.
    """
    empty = {
        "embroidery_type": None,
        "print_type": None,
        "fabric_hint": None,
        "occasion_tags": [],
        "work_description": None,
        "confidence": None,
    }

    if not _clip_available or _clip_model is None:
        return empty

    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        # Resize to speed up encoding
        img.thumbnail((336, 336))

        # ── Embroidery detection ──────────────────────────────
        emb_results = _classify(img, EMBROIDERY_PROMPTS, top_k=1)
        embroidery_type: Optional[str] = None
        emb_conf = 0.0
        if emb_results:
            label, score = emb_results[0]
            if score >= MIN_CONFIDENCE and label != "Plain / No Embroidery":
                embroidery_type = label
                emb_conf = score

        # ── Print detection ───────────────────────────────────
        prt_results = _classify(img, PRINT_PROMPTS, top_k=1)
        print_type: Optional[str] = None
        prt_conf = 0.0
        if prt_results:
            label, score = prt_results[0]
            if score >= MIN_CONFIDENCE and label != "Plain / No Print":
                print_type = label
                prt_conf = score

        # ── Occasion inference from detected attributes ───────
        from services.indian_wear_knowledge import infer_occasions
        occasion_tags = infer_occasions(
            embroidery_type=embroidery_type,
            print_type=print_type,
        )

        # ── Overall confidence ────────────────────────────────
        best_conf = max(emb_conf, prt_conf)
        confidence = _to_confidence(best_conf) if best_conf > 0 else None

        # ── Work description ──────────────────────────────────
        parts = []
        if embroidery_type:
            parts.append(embroidery_type)
        if print_type:
            parts.append(print_type)
        work_description = (
            f"Detected: {' + '.join(parts)}" if parts else None
        )

        return {
            "embroidery_type": embroidery_type,
            "print_type": print_type,
            "fabric_hint": None,   # CLIP can't reliably detect fabric texture
            "occasion_tags": occasion_tags,
            "work_description": work_description,
            "confidence": confidence,
        }

    except Exception as exc:
        log.warning("auto_tag_design (CLIP) failed: %s", exc)
        return empty
