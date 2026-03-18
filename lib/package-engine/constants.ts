/**
 * lib/package-engine/constants.ts
 *
 * MVP fazında kod sabiti olan değerler.
 * Admin configurability bölümüne göre:
 *   - KDV oranı → sabit (%20), yasa değişirse burada güncellenir
 *   - Low-metrage eşikleri → sabit, ileride DB'ye taşınabilir
 *   - TIER_CONFIG (başlık/badge/rationale) → sabit, ileride CMS'e taşınabilir
 *   - REQUIRED_SLOTS → sistem kuralı, sabit
 */

import type { PackageSlot, QualityBand } from '@/lib/types';

// ==========================================
// VERGI / FİYATLANDIRMA
// ==========================================

/** %20 KDV oranı — Türkiye inşaat malzemeleri */
export const KDV_RATE = 0.20;

// ==========================================
// LOJİSTİK / METRAj EŞİKLERİ
// ==========================================

/**
 * Taşyünü düşük metraj eşiği.
 * Bu metrajın altında TIR ekonomisi çalışmaz → nakliye hariç uyarısı.
 * Değer yaklaşık bir kamyon dolum eşiğidir; lojistik tablosuyla çapraz kontrol edilmeli.
 */
export const TASYUNU_LOW_METRAGE_M2 = 200;

/** EPS düşük metraj eşiği */
export const EPS_LOW_METRAGE_M2 = 100;

/**
 * TIR doluluk eşiği (%86).
 * Bu oranın üzerinde → TIR tam dolu sayılır, discount_tir uygulanır.
 * Mevcut getTruckMeterColor fonksiyonuyla tutarlı.
 */
export const TIR_FILL_THRESHOLD_PCT = 86;

/**
 * Kamyon doluluk alt eşiği (%41).
 * Bu oranın altı → verimsiz / 'none' zone.
 */
export const LORRY_FILL_FLOOR_PCT = 41;

// ==========================================
// TİER KONFİGÜRASYONU
// ==========================================

/**
 * MVP: Kod sabiti. Ileride admin panelden yönetilebilir hale gelmesi için
 * DB'ye taşımak yerine burada merkezileştiriyoruz.
 *
 * isRecommended: yalnızca 'balanced' true — frontend varsayılan seçimi.
 */
export const TIER_CONFIG: Record<
    Exclude<QualityBand, 'special'>,
    {
        title:         string;
        badge:         string | null;
        isRecommended: boolean;
        rationale:     string;
    }
> = {
    premium: {
        title:         'Premium Sistem',
        badge:         'En İyi Sistem',
        isRecommended: false,
        rationale:     'Aynı marka sistem bütünlüğü. En yüksek performans ve uzun vadeli garanti.',
    },
    balanced: {
        title:         'Dengeli Sistem',
        badge:         'Önerilen',
        isRecommended: true,
        rationale:     'En iyi fiyat/performans dengesi. Onaylı marka kombinasyonu.',
    },
    economic: {
        title:         'Ekonomik Sistem',
        badge:         null,
        isRecommended: false,
        rationale:     'Minimum maliyet. Onaylı ekonomik tedarikçilerden oluşur.',
    },
};

// ==========================================
// PAKET SLOTLARI
// ==========================================

/**
 * 8 zorunlu slot — hepsi dolu olmadan paket üretilemez.
 * Sıralama: PDF ve UI satır sıralamasını belirler.
 */
export const REQUIRED_SLOTS: ReadonlyArray<PackageSlot> = [
    'plate',
    'adhesive',
    'render',
    'dowel',
    'mesh',
    'corner',
    'primer',
    'coating',
] as const;

/**
 * Wizard akışında üretilen tier'lar.
 * 'special' tier ayrı bir sipariş akışına aittir, buraya dahil edilmez.
 */
export const WIZARD_TIERS: ReadonlyArray<Exclude<QualityBand, 'special'>> = [
    'premium',
    'balanced',
    'economic',
] as const;
