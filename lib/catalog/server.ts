// ============================================================
// Catalog Server-Side Data Fetching
// Server component'larda kullanılır — HTTP fetch değil, direkt Supabase.
// ============================================================

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { buildMinimumOrderLabel } from '@/lib/catalog/slug';
import { getDecisionContext } from '@/lib/catalog/decision';
import type {
  CatalogProductView,
  CatalogProductDetailResponse,
  CatalogProductsResponse,
  ProductRules,
  MinimumOrderSummary,
  WizardPrefill,
} from '@/lib/catalog/types';

const MATERIAL_IDS: Record<string, number> = { tasyunu: 2, eps: 1 };

// ─── Plates listesi ──────────────────────────────────────────

export async function getCatalogProducts(
  material: string
): Promise<CatalogProductsResponse> {
  const supabase = createServerSupabaseClient();

  if (material === 'aksesuar') {
    const { data, error } = await supabase
      .from('accessories')
      .select(`
        id, name, short_name, slug, base_price,
        sales_mode, pricing_visibility_mode,
        minimum_order_type, minimum_order_value,
        requires_system_context, recommended_bundle_family,
        catalog_description, image_cover,
        brands ( id, name, tier ),
        accessory_types ( id, name, slug )
      `)
      .eq('is_active', true)
      .not('slug', 'is', null)
      .neq('sales_mode', 'system_only');

    if (error) return { products: [], total: 0, filters_applied: { material } };

    const products: CatalogProductView[] = (data ?? []).map((row: any) => {
      const rules = buildAccessoryRules(row);
      const minimum_order = buildMinOrder(rules);
      const base_price = rules.pricing_visibility_mode === 'hidden' ? null : (row.base_price ?? null);
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        brand: { id: row.brands?.id ?? 0, name: row.brands?.name ?? '', tier: row.brands?.tier ?? '' },
        model: row.short_name ?? null,
        thickness_options: null,
        category: { slug: row.accessory_types?.slug ?? 'aksesuar', name: row.accessory_types?.name ?? 'Aksesuar' },
        material_type: 'aksesuar',
        product_type: 'accessory' as const,
        base_price,
        thickness_prices: null,
        rules,
        minimum_order,
        catalog_description: row.catalog_description ?? null,
        meta_title: null,
        meta_description: null,
        image_cover: row.image_cover ?? null,
        image_gallery: null,
        wizard_prefill: null,
        depot_stock:    null,
        depot_discount: null,
        depot_min_m2:   null,
      };
    });

    return { products, total: products.length, filters_applied: { material } };
  }

  // plates
  let query = supabase
    .from('plates')
    .select(`
      id, name, short_name, slug, base_price, discount_2,
      thickness_options, sales_mode, pricing_visibility_mode,
      minimum_order_type, minimum_order_value,
      requires_city_for_pricing, requires_system_context,
      recommended_bundle_family, catalog_description, meta_title, meta_description,
      image_cover, image_gallery,
      stock_tuzla, depot_discount, depot_min_m2,
      brands ( id, name, tier ),
      material_types ( id, name, slug ),
      plate_prices ( thickness, base_price, is_kdv_included, stock_tuzla )
    `)
    .eq('is_active', true)
    .not('slug', 'is', null);

  const materialId = MATERIAL_IDS[material];
  if (materialId) {
    query = query.eq('material_type_id', materialId);
  }

  const { data, error } = await query;
  if (error) return { products: [], total: 0, filters_applied: { material } };

  const products: CatalogProductView[] = (data ?? []).map((row: any) =>
    buildPlateView(row)
  );

  return { products, total: products.length, filters_applied: { material } };
}

// ─── Tekil ürün detayı ───────────────────────────────────────

export async function getCatalogProduct(
  slug: string,
  kategori?: string
): Promise<CatalogProductDetailResponse | null> {
  const supabase = createServerSupabaseClient();

  const skipPlates      = kategori === 'aksesuar';
  const skipAccessories = kategori === 'tasyunu' || kategori === 'eps';

  // Plates sorgusu (aksesuar kategorisinde atla)
  if (!skipPlates) {
  const { data: plateRow } = await supabase
    .from('plates')
    .select(`
      id, name, short_name, slug, base_price, discount_2,
      thickness_options, sales_mode, pricing_visibility_mode,
      minimum_order_type, minimum_order_value,
      requires_city_for_pricing, requires_system_context,
      recommended_bundle_family, catalog_description, meta_title, meta_description,
      image_cover, image_gallery,
      stock_tuzla, depot_discount, depot_min_m2,
      brands ( id, name, tier ),
      material_types ( id, name, slug ),
      plate_prices ( thickness, base_price, is_kdv_included, stock_tuzla )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (plateRow) {
    const product = buildPlateView(plateRow as any);
    const decision = getDecisionContext(product.rules, product.wizard_prefill ?? undefined);
    return { product, decision };
  }
  }

  // Accessories sorgusu (tasyunu/eps kategorisinde atla)
  if (!skipAccessories) {
  const { data: accRow } = await supabase
    .from('accessories')
    .select(`
      id, name, short_name, slug, base_price,
      sales_mode, pricing_visibility_mode,
      minimum_order_type, minimum_order_value,
      requires_system_context, recommended_bundle_family,
      catalog_description, image_cover,
      brands ( id, name, tier ),
      accessory_types ( id, name, slug )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (accRow) {
  const row = accRow as any;
  const brand = row.brands ?? {};
  const accType = row.accessory_types ?? {};
  const rules = buildAccessoryRules(row);
  const minimum_order = buildMinOrder(rules);
  const base_price = rules.pricing_visibility_mode === 'hidden' ? null : (row.base_price ?? null);

  const product: CatalogProductView = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: { id: brand.id ?? 0, name: brand.name ?? '', tier: brand.tier ?? '' },
    model: row.short_name ?? null,
    thickness_options: null,
    category: { slug: accType.slug ?? 'aksesuar', name: accType.name ?? 'Aksesuar' },
    material_type: 'aksesuar',
    product_type: 'accessory',
    base_price,
    thickness_prices: null,
    rules,
    minimum_order,
    catalog_description: row.catalog_description ?? null,
    meta_title: null,
    meta_description: null,
    image_cover: row.image_cover ?? null,
    image_gallery: null,
    wizard_prefill: null,
    depot_stock:    null,
    depot_discount: null,
    depot_min_m2:   null,
  };

  const decision = getDecisionContext(rules, null);
  return { product, decision };
  }
  }

  return null;
}

// ─── Yardımcılar ─────────────────────────────────────────────

function buildPlateView(row: any): CatalogProductView {
  const brand = row.brands ?? {};
  const materialType = row.material_types ?? {};

  const rules: ProductRules = {
    sales_mode:               row.sales_mode               ?? 'quote_only',
    pricing_visibility_mode:  row.pricing_visibility_mode  ?? 'quote_required',
    minimum_order_type:       row.minimum_order_type       ?? 'm2',
    minimum_order_value:      row.minimum_order_value      ?? null,
    requires_city_for_pricing: row.requires_city_for_pricing ?? true,
    requires_system_context:  row.requires_system_context  ?? false,
    recommended_bundle_family: row.recommended_bundle_family ?? null,
  };

  const minimum_order = buildMinOrder(rules);
  const base_price = rules.pricing_visibility_mode === 'hidden' ? null : (row.base_price ?? null);

  // thickness_prices: plate_prices'tan tam fiyat tablosu
  type PriceRow = { thickness: number; base_price: number; is_kdv_included: boolean; discount_2: number; stock_tuzla: number };
  const plateLevelDiscount2: number = row.discount_2 ?? 8;
  const thickness_prices: PriceRow[] | null = (() => {
    if (!Array.isArray(row.plate_prices) || row.plate_prices.length === 0) return null;
    const rows = (row.plate_prices as any[])
      .filter(p => p.thickness != null && p.base_price != null)
      .map(p => ({
        thickness:       p.thickness       as number,
        base_price:      parseFloat(p.base_price),
        is_kdv_included: p.is_kdv_included ?? false,
        discount_2:      p.discount_2 ?? plateLevelDiscount2,
        stock_tuzla:     (p.stock_tuzla as number) ?? 0,
      }))
      .sort((a, b) => a.thickness - b.thickness);
    return rows.length > 0 ? rows : null;
  })();

  // thickness_options: plate_prices'tan türet (her zaman güncel), fallback: statik dizi
  const derivedThicknesses: number[] | null = (() => {
    if (thickness_prices && thickness_prices.length > 0) {
      return thickness_prices.map(p => p.thickness);
    }
    if (Array.isArray(row.thickness_options) && row.thickness_options.length > 0) {
      return row.thickness_options as number[];
    }
    return null;
  })();

  const dominantThickness = derivedThicknesses ? derivedThicknesses[0] : null;

  const wizard_prefill: WizardPrefill = {
    levhaTipi: (materialType.slug as 'tasyunu' | 'eps') ?? null,
    markaId:   brand.id   ?? null,
    markaAdi:  brand.name ?? null,
    modelId:   row.id,
    modelAdi:  row.short_name ?? row.name,
    kalinlik:  dominantThickness,
  };

  return {
    id:   row.id,
    slug: row.slug,
    name: row.name,
    brand: { id: brand.id ?? 0, name: brand.name ?? '', tier: brand.tier ?? '' },
    model:             row.short_name ?? null,
    thickness_options: derivedThicknesses,
    category: { slug: materialType.slug ?? '', name: materialType.name ?? '' },
    material_type: materialType.slug ?? '',
    product_type:  'plate',
    base_price,
    thickness_prices,
    rules,
    minimum_order,
    catalog_description: row.catalog_description ?? null,
    meta_title:          row.meta_title          ?? null,
    meta_description:    row.meta_description    ?? null,
    image_cover:         row.image_cover         ?? null,
    image_gallery:       row.image_gallery       ?? null,
    wizard_prefill,
    depot_stock:    thickness_prices
      ? thickness_prices.reduce((sum, p) => sum + (p.stock_tuzla ?? 0), 0)
      : 0,
    depot_discount: row.depot_discount ?? 0,
    depot_min_m2:   row.depot_min_m2   ?? 300,
  };
}

function buildAccessoryRules(row: any): ProductRules {
  return {
    sales_mode:               row.sales_mode               ?? 'single_or_quote',
    pricing_visibility_mode:  row.pricing_visibility_mode  ?? 'quote_required',
    minimum_order_type:       row.minimum_order_type       ?? 'none',
    minimum_order_value:      row.minimum_order_value      ?? null,
    requires_city_for_pricing: false,
    requires_system_context:  row.requires_system_context  ?? false,
    recommended_bundle_family: row.recommended_bundle_family ?? null,
  };
}

function buildMinOrder(rules: ProductRules): MinimumOrderSummary {
  return {
    has_minimum: rules.minimum_order_type !== 'none',
    label: buildMinimumOrderLabel(rules.minimum_order_type, rules.minimum_order_value),
  };
}
