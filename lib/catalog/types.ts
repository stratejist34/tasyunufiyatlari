// ============================================================
// Catalog Product Rules — Tip Tanımları
// ============================================================

export type SalesMode =
  | 'single_only'     // Tek başına sipariş edilebilir
  | 'quote_only'      // Sadece teklif akışı
  | 'single_or_quote' // Her ikisi de mümkün
  | 'system_only';    // Sadece sistem/paket içinde

export type MinimumOrderType = 'none' | 'm2' | 'package' | 'pallet' | 'quantity';

export type PricingVisibilityMode =
  | 'hidden'         // Fiyat hiç gösterilmez
  | 'from_price'     // "X TL'den başlayan"
  | 'exact_price'    // Gerçek fiyat + KDV
  | 'quote_required'; // "Teklif ile belirlenir"

// ─── Ürün kural seti ─────────────────────────────────────────

export interface ProductRules {
  sales_mode: SalesMode;
  pricing_visibility_mode: PricingVisibilityMode;
  minimum_order_type: MinimumOrderType;
  minimum_order_value: number | null;
  requires_city_for_pricing: boolean;
  requires_system_context: boolean;
  recommended_bundle_family: string | null;
}

// ─── Minimum sipariş özeti (UI için) ────────────────────────

export interface MinimumOrderSummary {
  has_minimum: boolean;
  label: string | null; // "minimum 40 m²" | "minimum 1 palet" | null
}

// ─── Wizard pre-fill verisi ──────────────────────────────────

export interface WizardPrefill {
  levhaTipi: 'tasyunu' | 'eps' | null;
  markaId: number | null;
  markaAdi: string | null;
  modelId: number | null;
  modelAdi: string | null;
  kalinlik: number | null; // default: en yaygın / küçük kalınlık
}

// ─── Frontend unified görünüm tipi ───────────────────────────
// plates ve accessories DB'de ayrı tablolar.
// Frontend bu tek tip üzerinden çalışır.

export interface CatalogProductView {
  id: number;
  slug: string;
  name: string;
  brand: {
    id: number;
    name: string;
    tier: string;
  };
  model: string | null;              // plate.short_name veya accessory.short_name
  thickness_options: number[] | null; // yalnızca plates
  category: {
    slug: string;
    name: string;
  };
  material_type: string;             // 'tasyunu' | 'eps' | accessory_type.slug
  product_type: 'plate' | 'accessory';
  base_price: number | null;         // pricing_visibility_mode='hidden' → null
  thickness_prices: Array<{ thickness: number; base_price: number; is_kdv_included: boolean; discount_2: number; stock_tuzla: number; package_m2: number | null }> | null;
  rules: ProductRules;
  minimum_order: MinimumOrderSummary;
  catalog_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  image_cover:   string | null;        // Supabase Storage URL (sadece plates)
  image_gallery: string[] | null;      // ek görseller (sadece plates)
  wizard_prefill: WizardPrefill | null; // sadece plates için dolu
  depot_stock:    number | null;        // tüm thickness_prices.stock_tuzla toplamı (0 = hiç stok yok)
  depot_discount: number | null;        // plates.depot_discount (%)
  depot_min_m2:   number | null;        // plates.depot_min_m2 (default 300)
}

// ─── Karar motoru çıktısı ────────────────────────────────────

export type CtaPrimary =
  | 'siparis'
  | 'teklif'
  | 'sistem_teklifi'
  | 'hesapla'
  | 'fiyat_teklifi';

export type CtaSecondary = 'detayli_teklif' | 'sistem_teklifine_ekle' | null;

export interface DecisionContext {
  cta_primary: CtaPrimary;
  cta_secondary: CtaSecondary;
  cta_label_primary: string;
  cta_label_secondary: string | null;
  info_note: string | null;    // min sipariş / şehir gereksinimi notu
  price_note: string | null;   // pricing_visibility_mode'dan gelen mesaj
  force_quote: boolean;        // quote_required → sales_mode görmezden gel
  wizard_target_step: 1 | 2;  // Wizard'ı hangi adımda açacak
}

// ─── API response şemaları ───────────────────────────────────

export interface CatalogProductsResponse {
  products: CatalogProductView[];
  total: number;
  filters_applied: Record<string, string>;
}

export interface CatalogProductDetailResponse {
  product: CatalogProductView;
  decision: DecisionContext;
}
