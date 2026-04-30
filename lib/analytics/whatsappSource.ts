// Kullanıcı niyet event'leri için kaynak (source) taksonomisi.
// Hem CallMeBot bildirimi hem GA4 event'leri aynı string ile akar.

// ─── WhatsApp tıklama kaynakları ─────────────────────────────────
export type WhatsappSource =
  | 'header_mobile'       // SiteHeader mobile drawer WA butonu
  | 'footer_link'         // SiteFooter "WhatsApp Destek" link
  | 'iletisim_card'       // /iletisim sayfası WhatsApp kartı
  | 'depomuz_cta'         // /depomuz "WhatsApp ile yazışın"
  | 'product_detail_cta'  // ürün detay sayfası WhatsApp CTA
  | 'site_general';       // fallback / belirsiz

// ─── Telefon tıklama kaynakları ──────────────────────────────────
export type PhoneSource =
  | 'header_mobile'       // SiteHeader mobile drawer "Ara" butonu
  | 'topbar_phone'        // hub TrustStrip telefon link
  | 'iletisim_phone'      // /iletisim telefon kartı / "Hemen Ara"
  | 'depomuz_phone'       // /depomuz telefon link
  | 'kvkk_phone'          // /kvkk başvuru kartı telefon
  | 'site_general';

export interface WhatsappIntentPayload {
  source: WhatsappSource;
  productName?: string;
  /** Otomatik doldurulur (window.location.pathname) */
  page?: string;
}

export interface PhoneCallPayload {
  source: PhoneSource;
  productName?: string;
  /** Otomatik doldurulur */
  page?: string;
}

// ─── İnsan-okur etiketler (CallMeBot mesajında ve GA4 dashboard'da) ─
export const WHATSAPP_SOURCE_LABEL: Record<WhatsappSource, string> = {
  header_mobile:      'Mobil menü',
  footer_link:        'Footer linki',
  iletisim_card:      'İletişim sayfası kartı',
  depomuz_cta:        'Depomuz sayfası',
  product_detail_cta: 'Ürün detay sayfası',
  site_general:       'Site geneli',
};

export const PHONE_SOURCE_LABEL: Record<PhoneSource, string> = {
  header_mobile:   'Mobil menü',
  topbar_phone:    'Üst şerit',
  iletisim_phone:  'İletişim sayfası',
  depomuz_phone:   'Depomuz sayfası',
  kvkk_phone:      'KVKK sayfası',
  site_general:    'Site geneli',
};

// ─── GA4 Event isimleri (Türkçe, anlaşılır) ──────────────────────
export const GA_EVENT_WHATSAPP = 'Whatsapp_Yazanlar';
export const GA_EVENT_PHONE    = 'Telefon_Aramalari';
