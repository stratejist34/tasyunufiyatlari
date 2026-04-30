// WhatsApp tıklama kaynak taksonomisi.
// Backend bildirimi + GA4 event'leri için TEK kaynak;
// `source` değeri her iki sistemde de aynı string ile akar.

export type WhatsappSource =
  | 'header_mobile'       // SiteHeader mobile drawer WA butonu
  | 'footer_link'         // SiteFooter "WhatsApp Destek" link
  | 'iletisim_card'       // /iletisim sayfası WhatsApp kartı
  | 'depomuz_cta'         // /depomuz "WhatsApp ile yazışın"
  | 'product_detail_cta'  // ürün detay sayfası WhatsApp CTA
  | 'site_general';       // fallback / belirsiz

export interface WhatsappIntentPayload {
  /** Hangi UI bileşeninden tıklandı */
  source: WhatsappSource;
  /** İlgili ürün/paket (opsiyonel) */
  productName?: string;
  /** İlgili sayfanın yolu (otomatik doldurulur) */
  page?: string;
}

// Source → Türkçe okunaklı etiket (bildirim mesajında görünür)
export const WHATSAPP_SOURCE_LABEL: Record<WhatsappSource, string> = {
  header_mobile:      'Mobil menü',
  footer_link:        'Footer linki',
  iletisim_card:      'İletişim sayfası kartı',
  depomuz_cta:        'Depomuz sayfası',
  product_detail_cta: 'Ürün detay sayfası',
  site_general:       'Site geneli',
};
