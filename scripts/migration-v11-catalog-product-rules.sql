-- ============================================================
-- Migration v11: Catalog Product Rules
-- plates ve accessories tablolarına katalog + karar motoru
-- için gerekli kolonlar eklenir.
-- ============================================================

-- ─── plates tablosu ─────────────────────────────────────────

ALTER TABLE plates
  ADD COLUMN IF NOT EXISTS slug                     TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS sales_mode               TEXT DEFAULT 'quote_only'
    CHECK (sales_mode IN ('single_only','quote_only','single_or_quote','system_only')),
  ADD COLUMN IF NOT EXISTS pricing_visibility_mode  TEXT DEFAULT 'quote_required'
    CHECK (pricing_visibility_mode IN ('hidden','from_price','exact_price','quote_required')),
  ADD COLUMN IF NOT EXISTS minimum_order_type       TEXT DEFAULT 'm2'
    CHECK (minimum_order_type IN ('none','m2','package','pallet','quantity')),
  ADD COLUMN IF NOT EXISTS minimum_order_value      NUMERIC,
  ADD COLUMN IF NOT EXISTS requires_city_for_pricing BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS requires_system_context  BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS recommended_bundle_family TEXT,
  ADD COLUMN IF NOT EXISTS catalog_description      TEXT,
  ADD COLUMN IF NOT EXISTS meta_title               TEXT,
  ADD COLUMN IF NOT EXISTS meta_description         TEXT;

-- ─── accessories tablosu ────────────────────────────────────

ALTER TABLE accessories
  ADD COLUMN IF NOT EXISTS slug                     TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS sales_mode               TEXT DEFAULT 'system_only'
    CHECK (sales_mode IN ('single_only','quote_only','single_or_quote','system_only')),
  ADD COLUMN IF NOT EXISTS pricing_visibility_mode  TEXT DEFAULT 'quote_required'
    CHECK (pricing_visibility_mode IN ('hidden','from_price','exact_price','quote_required')),
  ADD COLUMN IF NOT EXISTS minimum_order_type       TEXT DEFAULT 'none'
    CHECK (minimum_order_type IN ('none','m2','package','pallet','quantity')),
  ADD COLUMN IF NOT EXISTS minimum_order_value      NUMERIC,
  ADD COLUMN IF NOT EXISTS requires_system_context  BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS recommended_bundle_family TEXT;

-- ─── Notlar ─────────────────────────────────────────────────
-- slug kolonları NULL olarak bırakılır.
-- Slug üretimi lib/catalog/slug.ts fonksiyonu üzerinden yapılır
-- (SQL regex Türkçe karakterleri doğru işlemez).
-- Admin paneli veya tek seferlik script ile doldurulacak.
--
-- RLS: Bu kolonlar mevcut RLS policy'lerine tabi —
-- public read için ayrı policy gerekmez (plates/accessories
-- zaten public okunabilir).
