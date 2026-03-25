// ============================================================
// Karar Motoru — getDecisionContext()
// Pure function: server ve client'ta çalışır.
// ============================================================

import type {
  ProductRules,
  DecisionContext,
  CtaPrimary,
  CtaSecondary,
  WizardPrefill,
} from './types';

export function getDecisionContext(
  rules: ProductRules,
  prefill?: WizardPrefill | null
): DecisionContext {
  // pricing_visibility_mode = quote_required → tüm diğer kuralları override et
  if (rules.pricing_visibility_mode === 'quote_required') {
    return {
      cta_primary: 'teklif',
      cta_secondary: null,
      cta_label_primary: 'Teklif Al',
      cta_label_secondary: null,
      info_note: buildInfoNote(rules),
      price_note: 'Bu ürünün fiyatı teklif ile belirlenmektedir.',
      force_quote: true,
      wizard_target_step: prefill?.markaId ? 2 : 1,
    };
  }

  // price_note — pricing_visibility_mode bazlı
  const price_note = buildPriceNote(rules.pricing_visibility_mode);

  // CTA kararı: sales_mode × requires_city_for_pricing
  let cta_primary: CtaPrimary;
  let cta_secondary: CtaSecondary = null;
  let cta_label_primary: string;
  let cta_label_secondary: string | null = null;
  let wizard_target_step: 1 | 2 = 1;

  switch (rules.sales_mode) {
    case 'single_only':
      if (!rules.requires_city_for_pricing) {
        cta_primary = 'siparis';
        cta_label_primary = 'Hızlı Sipariş Talebi';
        wizard_target_step = 2;
      } else {
        cta_primary = 'hesapla';
        cta_label_primary = 'Şehir Seç ve Sipariş Ver';
        wizard_target_step = 1;
      }
      break;

    case 'single_or_quote':
      if (!rules.requires_city_for_pricing) {
        cta_primary = 'siparis';
        cta_label_primary = 'Sipariş Talebi Oluştur';
        cta_secondary = 'detayli_teklif';
        cta_label_secondary = 'Detaylı Teklif Al';
        wizard_target_step = 2;
      } else {
        cta_primary = 'hesapla';
        cta_label_primary = 'Fiyat Hesapla';
        cta_secondary = 'detayli_teklif';
        cta_label_secondary = 'Teklif Al';
        wizard_target_step = 1;
      }
      break;

    case 'system_only':
      cta_primary = 'sistem_teklifi';
      cta_label_primary = 'Sistem Teklifi Oluştur';
      wizard_target_step = 1;
      break;

    case 'quote_only':
    default:
      cta_primary = 'teklif';
      cta_label_primary = 'Teklif Al';
      wizard_target_step = prefill?.markaId ? 2 : 1;
      break;
  }

  // hidden fiyat → CTA'yı override et (ama force_quote değil)
  if (rules.pricing_visibility_mode === 'hidden' && cta_primary === 'siparis') {
    cta_primary = 'fiyat_teklifi';
    cta_label_primary = 'Fiyat İçin Teklif Alın';
  }

  return {
    cta_primary,
    cta_secondary,
    cta_label_primary,
    cta_label_secondary,
    info_note: buildInfoNote(rules),
    price_note,
    force_quote: false,
    wizard_target_step,
  };
}

// ─── Yardımcı fonksiyonlar ───────────────────────────────────

function buildPriceNote(mode: ProductRules['pricing_visibility_mode']): string | null {
  switch (mode) {
    case 'hidden':
      return 'Bu ürünün fiyatı görüntülenmemektedir.';
    case 'from_price':
      return 'Gösterilen fiyat başlangıç fiyatıdır; kalınlık ve miktara göre değişir.';
    case 'quote_required':
      return 'Bu ürünün fiyatı teklif ile belirlenmektedir.';
    case 'exact_price':
    default:
      return null;
  }
}

function buildInfoNote(rules: ProductRules): string | null {
  const notes: string[] = [];

  if (rules.minimum_order_type !== 'none' && rules.minimum_order_value !== null) {
    const unitMap: Record<string, string> = {
      m2: 'm²', package: 'paket', pallet: 'palet', quantity: 'adet',
    };
    const unit = unitMap[rules.minimum_order_type] ?? rules.minimum_order_type;
    notes.push(`Bu ürün minimum ${rules.minimum_order_value} ${unit} için sunulur.`);
  }

  if (rules.requires_city_for_pricing) {
    notes.push('Fiyat şehre göre farklılık gösterir.');
  }

  if (rules.requires_system_context) {
    notes.push('Bu ürün genellikle sistem içinde kullanılır.');
  }

  return notes.length > 0 ? notes.join(' ') : null;
}
