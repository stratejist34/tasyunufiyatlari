import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { buildMinimumOrderLabel } from '@/lib/catalog/slug';
import { getDecisionContext } from '@/lib/catalog/decision';
import type {
  CatalogProductView,
  CatalogProductDetailResponse,
  ProductRules,
  MinimumOrderSummary,
  WizardPrefill,
} from '@/lib/catalog/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();

  const { data: row, error } = await supabase
    .from('plates')
    .select(`
      id, name, short_name, slug, base_price,
      thickness_options, sales_mode, pricing_visibility_mode,
      minimum_order_type, minimum_order_value,
      requires_city_for_pricing, requires_system_context,
      recommended_bundle_family,
      catalog_description, meta_title, meta_description,
      brands ( id, name, tier ),
      material_types ( id, name, slug )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  // plates'de bulunamazsa accessories'e bak
  if (error || !row) {
    const { data: accRow, error: accError } = await supabase
      .from('accessories')
      .select(`
        id, name, short_name, slug, base_price,
        sales_mode, pricing_visibility_mode,
        minimum_order_type, minimum_order_value,
        requires_system_context, recommended_bundle_family,
        catalog_description,
        brands ( id, name, tier ),
        accessory_types ( id, name, slug )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (accError || !accRow) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const brand = (accRow.brands as any) ?? {};
    const accType = (accRow.accessory_types as any) ?? {};
    const rules: ProductRules = {
      sales_mode:               (accRow as any).sales_mode               ?? 'single_or_quote',
      pricing_visibility_mode:  (accRow as any).pricing_visibility_mode  ?? 'quote_required',
      minimum_order_type:       (accRow as any).minimum_order_type       ?? 'none',
      minimum_order_value:      (accRow as any).minimum_order_value      ?? null,
      requires_city_for_pricing: false,
      requires_system_context:  (accRow as any).requires_system_context  ?? false,
      recommended_bundle_family: (accRow as any).recommended_bundle_family ?? null,
    };
    const minimum_order: MinimumOrderSummary = {
      has_minimum: rules.minimum_order_type !== 'none',
      label: buildMinimumOrderLabel(rules.minimum_order_type, rules.minimum_order_value),
    };
    const base_price = rules.pricing_visibility_mode === 'hidden' ? null : (accRow.base_price ?? null);
    const product: CatalogProductView = {
      id:   accRow.id,
      slug: accRow.slug,
      name: accRow.name,
      brand: { id: brand.id ?? 0, name: brand.name ?? '', tier: brand.tier ?? '' },
      model: accRow.short_name ?? null,
      thickness_options: null,
      category: { slug: accType.slug ?? 'aksesuar', name: accType.name ?? 'Aksesuar' },
      material_type: 'aksesuar',
      product_type: 'accessory',
      base_price,
      thickness_prices: null,
      rules,
      minimum_order,
      catalog_description: (accRow as any).catalog_description ?? null,
      meta_title:   null,
      meta_description: null,
      image_cover:    null,
      image_gallery:  null,
      wizard_prefill: null,
      depot_stock:    null,
      depot_discount: null,
      depot_min_m2:   null,
    };
    const decision = getDecisionContext(rules, null);
    return NextResponse.json({ product, decision } as CatalogProductDetailResponse);
  }

  // Supabase joined relations are typed as arrays but are actually objects
  const brand = (row.brands as any) ?? {};
  const materialType = (row.material_types as any) ?? {};

  const rules: ProductRules = {
    sales_mode:               (row as any).sales_mode               ?? 'quote_only',
    pricing_visibility_mode:  (row as any).pricing_visibility_mode  ?? 'quote_required',
    minimum_order_type:       (row as any).minimum_order_type       ?? 'm2',
    minimum_order_value:      (row as any).minimum_order_value      ?? null,
    requires_city_for_pricing: (row as any).requires_city_for_pricing ?? true,
    requires_system_context:  (row as any).requires_system_context  ?? false,
    recommended_bundle_family: (row as any).recommended_bundle_family ?? null,
  };

  const minimum_order: MinimumOrderSummary = {
    has_minimum: rules.minimum_order_type !== 'none',
    label: buildMinimumOrderLabel(rules.minimum_order_type, rules.minimum_order_value),
  };

  const base_price =
    rules.pricing_visibility_mode === 'hidden' ? null : (row.base_price ?? null);

  const dominantThickness =
    Array.isArray(row.thickness_options) && row.thickness_options.length > 0
      ? row.thickness_options[0]
      : null;

  const wizard_prefill: WizardPrefill = {
    levhaTipi: (materialType.slug as 'tasyunu' | 'eps') ?? null,
    markaId:   brand.id   ?? null,
    markaAdi:  brand.name ?? null,
    modelId:   row.id,
    modelAdi:  row.short_name ?? row.name,
    kalinlik:  dominantThickness,
  };

  const product: CatalogProductView = {
    id:   row.id,
    slug: row.slug,
    name: row.name,
    brand: {
      id:   brand.id   ?? 0,
      name: brand.name ?? '',
      tier: brand.tier ?? '',
    },
    model:             row.short_name ?? null,
    thickness_options: row.thickness_options ?? null,
    category: {
      slug: materialType.slug ?? '',
      name: materialType.name ?? '',
    },
    material_type: materialType.slug ?? '',
    product_type:  'plate',
    base_price,
    thickness_prices: null,
    rules,
    minimum_order,
    catalog_description: (row as any).catalog_description ?? null,
    meta_title:          (row as any).meta_title          ?? null,
    meta_description:    (row as any).meta_description    ?? null,
    image_cover:         (row as any).image_cover         ?? null,
    image_gallery:       (row as any).image_gallery       ?? null,
    wizard_prefill,
    depot_stock:    (row as any).stock_tuzla    ?? 0,
    depot_discount: (row as any).depot_discount ?? 0,
    depot_min_m2:   (row as any).depot_min_m2   ?? 300,
  };

  const decision = getDecisionContext(rules, wizard_prefill);
  const response: CatalogProductDetailResponse = { product, decision };
  return NextResponse.json(response);
}
