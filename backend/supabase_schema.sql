-- ═══════════════════════════════════════════════════
-- Vastra AI — Supabase Schema (run in SQL Editor)
-- ═══════════════════════════════════════════════════

-- 1. DESIGNS TABLE
CREATE TABLE IF NOT EXISTS designs (
    id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    name           TEXT        NOT NULL,
    category       TEXT,
    color          TEXT,
    fabric         TEXT,
    work_type      TEXT,           -- legacy / catch-all style field
    embroidery_type TEXT,          -- canonical embroidery name (Zardozi, Chikankari …)
    print_type     TEXT,           -- canonical print name (Bandhani, Block Print …)
    occasion_tags  TEXT[]  DEFAULT '{}',   -- inferred + user-confirmed occasions
    price          NUMERIC,
    image_url      TEXT,
    embedding      JSONB,          -- CLIP 512-dim vector stored as JSON array
    auto_colors    JSONB,          -- Design Intelligence: top extracted colours
    auto_tags      JSONB,          -- Claude Vision auto-detected attributes
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS designs_category_idx      ON designs (category);
CREATE INDEX IF NOT EXISTS designs_color_idx         ON designs (color);
CREATE INDEX IF NOT EXISTS designs_embroidery_idx    ON designs (embroidery_type);
CREATE INDEX IF NOT EXISTS designs_print_idx         ON designs (print_type);

-- ─────────────────────────────────────────────────────────────
-- Migration: add new columns to existing designs table
-- (safe to run even if table already exists)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE designs ADD COLUMN IF NOT EXISTS embroidery_type TEXT;
ALTER TABLE designs ADD COLUMN IF NOT EXISTS print_type      TEXT;
ALTER TABLE designs ADD COLUMN IF NOT EXISTS occasion_tags   TEXT[] DEFAULT '{}';
ALTER TABLE designs ADD COLUMN IF NOT EXISTS auto_tags       JSONB;


-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id                     UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
    name                   TEXT    NOT NULL,
    phone                  TEXT,
    region_city            TEXT,
    region_state           TEXT,

    -- Legacy preference fields (still used for backward compat)
    preferred_categories   TEXT[]  DEFAULT '{}',
    preferred_styles       TEXT[]  DEFAULT '{}',
    color_preference       TEXT[]  DEFAULT '{}',

    -- Rich Indian wear preference fields
    embroidery_preferences TEXT[]  DEFAULT '{}',  -- e.g. {"Zardozi","Chikankari"}
    print_preferences      TEXT[]  DEFAULT '{}',  -- e.g. {"Bandhani","Block Print"}
    fabric_preferences     TEXT[]  DEFAULT '{}',  -- e.g. {"Kanjivaram Silk","Cotton"}
    occasion_preferences   TEXT[]  DEFAULT '{}',  -- e.g. {"Bridal","Festive"}

    price_min              NUMERIC,
    price_max              NUMERIC,
    notes                  TEXT,
    created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: add new preference columns to existing customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS embroidery_preferences TEXT[] DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS print_preferences      TEXT[] DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS fabric_preferences     TEXT[] DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS occasion_preferences   TEXT[] DEFAULT '{}';


-- 3. CUSTOMER IMAGE PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS customer_image_prefs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    image_url   TEXT,
    embedding   JSONB,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cust_img_customer_idx ON customer_image_prefs (customer_id);


-- 4. TRENDS TABLE (optional — used for image URL caching)
CREATE TABLE IF NOT EXISTS trends_cache (
    id               TEXT        PRIMARY KEY,
    title            TEXT        NOT NULL,
    product_type     TEXT,
    category         TEXT,
    work_type        TEXT,
    fabric_type      TEXT,
    colors           JSONB,
    color_names      JSONB,
    region           TEXT,
    festival_tags    JSONB,
    why_trending     TEXT,
    demand_insight   TEXT,
    who_should_sell  TEXT,
    fabric_insight   TEXT,
    source_name      TEXT,
    source_url       TEXT,
    image_url        TEXT,
    base_score       INTEGER,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS trends_product_type_idx ON trends_cache (product_type);
CREATE INDEX IF NOT EXISTS trends_work_type_idx    ON trends_cache (work_type);

-- ═══════════════════════════════════════════════════
-- STORAGE BUCKETS (run in Storage > New Bucket or use API)
-- ═══════════════════════════════════════════════════
-- Bucket: designs         (public)
-- Bucket: customer-images (public)

-- ═══════════════════════════════════════════════════
-- RLS POLICIES
-- For development, disable RLS on all tables.
-- For production, add user-scoped policies.
-- ═══════════════════════════════════════════════════
