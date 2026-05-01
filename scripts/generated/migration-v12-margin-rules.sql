-- ============================================================
-- Migration v12: material_types — Marj Kuralları + Tam-Araç Kuralı
--
-- Anasayfa mantolama wizard'ı için:
--  • EPS: katmanlı kâr marjı (200/500/1000 m² eşikleri ile %35 / %23 / %10)
--  • Taşyünü: tam Kamyon / TIR / kombinasyonları dışında metraj kabul edilmez
--  • ≥10.000 m² için "özel teklif" notu (UI rozeti + PDF)
-- Plan: C:\Users\Emrah\.claude\plans\bu-ikiside-anasayfadaki-manotlama-dreamy-aurora.md
-- ============================================================

ALTER TABLE material_types
  ADD COLUMN IF NOT EXISTS min_order_m2 INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tier1_max_m2 INTEGER,
  ADD COLUMN IF NOT EXISTS tier1_margin_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS tier2_max_m2 INTEGER,
  ADD COLUMN IF NOT EXISTS tier2_margin_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS tier3_margin_pct NUMERIC(5,2) DEFAULT 10,
  ADD COLUMN IF NOT EXISTS full_vehicle_only BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS special_order_threshold_m2 INTEGER,
  ADD COLUMN IF NOT EXISTS special_order_note TEXT;

-- ─── EPS seed (katmanlı marj, parsiyel açık) ─────────────────────
UPDATE material_types
SET
  min_order_m2               = 200,
  tier1_max_m2               = 500,
  tier1_margin_pct           = 35,
  tier2_max_m2               = 1000,
  tier2_margin_pct           = 23,
  tier3_margin_pct           = 10,
  full_vehicle_only          = FALSE,
  special_order_threshold_m2 = NULL,
  special_order_note         = NULL
WHERE slug = 'eps';

-- ─── Taşyünü seed (tam-araç zorunlu, sabit marj) ─────────────────
UPDATE material_types
SET
  min_order_m2               = 0,
  tier1_max_m2               = NULL,
  tier1_margin_pct           = NULL,
  tier2_max_m2               = NULL,
  tier2_margin_pct           = NULL,
  tier3_margin_pct           = 10,
  full_vehicle_only          = TRUE,
  special_order_threshold_m2 = 10000,
  special_order_note         = '10.000 m² ve üzeri siparişler için fabrikadan termin, nakliye operasyonu ve nihai fiyat içeren özel teklif hazırlanır. Sistem fiyatını referans olarak görebilir, anında teklif alabilirsiniz; ekibimiz fabrika onaylı teklifi 24 saat içinde iletir.'
WHERE slug = 'tasyunu';
