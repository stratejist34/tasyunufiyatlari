export interface CombinationMetrics {
  // Levha marka dağılımı — son 7 gün (count + m² + ₺)
  eps_brands_7d:      { brand: string; count: number; area_m2: number; amount: number }[]
  rockwool_brands_7d: { brand: string; count: number; area_m2: number; amount: number }[]
  // Toz grubu marka dağılımı — son 7 gün (count + m² + ₺)
  powder_brands_7d:   { brand: string; count: number; area_m2: number; amount: number }[]
  // Çapraz kombinasyon — son 7 gün (material field ile EPS/Taşyünü ayrılabilir)
  // model = '—' eğer model_name null ise (SQL seviyesinde handle edilir)
  top_cross_combinations_7d: {
    plate_brand: string
    model: string
    powder_brand: string
    material: 'eps' | 'tasyunu'
    count: number
    area_m2: number
    amount: number
  }[]
  computed_at: string
}
