/**
 * Sunucu tarafı Excel/CSV parser → RawImportRow[]
 *
 * Tasarım prensibi: FORMAT DEĞİŞKENLİĞİNE DAYANIKLILIK
 *
 * Sütun ismi değişse, sütun yeri kaysa, yeni sütunlar eklense bile
 * doğru kolonu seçmeli.  Bunu sağlamak için:
 *
 *   1. Her sütun başlığına semantik bir ROL atanır (ColumnRole).
 *   2. Rol ataması birden fazla keyword katmanıyla yapılır:
 *      - FORBIDDEN listesi → hiç seçilmez (türetilmiş/m²/şehir vb.)
 *      - TIER-1 en kesin match (çok spesifik)
 *      - TIER-2 orta (kdv haric liste)
 *      - TIER-3 en geniş (kdv dahil herhangi liste)
 *   3. KDV durumu, sheet adından değil, seçilen fiyat sütunu başlığından çıkarılır.
 *   4. İSK sütunları, şehir/bölge iskonto sütunlarından ayrılır.
 *
 * Desteklenen formatlar (örnekler):
 *   - ARALIK 2025 "KALEM BAZINDA AMBALAJ..." — Col0=isim, Col1=KDV DAHİL LİSTE
 *   - 2026 ŞUBAT "EPS TOZ KALEM BAZLI..." — Col1=isim, Col7=AMBALAJ KDV HARİÇ LİSTE
 *   - EPS PAKET sheet — 26 boş sütun + sağda ürün bloğu
 *   - YÜKLEME sheet — lojistik veri, fiyat import için atlanır
 */

import * as XLSX from 'xlsx';
import type { RawImportRow, KdvHint } from './importTypes';

// ==========================================
// TYPES
// ==========================================

/**
 * Her sütunun semantik rolü.
 * 'skip' = kesinlikle alma (türetilmiş, geçmiş, şehir iskontosu vs.)
 */
type ColumnRole =
    | 'name'            // Ürün adı
    | 'price_net'       // KDV hariç liste fiyatı → base_price, kdv_haric
    | 'price_gross'     // KDV dahil liste fiyatı → base_price, kdv_dahil
    | 'isk'             // İskonto oranı (max 6 alınır)
    | 'package_qty'     // Ambalaj adedi (25 kg, 16 adet)
    | 'package_m2'      // Ambalaj m² alanı (sarfiyat değil, paket büyüklüğü)
    | 'consumption_m2'  // m² sarfiyat (aksesuar için)
    | 'skip';           // Türetilmiş, geçmiş dönem, şehir iskontosu, m² birim fiyatı

interface ColumnMap {
    name?:          number;
    priceNet?:      number;   // KDV hariç liste fiyatı
    priceGross?:    number;   // KDV dahil liste fiyatı
    isk:            number[]; // İSK1..İSK6 sırasıyla
    packageQty?:    number;
    packageM2?:     number;
    consumptionM2?: number;
    brand?:         number;
}

interface PriceCandidate {
    idx: number;
    score: number;
}

// ==========================================
// HEADER NORMALIZATION
// ==========================================

/**
 * Excel sütun başlığını karşılaştırma için normalize eder.
 * Satır içi newline (\n) → boşluk.
 * Türkçe karakterler → ASCII.
 * Küçük harf + trim.
 */
function normalizeHeader(s: unknown): string {
    return String(s ?? '')
        .replace(/\n/g, ' ')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i').replace(/ğ/g, 'g')
        .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u')
        .replace(/Ğ/g, 'g').replace(/Ş/g, 's').replace(/Ç/g, 'c').replace(/Ö/g, 'o').replace(/Ü/g, 'u')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function hasAnyKeyword(h: string, keywords: string[]): boolean {
    return keywords.some((kw) => h.includes(kw));
}

function isMonthPeriodHeader(h: string): boolean {
    return /\b\d{4}\s*-\s*\d{1,2}\b/.test(h) || /\b\d{1,2}\s*-\s*\d{4}\b/.test(h);
}

function isForbiddenPriceHeader(h: string): boolean {
    if (!h) return true;

    if (h.includes('iskontolu')) return true;
    if ((h.includes('tl') || h.includes('/')) && h.includes('m2') && (h.includes('kdv') || h.includes('fiyat'))) return true;
    if (h.startsWith('tl /m') || h.startsWith('tl/m')) return true;
    if (h.includes('fiyat fark')) return true;
    if (h === 'bolge' || h === 'il' || h.includes('plaka') || h.includes('istanbul')) return true;
    if (h.includes('optimix%') || h.includes('filli%') || (h.includes('iskonto') && !h.includes('kdv'))) return true;

    return false;
}

function isLikelyPriceHeader(h: string): boolean {
    if (!h || isForbiddenPriceHeader(h)) return false;

    if ((h.includes('haric') || h.includes('dahil')) && hasAnyKeyword(h, ['fiyat', 'liste', 'ambalaj', 'paket', 'bedel', 'tutar'])) {
        return true;
    }

    if ((h.includes('haric') || h.includes('dahil')) && isMonthPeriodHeader(h)) {
        return true;
    }

    return false;
}

function scorePriceHeader(h: string, kind: 'net' | 'gross'): number {
    if (!h || isForbiddenPriceHeader(h)) return Number.NEGATIVE_INFINITY;

    const wantsNet = kind === 'net';
    const hasTargetKdv = wantsNet ? h.includes('haric') : h.includes('dahil');
    const hasOppositeKdv = wantsNet ? h.includes('dahil') : h.includes('haric');

    if (!hasTargetKdv || hasOppositeKdv) return Number.NEGATIVE_INFINITY;

    let score = 0;

    if (h.includes('kdv')) score += 5;
    if (h.includes('liste')) score += 5;
    if (h.includes('fiyat')) score += 5;
    if (h.includes('ambalaj')) score += 4;
    if (h.includes('paket')) score += 2;
    if (h.includes('bedel') || h.includes('tutar')) score += 2;
    if (isMonthPeriodHeader(h)) score += 3;
    if (/(ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik)\s+\d{4}/.test(h)) score += 3;
    if (h.length > 8) score += 1;

    return score;
}

// ==========================================
// COLUMN ROLE CLASSIFIER
// ==========================================

/**
 * Sütun başlığına semantik rol atar.
 *
 * Öncelik sırası:
 *   FORBIDDEN → skip (bunlar asla fiyat olarak seçilmez)
 *   TIER-1    → price_net  (en spesifik KDV hariç eşleşme)
 *   TIER-2    → price_gross (en spesifik KDV dahil eşleşme)
 *   TIER-3    → name / isk / package_m2 / consumption_m2 / package_qty
 *   FALLBACK  → skip (bilinmiyor)
 */
function classifyColumn(raw: unknown, iskCountSoFar: number): ColumnRole {
    const h = normalizeHeader(raw);
    if (!h) return 'skip';

    // ---- FORBIDDEN: kesinlikle price olarak seçilmez ----
    // Türetilmiş iskontolu fiyatlar
    if (isForbiddenPriceHeader(h)) return 'skip';

    // ---- NAME ----
    if (h.includes('malzeme') || h.includes('urun') || h.includes('isim') || h.includes('adi') || h.includes('mamul')) {
        return 'name';
    }

    // ---- PRICE_NET (KDV hariç liste fiyatı) — "liste" zorunlu ----
    // "AMBALAJ KDV HARİÇ LİSTE FİYATI"
    if (h.includes('ambalaj') && h.includes('haric') && h.includes('liste')) return 'price_net';
    // "KDV HARİÇ LİSTE FİYATI"
    if (h.includes('haric') && h.includes('liste') && h.includes('fiyat')) return 'price_net';
    // Daha esnek fallback:
    // "2026-5 KDV HARİÇ", "AMBALAJ KDV HARİÇ", "KDV HARİÇ BEDEL/TUTAR" gibi varyasyonları da kabul et.
    if (h.includes('haric') && isLikelyPriceHeader(h)) return 'price_net';

    // ---- PRICE_GROSS (KDV dahil liste fiyatı) — tier 2 ----
    // "AMBALAJ KDV DAHİL LİSTE FİYATI" veya "2026-2 KDV DAHİL LİSTE FİYATI"
    if (h.includes('dahil') && h.includes('liste') && h.includes('fiyat') && !h.includes('m2')) return 'price_gross';
    // "KDV DAHİL LİSTE FİYATI" (eski format Col1)
    if (h.includes('kdv') && h.includes('dahil') && h.includes('fiyat') && !h.includes('m2') && !h.includes('iskontolu')) return 'price_gross';
    // Daha esnek fallback:
    // "2026-5 KDV DAHİL", "AMBALAJ KDV DAHİL", "KDV DAHİL BEDEL/TUTAR" gibi.
    if (h.includes('dahil') && isLikelyPriceHeader(h)) return 'price_gross';

    // ---- İSK (iskonto) — maks 6, sonrası skip ----
    // "İSK 1", "İSK\n2", "İSK 3" gibi
    if ((h === 'isk' || /^isk\s*\d+$/.test(h) || h.includes('iskonto') || h.includes('indirim') || h.includes('discount')) &&
        !h.includes('kdv') && !h.includes('fiyat')) {
        if (iskCountSoFar < 6) return 'isk';
        return 'skip'; // 7. ISK'ten itibaren şehir iskontosu sayılır
    }

    // ---- PACKAGE_M2 ----
    if ((h.includes('ambalaj') || h.includes('paket')) && (h.includes('m2') || h.includes('m²')) && !h.includes('fiyat')) {
        return 'package_m2';
    }

    // ---- CONSUMPTION_M2 (m² sarfiyat) ----
    if (h.includes('sarfiyat') || (h.includes('m2') && h.includes('sarfi'))) {
        return 'consumption_m2';
    }

    // ---- PACKAGE_QTY (ambalaj adedi — 25 kg, 16 adet) ----
    // "AMBALAJ" tek başına → sadece sayı sütunu, başlık kısa olmalı
    if (h === 'ambalaj' || h === 'adet' || h === 'kg' || h === 'birim') {
        return 'package_qty';
    }

    return 'skip';
}

// ==========================================
// HEADER ROW DETECTION
// ==========================================

/**
 * Satırlar içinden header satırını bulur.
 * Kriter: en az 2 anlamlı keyword barındıran ilk satır (ilk 12 satır içinde).
 * "Anlamlı" = name/price/isk rolünden birini tetikleyen hücre.
 */
function detectHeaderRow(rows: unknown[][]): number {
    for (let i = 0; i < Math.min(12, rows.length); i++) {
        const row = rows[i];
        if (!row) continue;

        let hits = 0;
        let iskTemp = 0;
        for (const cell of row) {
            const role = classifyColumn(cell, iskTemp);
            if (role === 'name' || role === 'price_net' || role === 'price_gross') hits++;
            if (role === 'isk') { hits++; iskTemp++; }
            if (hits >= 2) return i;
        }
    }
    return -1;
}

// ==========================================
// COLUMN MAP BUILDER
// ==========================================

/**
 * Header satırından ColumnMap oluşturur.
 *
 * Öncelik kuralları:
 *   - price_net  > price_gross  (KDV hariç tercih edilir)
 *   - price_net  ilk bulunanda set edilir, sonraki price_net'ler atlanır
 *   - Aynı kural price_gross için (price_net bulunduktan sonra price_gross da set edilebilir — fallback olarak tutulur)
 *   - isk: sırasıyla ilk 6 (TIER kısıtı classifyColumn'da)
 */
function mapColumnsFromHeader(headerRow: unknown[]): ColumnMap {
    const map: ColumnMap = { isk: [] };
    let iskCount = 0;
    const netCandidates: PriceCandidate[] = [];
    const grossCandidates: PriceCandidate[] = [];

    for (let idx = 0; idx < headerRow.length; idx++) {
        const cell = headerRow[idx];
        const normalized = normalizeHeader(cell);
        const role = classifyColumn(cell, iskCount);

        switch (role) {
            case 'name':
                if (map.name === undefined) map.name = idx;
                break;

            case 'price_net':
                netCandidates.push({ idx, score: scorePriceHeader(normalized, 'net') });
                break;

            case 'price_gross':
                grossCandidates.push({ idx, score: scorePriceHeader(normalized, 'gross') });
                break;

            case 'isk':
                if (iskCount < 6) {
                    map.isk.push(idx);
                    iskCount++;
                }
                break;

            case 'package_m2':
                if (map.packageM2 === undefined) map.packageM2 = idx;
                break;

            case 'consumption_m2':
                if (map.consumptionM2 === undefined) map.consumptionM2 = idx;
                break;

            case 'package_qty':
                if (map.packageQty === undefined) map.packageQty = idx;
                break;

            case 'skip':
            default:
                break;
        }
    }

    netCandidates.sort((a, b) => b.score - a.score || a.idx - b.idx);
    grossCandidates.sort((a, b) => b.score - a.score || a.idx - b.idx);

    if (netCandidates.length > 0 && Number.isFinite(netCandidates[0].score)) {
        map.priceNet = netCandidates[0].idx;
    }

    if (grossCandidates.length > 0 && Number.isFinite(grossCandidates[0].score)) {
        map.priceGross = grossCandidates[0].idx;
    }

    return map;
}

// ==========================================
// KDV HINT FROM COLUMN MAP
// ==========================================

/**
 * Seçilen fiyat sütunu başlığından KDV durumunu çıkarır.
 *
 * Öncelik:
 *   1. priceNet seçildiyse → kdv_haric (kesin)
 *   2. priceGross seçildiyse → kdv_dahil (kesin)
 *   3. Hiçbiri yoksa sheet adına bak (fallback)
 */
function detectKdvHint(map: ColumnMap, headerRow: unknown[], sheetName: string): KdvHint {
    // Fiyat kolonunu başlığından doğrudan oku
    const priceColIdx = map.priceNet ?? map.priceGross;
    if (priceColIdx !== undefined) {
        const h = normalizeHeader(headerRow[priceColIdx]);
        if (h.includes('haric')) return 'kdv_haric';
        if (h.includes('dahil')) return 'kdv_dahil';
    }

    // Fallback: sheet adından çıkar
    const s = normalizeHeader(sheetName);
    if (s.includes('kalem') || s.includes('optimix') || s.includes('eps') || s.includes('kdv dahil')) return 'kdv_dahil';
    if (s.includes('kdv haric') || s.includes('tasyunu') || s.includes('maliyet')) return 'kdv_haric';
    return 'unknown';
}

// ==========================================
// SHEET SKIP LOGIC
// ==========================================

/**
 * Import için anlamsız sheet'leri atlar.
 * "YÜKLEME" = lojistik kapasite tablosu, fiyat verisi yok.
 * "EPS PAKET" = FİLLİ + FAWORİ sheet'lerinin birleşimi, çift sayım riski.
 */
function shouldSkipSheet(sheetName: string): boolean {
    const s = normalizeHeader(sheetName);
    if (s.includes('yukleme') || s.includes('yükleme') || s.includes('lojistik') || s.includes('kapasite')) return true;
    if (s.includes('eps paket') || s.includes('paket sistem')) return true;
    return false;
}

// ==========================================
// ROW HELPERS
// ==========================================

function cellToString(cell: unknown): string {
    if (cell == null) return '';
    if (typeof cell === 'number') return String(cell);
    return String(cell).trim();
}

/**
 * Satırın başlık tekrarı veya tamamen boş olmadığını kontrol eder.
 */
function isDataRow(row: unknown[], nameIdx: number): boolean {
    if (!row || row.length === 0) return false;
    const nameCell = cellToString(row[nameIdx]);
    if (!nameCell || nameCell.length < 2) return false;

    // Başlık tekrarı: aynı header keyword içeriyorsa atla
    const h = normalizeHeader(nameCell);
    const isHeaderLike =
        h === 'malzeme ismi' || h === 'urun adi' ||
        (h.includes('malzeme') && h.includes('ismi') && h.length < 30) ||
        (h.includes('eylul') || h.includes('ocak') || h.includes('aralik') || h.includes('subat')) && h.includes('malzeme');
    return !isHeaderLike;
}

// ==========================================
// MAIN EXPORT
// ==========================================

export interface ExcelParseResult {
    rows:          RawImportRow[];
    sheetNames:    string[];
    parseWarnings: string[];
}

/**
 * Node.js ortamında Excel/CSV Buffer'ını RawImportRow[] dizisine çevirir.
 *
 * Her sheet için:
 *   1. Lojistik/çift-sayım sheet'leri atlanır.
 *   2. Header satırı dinamik tespit edilir (ilk 12 satır).
 *   3. Her sütuna semantik rol atanır (price_net / price_gross / isk / ...).
 *   4. KDV durumu fiyat sütununun başlığından kesin belirlenir.
 *   5. priceNet > priceGross önceliğiyle base_price seçilir.
 *
 * rowIndex: sheet'ler arası monoton artan (0-bazlı global).
 */
export function parseExcelBuffer(
    buffer:   Buffer,
    filename: string,
): ExcelParseResult {
    const workbook   = XLSX.read(buffer, { type: 'buffer' });
    const rows:      RawImportRow[] = [];
    const warnings:  string[]       = [];
    const sheetNames = workbook.SheetNames;
    let   globalIdx  = 0;

    for (const sheetName of sheetNames) {
        // Lojistik ve çift-sayım sheet'lerini atla
        if (shouldSkipSheet(sheetName)) {
            warnings.push(`Sheet "${sheetName}" atlandı (lojistik/çift sayım).`);
            continue;
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) continue;

        const sheetData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
            header:    1,
            defval:    '',
            blankrows: false,
        });

        if (!sheetData || sheetData.length === 0) continue;

        // ---- Header satırını bul ----
        const headerRowIdx = detectHeaderRow(sheetData);

        let colMap:       ColumnMap;
        let dataStartIdx: number;
        let kdvHint:      KdvHint;
        let headerRow:    unknown[];

        if (headerRowIdx >= 0) {
            headerRow    = sheetData[headerRowIdx] as unknown[];
            colMap       = mapColumnsFromHeader(headerRow);
            dataStartIdx = headerRowIdx + 1;
            kdvHint      = detectKdvHint(colMap, headerRow, sheetName);
        } else {
            // Fallback: pozisyon bazlı (en eski tasyunu_maliyet.csv formatı)
            headerRow    = [];
            colMap       = { name: 0, priceGross: 1, isk: [2, 3] };
            dataStartIdx = 0;
            kdvHint      = 'unknown';
            warnings.push(
                `Sheet "${sheetName}": başlık satırı tespit edilemedi — ` +
                `col[0]=isim, col[1]=fiyat, col[2]=isk1, col[3]=isk2 varsayıldı.`,
            );
        }

        // Fiyat kolonu bulunamadıysa uyar ama devam et
        if (colMap.priceNet === undefined && colMap.priceGross === undefined) {
            warnings.push(`Sheet "${sheetName}": fiyat sütunu tespit edilemedi, satırlar atlanacak.`);
        }

        const nameIdx = colMap.name ?? 0;

        // Seçilen fiyat sütunu: KDV hariç varsa onu, yoksa KDV dahil
        const priceIdx = colMap.priceNet ?? colMap.priceGross;

        for (let i = dataStartIdx; i < sheetData.length; i++) {
            const row = sheetData[i] as unknown[];
            if (!isDataRow(row, nameIdx)) continue;

            const rawProductName = cellToString(row[nameIdx]);
            const rawPrice       = priceIdx != null ? cellToString(row[priceIdx]) : '';

            // Fiyatsız veya sıfır fiyatlı satırları atla
            if (!rawPrice || rawPrice === '0' || rawPrice === '') continue;

            const rawIsk1 = colMap.isk[0] != null ? cellToString(row[colMap.isk[0]]) : undefined;
            const rawIsk2 = colMap.isk[1] != null ? cellToString(row[colMap.isk[1]]) : undefined;
            const rawPackageM2  = colMap.packageM2  != null ? cellToString(row[colMap.packageM2])  : undefined;
            const rawBrandHint  = colMap.brand      != null ? cellToString(row[colMap.brand])      : undefined;

            // rawThickness: bu formatlarda ayrı sütun yok — ürün adından çıkarılır (normalizer görevi)

            rows.push({
                rowIndex:        globalIdx++,
                rawProductName,
                rawBrandHint:    rawBrandHint   || undefined,
                rawPrice,
                rawIsk1:         rawIsk1        || undefined,
                rawIsk2:         rawIsk2        || undefined,
                rawThickness:    undefined,       // Bu formatlarda ayrı thickness sütunu yok
                rawUnit:         undefined,
                rawKdvHint:      kdvHint,
                rawPackageM2:    rawPackageM2   || undefined,
                sourceSheetName: sheetName,
                parseWarnings:   [],
            });
        }
    }

    if (rows.length === 0) {
        warnings.push(`"${filename}" dosyasından hiç veri satırı çıkarılamadı.`);
    }

    return { rows, sheetNames, parseWarnings: warnings };
}
