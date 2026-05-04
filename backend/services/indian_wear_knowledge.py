"""
Indian Ethnic Wear Knowledge Base
Complete taxonomy of embroidery, prints, fabrics, occasions, and their
semantic relationships — used for intelligent customer-design matching.
"""
from __future__ import annotations

# ─────────────────────────────────────────────────────────────────────────────
# EMBROIDERY — canonical names → synonyms / alternate spellings
# ─────────────────────────────────────────────────────────────────────────────

EMBROIDERY_SYNONYMS: dict[str, list[str]] = {
    "Zardozi": [
        "zari", "zardosi", "zardozy", "metal thread embroidery",
        "gold embroidery", "silver embroidery", "zari work", "dabka zardozi",
        "badla embroidery",
    ],
    "Chikankari": [
        "chikan", "chikankari work", "lucknowi embroidery",
        "lucknow embroidery", "shadow work", "chikan kari",
    ],
    "Kantha": [
        "kantha work", "kantha stitch", "nakshi kantha",
        "running stitch", "bengali embroidery", "kantha embroidery",
    ],
    "Phulkari": [
        "phulkari work", "punjabi embroidery", "flower work",
        "bagh phulkari", "odhni embroidery",
    ],
    "Kashmiri Embroidery": [
        "kashida", "kashmiri work", "kashmir embroidery",
        "sozni", "sozani", "tilla work", "kashmiri sozni",
    ],
    "Aari / Maggam": [
        "aari", "maggam", "aari work", "maggam work",
        "chain stitch embroidery", "ari embroidery", "ari work",
        "south indian embroidery", "tambour embroidery",
    ],
    "Mirror Work": [
        "shisha", "sheesha", "mirror embroidery", "shisheh",
        "kutch mirror work", "gujarat mirror work", "abla work",
        "mirror stitch",
    ],
    "Gota Patti": [
        "gota", "gota work", "gota embroidery", "rajasthani gota",
        "kinari work", "gota lace", "gota patti work",
    ],
    "Mukaish / Kamdani": [
        "mukaish", "kamdani", "badla", "metal dot embroidery",
        "mukaish work", "kamdani work",
    ],
    "Dabka": [
        "dabka work", "dabka embroidery", "wire embroidery",
        "nakshi dabka",
    ],
    "Beadwork": [
        "bead embroidery", "beaded work", "pearl work",
        "moti work", "sitara work", "moti embroidery",
    ],
    "Sequin Work": [
        "sequin", "sitara", "sequence work", "paillette",
        "sequin embroidery", "chamki work",
    ],
    "Resham / Silk Thread": [
        "resham", "resham work", "silk thread embroidery",
        "thread embroidery", "silk embroidery", "resham embroidery",
        "thread work",
    ],
    "Sujni": [
        "sujni work", "bihar embroidery", "sujni kantha",
        "sujni stitch",
    ],
    "Banjara": [
        "banjara work", "lambadi", "banjara embroidery",
        "tribal embroidery", "lambani", "banjara tribal work",
    ],
    "Kutch Embroidery": [
        "kutchi", "kutch work", "kathiawar embroidery",
        "gujarat embroidery", "kutchi embroidery", "rabari work",
    ],
    "Cross Stitch": [
        "cross-stitch", "cross stitch work", "counted thread",
    ],
    "Smocking": [
        "smocked", "smocking work", "honeycomb smocking",
    ],
    "Tukdi Patchwork": [
        "tukdi", "patchwork embroidery", "rabari patchwork",
        "gujarat patchwork", "applique work", "tukdi work",
    ],
    "Nakshi / Artisanal Thread": [
        "nakshi", "hand embroidery", "artisanal thread", "folk embroidery",
    ],
    "Plain / No Embroidery": [
        "plain", "unembroidered", "no work", "without embroidery",
        "no embroidery",
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# PRINT — canonical names → synonyms
# ─────────────────────────────────────────────────────────────────────────────

PRINT_SYNONYMS: dict[str, list[str]] = {
    "Block Print": [
        "block printing", "hand block print", "woodblock print",
        "sanganeri print", "bagru print", "hand block",
        "dabu block", "rajasthani block",
    ],
    "Bandhani": [
        "bandhej", "tie-dye", "tie dye", "bandani", "bandhni",
        "gujrati bandhani", "rajasthani bandhani", "chunri",
        "bandhini", "bandhan",
    ],
    "Batik": [
        "batik print", "wax resist print", "batik work", "wax batik",
    ],
    "Kalamkari": [
        "kalamkari print", "pen work print", "srikalahasti",
        "machilipatnam", "pen kalamkari",
    ],
    "Ajrakh": [
        "ajrak", "ajrakh print", "sindhi print",
        "kutch ajrakh", "resist block print",
    ],
    "Dabu": [
        "dabu print", "dabu resist", "mud resist print",
        "dabu mud print",
    ],
    "Leheriya": [
        "leheria", "leher print", "diagonal stripe print",
        "tie-dye stripe", "lahariya",
    ],
    "Shibori": [
        "shibori print", "indigo print", "japanese tie-dye",
        "shibori dye",
    ],
    "Ikat": [
        "ikkat", "ikat print", "pochampally ikat",
        "patola ikat", "orissa ikat", "sambalpuri",
        "double ikat",
    ],
    "Digital Print": [
        "digital", "digital printing", "inkjet print",
        "digital textile print",
    ],
    "Screen Print": [
        "screen printing", "stencil print", "flat screen",
        "rotary screen print",
    ],
    "Jamdani": [
        "jamdani print", "jamdani weave", "muslin jamdani",
        "dhakai jamdani",
    ],
    "Warli": [
        "warli print", "warli art", "tribal print",
        "maharashtra tribal print", "warli painting",
    ],
    "Madhubani": [
        "mithila print", "madhubani art", "mithila art",
        "bihar print", "madhubani painting print",
    ],
    "Floral Print": [
        "floral", "flower print", "botanical print",
        "rose print", "floral design",
    ],
    "Geometric Print": [
        "geometric", "abstract geometric", "chevron",
        "grid print", "trellis print",
    ],
    "Abstract Print": [
        "abstract", "modern print", "contemporary print",
        "abstract design",
    ],
    "Paisley": [
        "paisley print", "boteh", "kairi", "mango print",
        "paisley design",
    ],
    "Patola": [
        "patola print", "patan patola", "patola design",
        "patola silk print",
    ],
    "Pochampally": [
        "pochampally print", "telangana ikat",
        "pochampally design",
    ],
    "Stripe / Checks": [
        "striped", "checked", "plaid", "madras check",
        "gingham", "stripes",
    ],
    "Zari / Brocade Woven": [
        "brocade", "zari weave", "kinkhab", "woven gold",
        "woven pattern",
    ],
    "Plain / No Print": [
        "plain", "solid", "no print", "unpatterned",
        "solid color",
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# FABRIC — canonical names → synonyms
# ─────────────────────────────────────────────────────────────────────────────

FABRIC_SYNONYMS: dict[str, list[str]] = {
    "Banarasi Silk": [
        "banarasi", "banaras silk", "varanasi silk",
        "banarasi saree fabric", "banarasi weave",
    ],
    "Kanjivaram Silk": [
        "kanjeevaram", "kanchipuram silk", "kanchi silk",
        "kanjivaram", "kanchi kanjivaram",
    ],
    "Tussar Silk": [
        "tussar", "tasar silk", "kosa silk", "wild silk", "tussar saree",
    ],
    "Chanderi": [
        "chanderi silk", "chanderi cotton", "chanderi fabric",
        "madhya pradesh fabric",
    ],
    "Mysore Silk": ["mysore silk", "mysore crepe silk", "karnataka silk"],
    "Organza": ["organza silk", "tissue fabric", "organza weave"],
    "Pure Silk": [
        "silk", "pure silk", "mulberry silk", "charmeuse",
        "silk fabric",
    ],
    "Dupion Silk": ["dupion", "raw silk dupion", "shantung", "dupioni"],
    "Georgette": [
        "georgette fabric", "crinkle georgette",
        "chiffon georgette", "georgette saree",
    ],
    "Chiffon": ["chiffon fabric", "silk chiffon", "poly chiffon"],
    "Net": ["net fabric", "tulle", "mesh", "net saree"],
    "Velvet": ["velvet fabric", "silk velvet", "crushed velvet"],
    "Mulmul": ["mulmul cotton", "muslin", "mul cotton", "mul mul"],
    "Khadi": ["khadi cotton", "handloom cotton", "khaddar", "khadi fabric"],
    "Cotton": ["cotton fabric", "pure cotton", "cotton saree"],
    "Linen": ["linen fabric", "linen cotton", "pure linen"],
    "Rayon": ["rayon fabric", "viscose", "viscose rayon"],
    "Crepe": ["crepe fabric", "crepe georgette", "crêpe", "crepe silk"],
    "Patola Silk": ["patola fabric", "gujarat silk", "patola weave"],
    "Paithani Silk": ["paithani", "maharashtra silk", "paithani fabric"],
    "Pochampally Fabric": [
        "pochampally fabric", "telangana handloom",
        "pochampally saree",
    ],
    "Bhagalpuri Silk": [
        "bhagalpuri", "bhagalpur silk", "art silk",
        "bhagalpuri saree",
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# SEMANTIC GROUPS — items in the same group get partial credit when matching
# ─────────────────────────────────────────────────────────────────────────────

EMBROIDERY_GROUPS: dict[str, list[str]] = {
    "heavy_bridal_embroidery": [
        "Zardozi", "Aari / Maggam", "Beadwork", "Dabka",
        "Mukaish / Kamdani", "Sequin Work",
    ],
    "light_casual_embroidery": [
        "Chikankari", "Kantha", "Resham / Silk Thread",
        "Sujni", "Cross Stitch", "Nakshi / Artisanal Thread",
    ],
    "regional_folk_embroidery": [
        "Phulkari", "Kashmiri Embroidery", "Mirror Work",
        "Gota Patti", "Kutch Embroidery", "Banjara",
        "Tukdi Patchwork", "Smocking",
    ],
    "festive_embroidery": [
        "Sequin Work", "Zardozi", "Gota Patti",
        "Beadwork", "Aari / Maggam", "Mirror Work",
    ],
    "metal_thread_embroidery": [
        "Zardozi", "Dabka", "Mukaish / Kamdani",
        "Gota Patti",
    ],
    "thread_embroidery": [
        "Resham / Silk Thread", "Kantha", "Phulkari",
        "Chikankari", "Sujni", "Kashmiri Embroidery",
        "Nakshi / Artisanal Thread",
    ],
}

PRINT_GROUPS: dict[str, list[str]] = {
    "resist_print": [
        "Block Print", "Batik", "Dabu", "Ajrakh", "Shibori",
    ],
    "tie_dye": ["Bandhani", "Leheriya", "Shibori"],
    "hand_crafted_art_print": [
        "Kalamkari", "Warli", "Madhubani", "Block Print",
    ],
    "woven_pattern": [
        "Ikat", "Jamdani", "Patola", "Pochampally",
        "Zari / Brocade Woven",
    ],
    "modern_digital_print": [
        "Digital Print", "Screen Print", "Abstract Print",
        "Geometric Print", "Floral Print",
    ],
    "traditional_festive_print": [
        "Bandhani", "Leheriya", "Block Print", "Ikat",
        "Paisley", "Patola",
    ],
    "tribal_regional_print": [
        "Ajrakh", "Warli", "Madhubani", "Kalamkari",
        "Pochampally",
    ],
}

FABRIC_GROUPS: dict[str, list[str]] = {
    "silk": [
        "Pure Silk", "Banarasi Silk", "Kanjivaram Silk",
        "Tussar Silk", "Mysore Silk", "Dupion Silk",
        "Organza", "Patola Silk", "Paithani Silk",
        "Bhagalpuri Silk",
    ],
    "cotton": [
        "Cotton", "Mulmul", "Khadi", "Chanderi", "Linen",
        "Pochampally Fabric",
    ],
    "synthetic_light": [
        "Georgette", "Chiffon", "Crepe", "Net", "Rayon",
    ],
    "luxury_fabric": [
        "Banarasi Silk", "Kanjivaram Silk", "Velvet",
        "Organza", "Patola Silk", "Paithani Silk",
    ],
    "lightweight_fabric": [
        "Chiffon", "Georgette", "Organza", "Mulmul",
    ],
    "handloom_fabric": [
        "Chanderi", "Khadi", "Pochampally Fabric",
        "Paithani Silk", "Patola Silk",
        "Kanjivaram Silk", "Banarasi Silk",
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# OCCASIONS
# ─────────────────────────────────────────────────────────────────────────────

ALL_OCCASIONS: list[str] = [
    "Bridal",
    "Wedding Guest",
    "Sangeet",
    "Mehendi",
    "Reception",
    "Diwali",
    "Navratri",
    "Eid",
    "Holi",
    "Festive",
    "Party Wear",
    "Semi-Formal",
    "Office / Formal",
    "Casual",
    "Daily Wear",
]

EMBROIDERY_OCCASIONS: dict[str, list[str]] = {
    "Zardozi": ["Bridal", "Reception", "Wedding Guest", "Sangeet", "Festive"],
    "Chikankari": ["Casual", "Semi-Formal", "Eid", "Festive", "Office / Formal"],
    "Kantha": ["Casual", "Festive", "Semi-Formal"],
    "Phulkari": ["Festive", "Wedding Guest", "Sangeet", "Navratri", "Casual"],
    "Kashmiri Embroidery": ["Festive", "Semi-Formal", "Wedding Guest", "Bridal"],
    "Aari / Maggam": ["Bridal", "Reception", "Festive", "Party Wear", "Sangeet"],
    "Mirror Work": ["Navratri", "Festive", "Wedding Guest", "Casual", "Sangeet"],
    "Gota Patti": ["Bridal", "Wedding Guest", "Festive", "Mehendi", "Sangeet", "Navratri"],
    "Mukaish / Kamdani": ["Bridal", "Festive", "Eid", "Reception"],
    "Dabka": ["Bridal", "Festive", "Reception"],
    "Beadwork": ["Bridal", "Party Wear", "Reception", "Festive"],
    "Sequin Work": ["Party Wear", "Sangeet", "Festive", "Reception", "Bridal"],
    "Resham / Silk Thread": ["Festive", "Semi-Formal", "Wedding Guest", "Casual"],
    "Sujni": ["Casual", "Festive"],
    "Banjara": ["Casual", "Festive", "Navratri"],
    "Kutch Embroidery": ["Festive", "Casual", "Wedding Guest", "Navratri"],
    "Cross Stitch": ["Casual", "Semi-Formal"],
    "Smocking": ["Casual"],
    "Tukdi Patchwork": ["Casual", "Festive"],
    "Nakshi / Artisanal Thread": ["Casual", "Festive", "Semi-Formal"],
    "Plain / No Embroidery": ["Casual", "Daily Wear", "Office / Formal", "Semi-Formal"],
}

PRINT_OCCASIONS: dict[str, list[str]] = {
    "Block Print": ["Casual", "Festive", "Semi-Formal"],
    "Bandhani": ["Navratri", "Festive", "Wedding Guest", "Casual", "Mehendi"],
    "Batik": ["Casual", "Semi-Formal"],
    "Kalamkari": ["Casual", "Festive", "Semi-Formal", "Office / Formal"],
    "Ajrakh": ["Casual", "Festive", "Semi-Formal"],
    "Dabu": ["Casual", "Festive"],
    "Leheriya": ["Festive", "Navratri", "Casual"],
    "Shibori": ["Casual", "Semi-Formal"],
    "Ikat": ["Casual", "Festive", "Semi-Formal"],
    "Digital Print": ["Casual", "Party Wear", "Semi-Formal"],
    "Screen Print": ["Casual", "Party Wear"],
    "Jamdani": ["Casual", "Semi-Formal", "Festive"],
    "Warli": ["Casual", "Festive"],
    "Madhubani": ["Casual", "Festive"],
    "Floral Print": ["Casual", "Festive", "Semi-Formal"],
    "Geometric Print": ["Casual", "Office / Formal"],
    "Abstract Print": ["Casual", "Party Wear", "Semi-Formal"],
    "Paisley": ["Festive", "Semi-Formal", "Casual"],
    "Patola": ["Festive", "Wedding Guest", "Semi-Formal"],
    "Pochampally": ["Casual", "Semi-Formal", "Festive"],
    "Stripe / Checks": ["Casual", "Office / Formal"],
    "Zari / Brocade Woven": ["Festive", "Bridal", "Wedding Guest"],
    "Plain / No Print": ["Casual", "Daily Wear", "Office / Formal"],
}

FABRIC_OCCASIONS: dict[str, list[str]] = {
    "Banarasi Silk": ["Bridal", "Reception", "Festive", "Wedding Guest"],
    "Kanjivaram Silk": ["Bridal", "Reception", "Festive", "Wedding Guest"],
    "Tussar Silk": ["Festive", "Semi-Formal", "Casual"],
    "Chanderi": ["Festive", "Casual", "Semi-Formal", "Office / Formal"],
    "Mysore Silk": ["Festive", "Semi-Formal", "Wedding Guest"],
    "Organza": ["Bridal", "Reception", "Party Wear", "Festive"],
    "Pure Silk": ["Bridal", "Festive", "Semi-Formal", "Wedding Guest"],
    "Dupion Silk": ["Festive", "Wedding Guest", "Semi-Formal"],
    "Georgette": ["Party Wear", "Casual", "Semi-Formal", "Festive"],
    "Chiffon": ["Party Wear", "Casual", "Semi-Formal"],
    "Net": ["Bridal", "Reception", "Party Wear"],
    "Velvet": ["Bridal", "Reception", "Festive", "Party Wear"],
    "Mulmul": ["Casual", "Daily Wear"],
    "Khadi": ["Casual", "Office / Formal", "Semi-Formal"],
    "Cotton": ["Casual", "Daily Wear", "Office / Formal"],
    "Linen": ["Casual", "Office / Formal"],
    "Rayon": ["Casual", "Semi-Formal", "Party Wear"],
    "Patola Silk": ["Festive", "Wedding Guest", "Bridal"],
    "Paithani Silk": ["Festive", "Bridal", "Wedding Guest", "Reception"],
    "Bhagalpuri Silk": ["Festive", "Casual", "Semi-Formal"],
}

CATEGORY_OCCASIONS: dict[str, list[str]] = {
    "Sarees": ["Bridal", "Wedding Guest", "Festive", "Semi-Formal", "Office / Formal", "Casual"],
    "Lehengas": ["Bridal", "Sangeet", "Mehendi", "Reception", "Wedding Guest", "Party Wear"],
    "Anarkali Suits": ["Festive", "Party Wear", "Semi-Formal", "Wedding Guest"],
    "Salwar Suits": ["Festive", "Casual", "Semi-Formal", "Office / Formal"],
    "Kurtis": ["Casual", "Office / Formal", "Semi-Formal", "Daily Wear"],
    "Dupattas": ["Festive", "Wedding Guest", "Semi-Formal"],
    "Sharara": ["Bridal", "Sangeet", "Festive", "Wedding Guest"],
    "Gharara": ["Bridal", "Eid", "Festive", "Wedding Guest"],
    "Palazzo Suits": ["Casual", "Semi-Formal", "Party Wear"],
}

# ─────────────────────────────────────────────────────────────────────────────
# REGIONAL ASSOCIATIONS
# ─────────────────────────────────────────────────────────────────────────────

EMBROIDERY_REGIONS: dict[str, list[str]] = {
    "Zardozi": ["Uttar Pradesh", "Delhi", "Rajasthan", "Telangana"],
    "Chikankari": ["Uttar Pradesh"],
    "Kantha": ["West Bengal", "Odisha"],
    "Phulkari": ["Punjab", "Haryana"],
    "Kashmiri Embroidery": ["Jammu & Kashmir"],
    "Aari / Maggam": ["Tamil Nadu", "Andhra Pradesh", "Telangana", "Karnataka"],
    "Mirror Work": ["Gujarat", "Rajasthan"],
    "Gota Patti": ["Rajasthan"],
    "Mukaish / Kamdani": ["Uttar Pradesh"],
    "Kutch Embroidery": ["Gujarat"],
    "Banjara": ["Telangana", "Maharashtra", "Karnataka"],
    "Sujni": ["Bihar"],
    "Tukdi Patchwork": ["Gujarat"],
}

PRINT_REGIONS: dict[str, list[str]] = {
    "Block Print": ["Rajasthan", "Gujarat"],
    "Bandhani": ["Gujarat", "Rajasthan"],
    "Kalamkari": ["Andhra Pradesh", "Telangana"],
    "Ajrakh": ["Gujarat", "Rajasthan"],
    "Dabu": ["Rajasthan"],
    "Leheriya": ["Rajasthan"],
    "Ikat": ["Odisha", "Andhra Pradesh", "Gujarat", "Telangana"],
    "Jamdani": ["West Bengal"],
    "Warli": ["Maharashtra"],
    "Madhubani": ["Bihar"],
    "Patola": ["Gujarat"],
    "Pochampally": ["Telangana"],
}

# ─────────────────────────────────────────────────────────────────────────────
# SCORING CONSTANTS
# ─────────────────────────────────────────────────────────────────────────────

# How much credit to give for same-group (but not exact) match
SAME_GROUP_SCORE = 0.55
# How much credit for matching via synonyms (already counted as exact=1.0)
RELATED_SCORE = 0.25  # cross-group soft relation

# ─────────────────────────────────────────────────────────────────────────────
# LOOKUP HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def _build_reverse_map(synonyms: dict[str, list[str]]) -> dict[str, str]:
    """Map every alias → canonical name (lower-cased)."""
    rev: dict[str, str] = {}
    for canonical, aliases in synonyms.items():
        rev[canonical.lower()] = canonical
        for alias in aliases:
            rev[alias.lower()] = canonical
    return rev


_EMB_REVERSE = _build_reverse_map(EMBROIDERY_SYNONYMS)
_PRT_REVERSE = _build_reverse_map(PRINT_SYNONYMS)
_FAB_REVERSE = _build_reverse_map(FABRIC_SYNONYMS)


def normalize_embroidery(raw: str) -> str | None:
    """Return canonical embroidery name, or None if unrecognised."""
    return _EMB_REVERSE.get(raw.strip().lower())


def normalize_print(raw: str) -> str | None:
    """Return canonical print name, or None if unrecognised."""
    return _PRT_REVERSE.get(raw.strip().lower())


def normalize_fabric(raw: str) -> str | None:
    """Return canonical fabric name, or None if unrecognised."""
    return _FAB_REVERSE.get(raw.strip().lower())


def _groups_for(item: str, groups: dict[str, list[str]]) -> set[str]:
    """Return all group keys that contain this canonical item."""
    return {g for g, members in groups.items() if item in members}


# ─────────────────────────────────────────────────────────────────────────────
# SEMANTIC SIMILARITY
# ─────────────────────────────────────────────────────────────────────────────

def embroidery_similarity(a: str, b: str) -> float:
    """
    Semantic similarity [0,1] between two embroidery descriptors.
    Exact canonical match → 1.0
    Same semantic group    → SAME_GROUP_SCORE
    Cross-group soft match → RELATED_SCORE
    """
    ca = normalize_embroidery(a) or a.strip()
    cb = normalize_embroidery(b) or b.strip()
    if ca.lower() == cb.lower():
        return 1.0
    ga = _groups_for(ca, EMBROIDERY_GROUPS)
    gb = _groups_for(cb, EMBROIDERY_GROUPS)
    if ga & gb:
        return SAME_GROUP_SCORE
    # Soft: one is "heavy" and other is "festive" → mild relation
    if (ga | gb) and (
        {"heavy_bridal_embroidery", "festive_embroidery"} & (ga | gb)
    ):
        return RELATED_SCORE
    return 0.0


def print_similarity(a: str, b: str) -> float:
    """
    Semantic similarity [0,1] between two print descriptors.
    """
    ca = normalize_print(a) or a.strip()
    cb = normalize_print(b) or b.strip()
    if ca.lower() == cb.lower():
        return 1.0
    ga = _groups_for(ca, PRINT_GROUPS)
    gb = _groups_for(cb, PRINT_GROUPS)
    if ga & gb:
        return SAME_GROUP_SCORE
    return 0.0


def fabric_similarity(a: str, b: str) -> float:
    """
    Semantic similarity [0,1] between two fabric descriptors.
    """
    ca = normalize_fabric(a) or a.strip()
    cb = normalize_fabric(b) or b.strip()
    if ca.lower() == cb.lower():
        return 1.0
    ga = _groups_for(ca, FABRIC_GROUPS)
    gb = _groups_for(cb, FABRIC_GROUPS)
    if ga & gb:
        return SAME_GROUP_SCORE
    return 0.0


# ─────────────────────────────────────────────────────────────────────────────
# OCCASION INFERENCE
# Infer likely occasions from design attributes (embroidery + print + fabric + category)
# ─────────────────────────────────────────────────────────────────────────────

def infer_occasions(
    *,
    embroidery_type: str | None = None,
    print_type: str | None = None,
    fabric: str | None = None,
    category: str | None = None,
) -> list[str]:
    """
    Infer likely occasion tags for a design from its attributes.
    Returns occasions sorted by vote count (most supported first).
    """
    votes: dict[str, int] = {}

    def _vote(occasions: list[str], weight: int = 1):
        for occ in occasions:
            votes[occ] = votes.get(occ, 0) + weight

    if embroidery_type:
        canon = normalize_embroidery(embroidery_type) or embroidery_type
        _vote(EMBROIDERY_OCCASIONS.get(canon, []), weight=3)

    if print_type:
        canon = normalize_print(print_type) or print_type
        _vote(PRINT_OCCASIONS.get(canon, []), weight=2)

    if fabric:
        canon = normalize_fabric(fabric) or fabric
        _vote(FABRIC_OCCASIONS.get(canon, []), weight=2)

    if category:
        canon_cat = category.strip().title()
        _vote(CATEGORY_OCCASIONS.get(canon_cat, []), weight=1)

    if not votes:
        return ["Casual", "Festive"]

    sorted_occs = sorted(votes, key=lambda x: -votes[x])
    # Return top occasions above a minimum vote threshold
    max_votes = votes[sorted_occs[0]]
    threshold = max(1, max_votes // 3)
    return [o for o in sorted_occs if votes[o] >= threshold]


# ─────────────────────────────────────────────────────────────────────────────
# OCCASION OVERLAP SCORE
# How well do the design's inferred occasions match what the customer wants?
# ─────────────────────────────────────────────────────────────────────────────

def occasion_match_score(
    design_occasions: list[str],
    customer_occasions: list[str],
) -> float:
    """
    Jaccard-style overlap between two occasion lists, [0, 1].
    'Festive' is treated as a parent of Diwali/Navratri/Eid/Holi.
    """
    if not design_occasions or not customer_occasions:
        return 0.5  # neutral

    FESTIVE_CHILDREN = {"Diwali", "Navratri", "Eid", "Holi", "Festive"}

    def _expand(occ_list: list[str]) -> set[str]:
        expanded = set(occ_list)
        # If any specific festive is listed, also add "Festive"
        if expanded & FESTIVE_CHILDREN:
            expanded.add("Festive")
        return expanded

    d_set = _expand(design_occasions)
    c_set = _expand(customer_occasions)
    intersection = d_set & c_set
    union = d_set | c_set
    return len(intersection) / len(union) if union else 0.5


# ─────────────────────────────────────────────────────────────────────────────
# REGION AFFINITY
# Does the design's embroidery/print origin match the customer's state?
# ─────────────────────────────────────────────────────────────────────────────

def region_affinity(
    *,
    embroidery_type: str | None,
    print_type: str | None,
    customer_state: str | None,
) -> float:
    """
    Small bonus [0, 0.3] if the design's craft origin matches the customer's state.
    """
    if not customer_state:
        return 0.0
    state = customer_state.strip().title()

    for raw, lookup in [
        (embroidery_type, EMBROIDERY_REGIONS),
        (print_type, PRINT_REGIONS),
    ]:
        if not raw:
            continue
        canon = (
            normalize_embroidery(raw) if lookup is EMBROIDERY_REGIONS
            else normalize_print(raw)
        ) or raw
        regions = lookup.get(canon, [])
        if state in regions:
            return 0.30
    return 0.0


# ─────────────────────────────────────────────────────────────────────────────
# DISPLAY HELPERS — used by UI / WhatsApp messages
# ─────────────────────────────────────────────────────────────────────────────

def all_embroidery_types() -> list[str]:
    return sorted(k for k in EMBROIDERY_SYNONYMS if k != "Plain / No Embroidery") + ["Plain / No Embroidery"]


def all_print_types() -> list[str]:
    return sorted(k for k in PRINT_SYNONYMS if k != "Plain / No Print") + ["Plain / No Print"]


def all_fabric_types() -> list[str]:
    return sorted(FABRIC_SYNONYMS.keys())


def all_occasions() -> list[str]:
    return ALL_OCCASIONS
