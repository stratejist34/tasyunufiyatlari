// Marka + ürün adı formatlaması.
// Tek otorite: PDF, e-posta, bildirim — hepsi buradan geçer.
//
// İki sorunu çözer:
//   1) brand.name ürün adının başında zaten varsa duplikasyonu önle
//      ("Expert" + "Expert Premium" → "Expert Premium")
//   2) Fawori alt markalarında parent prefix ekle
//      ("Expert Premium" → "Fawori Expert Premium")
//
// Marka hiyerarşisi (CLAUDE.md):
//   Fawori ana marka. Expert ve Optimix Fawori'nin alt markalarıdır.

const FAWORI_SUB_BRANDS = new Set(['expert', 'optimix']);
const FAWORI_PARENT = 'Fawori';

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Marka + ürün adını birleştirir. Duplikasyon yapmaz, Fawori parent ekler.
 *
 * Örnekler:
 *   ('Expert', 'Expert Premium')        → 'Fawori Expert Premium'
 *   ('Optimix', 'Optimix Karbonlu')     → 'Fawori Optimix Karbonlu'
 *   ('Fawori', 'Fawori Expert Premium') → 'Fawori Expert Premium'
 *   ('Knauf', 'TP 435 B')               → 'Knauf TP 435 B'
 *   ('Dalmaçyalı', 'SW035')             → 'Dalmaçyalı SW035'
 */
export function formatBrandProductName(
  brandName: string | null | undefined,
  productName: string | null | undefined
): string {
  const brand = (brandName ?? '').trim();
  const product = (productName ?? '').trim();
  if (!brand && !product) return '';
  if (!brand) return product;
  if (!product) return brand;

  const brandLower = normalize(brand);
  const productLower = normalize(product);

  // Ürün adı zaten brand ile başlıyorsa tekrarlama
  let combined: string;
  if (productLower === brandLower || productLower.startsWith(brandLower + ' ')) {
    combined = product;
  } else {
    combined = `${brand} ${product}`;
  }

  // Fawori alt markası ise ve birleşim Fawori ile başlamıyorsa parent ekle
  const combinedLower = normalize(combined);
  if (
    FAWORI_SUB_BRANDS.has(brandLower) &&
    !combinedLower.startsWith(normalize(FAWORI_PARENT) + ' ')
  ) {
    combined = `${FAWORI_PARENT} ${combined}`;
  }

  return combined;
}

/**
 * Sadece marka adını döner. Fawori alt markası ise parent prefix eklenir.
 *   ('Expert')   → 'Fawori Expert'
 *   ('Knauf')    → 'Knauf'
 */
export function formatBrandName(brandName: string | null | undefined): string {
  const brand = (brandName ?? '').trim();
  if (!brand) return '';
  if (FAWORI_SUB_BRANDS.has(normalize(brand))) {
    return `${FAWORI_PARENT} ${brand}`;
  }
  return brand;
}
