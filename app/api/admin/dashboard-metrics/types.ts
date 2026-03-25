export interface DashboardMetrics {
  // Günlük KPI — hepsi aynı Istanbul day_start sınırından
  daily_total: number
  daily_pending_count: number
  daily_quoted_count: number
  avg_price_per_m2_today: number | null  // null = bugün henüz fiyatlı teklif yok; UI '—' gösterir
  daily_pdf_count: number
  daily_whatsapp_count: number
  // Velocity — 2 saatlik kayan pencere
  recent_2h: number
  prev_2h: number
  velocity_ratio: number | null          // null = prev_2h sıfır
  velocity_trend: 'up' | 'down' | 'stable'
  // Malzeme mix — son 30 gün
  eps_count_30d: number
  rockwool_count_30d: number
  eps_ratio_30d: number                  // yüzde, 0–100
  rockwool_ratio_30d: number
  eps_area_m2_30d: number               // toplam talep edilen m² (EPS)
  rockwool_area_m2_30d: number          // toplam talep edilen m² (Taşyünü)
  eps_amount_30d: number                // toplam teklif tutarı ₺ (EPS)
  rockwool_amount_30d: number           // toplam teklif tutarı ₺ (Taşyünü)
  // Zaman penceresi KPI
  today_amount: number          // bugün toplam teklif tutarı ₺
  today_area_m2: number         // bugün toplam m²
  week_count: number            // son 7 gün teklif sayısı
  week_amount: number           // son 7 gün toplam ₺
  week_area_m2: number          // son 7 gün toplam m²
  month_count: number           // son 30 gün teklif sayısı
  month_amount: number          // son 30 gün toplam ₺
  month_area_m2: number         // son 30 gün toplam m²
  // Marka dağılımı — son 7 gün (brand_name = kullanıcı seçimi, insulation markası)
  eps_brands_7d: { brand: string; count: number }[]
  rockwool_brands_7d: { brand: string; count: number }[]
  // Ürün kırılımı — son 7 gün (brand + model + material_type; çapraz kombinasyon DEĞİL)
  product_breakdown_7d: {
    brand: string
    model: string          // nullable model_name için '—' gönderilir
    material: 'eps' | 'tasyunu'
    count: number
  }[]
  computed_at: string
}
