// Wizard akış GA4 event'leri.
// 3 adımlı funnel:
//   1. Fiyat_Gosterildi      → kullanıcı fiyat ekranına ulaştı
//   2. Pdf_Teklif_Talebi     → PDF teklif formu submit (server-side quote insert da olur)
//   3. Whatsapp_Siparis      → WhatsApp sipariş akışı tamamlandı (server-side quote insert da olur)
//
// Conversion = (Pdf_Teklif_Talebi + Whatsapp_Siparis) / Fiyat_Gosterildi
// Abandoned  = Fiyat_Gosterildi olup 2 ve 3'ü tetiklemeyenler
//
// CallMeBot bildirimi GA4'ten BAĞIMSIZ çalışır — server-side quote insert
// sonrası /api/quotes route'unda sendNotification() çağrılır. Buradaki
// gtag çağrıları sadece GA4 client-side event'lerini yollar; CallMeBot
// üzerinde çift bildirim üretmez.

const GA_EVENT_SHOW_PRICES = 'Fiyat_Gosterildi';
const GA_EVENT_PDF_QUOTE   = 'Pdf_Teklif_Talebi';
const GA_EVENT_WHATSAPP    = 'Whatsapp_Siparis';

// ─── Ortak event params (3 event aynı taksonomiye sahip) ─────────────
export interface WizardBasePayload {
  material_type: 'tasyunu' | 'eps' | string;
  brand_name: string;
  model_name?: string | null;
  thickness_cm: number;
  city_code: number;
  city_name: string;
  area_m2: number;
  total_m2?: number;
  package_count?: number;
}

// 1) Fiyat_Gosterildi
export interface WizardShowPricesPayload extends WizardBasePayload {
  results_count?: number;
  cheapest_total?: number | null;
  cheapest_per_m2?: number | null;
  special_order_required?: boolean;
}

// 2) Pdf_Teklif_Talebi
export interface PdfQuoteRequestedPayload extends WizardBasePayload {
  /** "Orijinal Sistem" / "Dengeli Sistem" / "Ekonomik Sistem" */
  selected_package_name: string;
  /** Müşterinin seçtiği paketin toplam fiyatı (KDV dahil ₺) */
  selected_package_total: number;
  /** ₺/m² */
  selected_per_m2: number;
  /** Quote DB referans kodu (TY1234567) */
  ref_code: string;
  /** Customer kanal (kullanıcının formdaki firma adı varsa "company" yoksa "individual") */
  customer_type?: 'company' | 'individual';
}

// 3) Whatsapp_Siparis (form submit + WA pencere açıldı)
export interface WhatsappOrderRequestedPayload extends WizardBasePayload {
  selected_package_name: string;
  selected_package_total: number;
  selected_per_m2: number;
  ref_code: string;
}

type GtagWindow = Window & {
  gtag?: (
    command: 'event',
    eventName: string,
    eventParams: Record<string, unknown>
  ) => void;
};

function emit(eventName: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as GtagWindow;
  if (typeof w.gtag !== 'function') return;
  w.gtag('event', eventName, {
    ...params,
    page_path: window.location.pathname,
  });
}

// ─── 1. Fiyatları Göster ──────────────────────────────────────────────
export function notifyWizardShowPrices(p: WizardShowPricesPayload): void {
  emit(GA_EVENT_SHOW_PRICES, {
    material_type:           p.material_type,
    brand_name:              p.brand_name,
    model_name:              p.model_name ?? null,
    thickness_cm:            p.thickness_cm,
    city_code:               p.city_code,
    city_name:               p.city_name,
    area_m2:                 p.area_m2,
    total_m2:                p.total_m2 ?? null,
    package_count:           p.package_count ?? null,
    results_count:           p.results_count ?? null,
    cheapest_total:          p.cheapest_total ?? null,
    cheapest_per_m2:         p.cheapest_per_m2 ?? null,
    special_order_required:  p.special_order_required ?? false,
  });
}

// ─── 2. PDF Teklif Talebi ────────────────────────────────────────────
export function notifyPdfQuoteRequested(p: PdfQuoteRequestedPayload): void {
  emit(GA_EVENT_PDF_QUOTE, {
    material_type:           p.material_type,
    brand_name:              p.brand_name,
    model_name:              p.model_name ?? null,
    thickness_cm:            p.thickness_cm,
    city_code:               p.city_code,
    city_name:               p.city_name,
    area_m2:                 p.area_m2,
    total_m2:                p.total_m2 ?? null,
    package_count:           p.package_count ?? null,
    selected_package_name:   p.selected_package_name,
    selected_package_total:  p.selected_package_total,
    selected_per_m2:         p.selected_per_m2,
    ref_code:                p.ref_code,
    customer_type:           p.customer_type ?? 'individual',
  });
}

// ─── 3. WhatsApp Sipariş Talebi ──────────────────────────────────────
export function notifyWhatsappOrderRequested(p: WhatsappOrderRequestedPayload): void {
  emit(GA_EVENT_WHATSAPP, {
    material_type:           p.material_type,
    brand_name:              p.brand_name,
    model_name:              p.model_name ?? null,
    thickness_cm:            p.thickness_cm,
    city_code:               p.city_code,
    city_name:               p.city_name,
    area_m2:                 p.area_m2,
    total_m2:                p.total_m2 ?? null,
    package_count:           p.package_count ?? null,
    selected_package_name:   p.selected_package_name,
    selected_package_total:  p.selected_package_total,
    selected_per_m2:         p.selected_per_m2,
    ref_code:                p.ref_code,
  });
}

// ─── 4. Situation Selected (Sprint 2 — Karar Yardımı) ────────────────
const GA_EVENT_SITUATION_SELECTED = 'Situation_Selected';

export type SituationKey =
  | 'isi_yalitimi'
  | 'ses_yalitimi'
  | 'cati_yalitimi'
  | 'emin_degilim';

export interface SituationSelectedPayload {
  situationKey: SituationKey;
  situationLabel: string;
}

export function notifySituationSelected(p: SituationSelectedPayload): void {
  emit(GA_EVENT_SITUATION_SELECTED, {
    situation_key:   p.situationKey,
    situation_label: p.situationLabel,
  });
}
