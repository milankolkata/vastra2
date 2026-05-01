"""
CLIP-based image embedding service with full graceful fallback.

Priority:
  1. sentence-transformers + CLIP (best quality, ~512-dim)
  2. Pillow colour-histogram fallback (no torch required, ~48-dim, still useful)

Also provides Design Intelligence: auto-extracts dominant colours from images.
"""
from __future__ import annotations
import io
import logging
from typing import Optional
import numpy as np
from PIL import Image

log = logging.getLogger(__name__)

# ── Try to load CLIP model once at import time ─────────────────
_clip_model = None
_clip_available = False

try:
    from sentence_transformers import SentenceTransformer   # type: ignore
    _clip_model = SentenceTransformer("clip-ViT-B-32")
    _clip_available = True
    log.info("CLIP model loaded — full visual similarity enabled.")
except Exception as exc:
    log.warning("CLIP unavailable (%s). Falling back to colour-histogram embeddings.", exc)


# ── Public API ─────────────────────────────────────────────────

def embed_image(image_bytes: bytes) -> Optional[list[float]]:
    """Return a normalized float vector for the given image bytes, or None on failure."""
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        if _clip_available and _clip_model is not None:
            vec = _clip_model.encode(img, convert_to_numpy=True)
        else:
            vec = _histogram_embedding(img)
        # Normalize to unit length (cosine similarity requires this)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()
    except Exception as exc:
        log.error("embed_image failed: %s", exc)
        return None


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Cosine similarity in [0, 1]. Returns 0.5 if either vector is None."""
    if not a or not b or len(a) != len(b):
        return 0.5
    va, vb = np.array(a, dtype=float), np.array(b, dtype=float)
    denom = np.linalg.norm(va) * np.linalg.norm(vb)
    if denom == 0:
        return 0.5
    raw = float(np.dot(va, vb) / denom)
    # Map [-1, 1] → [0, 1]
    return (raw + 1) / 2


def extract_dominant_colors(image_bytes: bytes, top_n: int = 5) -> list[dict]:
    """
    Design Intelligence — returns top N dominant colours from the image.
    Each item: { hex, name_approx, percentage }
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((100, 100))  # Downscale for speed
        pixels = np.array(img).reshape(-1, 3)

        # Quantise to 8-bit palette → use PIL's quantize
        pil_small = Image.fromarray(pixels.reshape(100, 100, 3).astype(np.uint8))
        quantised = pil_small.quantize(colors=top_n)
        palette = quantised.getpalette()

        counts: dict[tuple, int] = {}
        for idx in quantised.getdata():
            r = palette[idx * 3]
            g = palette[idx * 3 + 1]
            b = palette[idx * 3 + 2]
            counts[(r, g, b)] = counts.get((r, g, b), 0) + 1

        total = sum(counts.values()) or 1
        results = []
        for (r, g, b), cnt in sorted(counts.items(), key=lambda x: -x[1])[:top_n]:
            results.append({
                "hex": f"#{r:02x}{g:02x}{b:02x}",
                "name_approx": _name_color(r, g, b),
                "percentage": round(cnt / total * 100, 1),
            })
        return results
    except Exception:
        return []


# ── Private helpers ────────────────────────────────────────────

def _histogram_embedding(img: Image.Image) -> np.ndarray:
    """16-bin histogram per RGB channel → 48-dim vector."""
    bins = 16
    channels = [np.histogram(np.array(img)[:, :, c], bins=bins, range=(0, 256))[0] for c in range(3)]
    vec = np.concatenate(channels).astype(float)
    return vec


def _name_color(r: int, g: int, b: int) -> str:
    """Very simple colour name approximation."""
    # Convert to HSV-like hue bucket
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 50:
        return "Black"
    if mn > 200:
        return "White"
    if mx - mn < 30:
        if mx < 130:
            return "Dark Grey"
        return "Light Grey"
    # Dominant channel
    if r > g and r > b:
        if g > b * 1.5:
            return "Yellow" if g > 150 else "Orange"
        return "Red" if r > 150 else "Dark Red"
    if g > r and g > b:
        return "Green" if g > 150 else "Dark Green"
    if b > r and b > g:
        return "Blue" if b > 150 else "Dark Blue"
    if r > 150 and b > 150 and g < 100:
        return "Purple"
    if r > 180 and g > 140 and b > 120:
        return "Peach"
    return "Mixed"
