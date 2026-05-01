// Wizard tamamlama (Fiyatları Göster) GA4 event'i.
// Kullanıcı 4 step'i bitirip fiyat ekranına ulaştığında tetiklenir.
// PDF teklif veya WhatsApp sipariş talep etmeden ayrılan kullanıcıyı da
// görebilmek için bu adım ayrı bir event olarak izlenir.
//
// Event ismi: Fiyat_Gosterildi (Whatsapp_Yazanlar / Telefon_Aramalari ile paralel)
// CallMeBot bildirimi YOK (her wizard çalışması spam'e dönüşür); sadece GA4.

const GA_EVENT = 'Fiyat_Gosterildi';

export interface WizardShowPricesPayload {
  material_type: 'tasyunu' | 'eps' | string;
  brand_name: string;
  model_name?: string | null;
  thickness_cm: number;
  city_code: number;
  city_name: string;
  area_m2: number;          // kullanıcı girişi
  total_m2?: number;         // paket sayısına yuvarlanmış
  package_count?: number;    // ana levha paket adedi
  results_count?: number;    // hesaplanan paket sayısı (Ekonomik/Dengeli/Orijinal)
  cheapest_total?: number | null;   // en ucuz paketin grand total'ı
  cheapest_per_m2?: number | null;  // en ucuz m² fiyatı
  special_order_required?: boolean; // ≥10.000 m² özel teklif gerekli mi?
}

export function notifyWizardShowPrices(payload: WizardShowPricesPayload): void {
  if (typeof window === 'undefined') return;

  type GtagWindow = Window & {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams: Record<string, unknown>
    ) => void;
  };
  const w = window as GtagWindow;
  if (typeof w.gtag !== 'function') return;

  w.gtag('event', GA_EVENT, {
    material_type:           payload.material_type,
    brand_name:              payload.brand_name,
    model_name:              payload.model_name ?? null,
    thickness_cm:            payload.thickness_cm,
    city_code:               payload.city_code,
    city_name:               payload.city_name,
    area_m2:                 payload.area_m2,
    total_m2:                payload.total_m2 ?? null,
    package_count:           payload.package_count ?? null,
    results_count:           payload.results_count ?? null,
    cheapest_total:          payload.cheapest_total ?? null,
    cheapest_per_m2:         payload.cheapest_per_m2 ?? null,
    special_order_required:  payload.special_order_required ?? false,
    page_path:               window.location.pathname,
  });
}
