"use client";

import type { PricingVisibilityMode } from '@/lib/catalog/types';

interface PriceDisplayProps {
  mode: PricingVisibilityMode;
  basePrice: number | null;
  thicknessOptions?: number[] | null;
}

/**
 * pricing_visibility_mode'a göre fiyat bilgisini gösterir.
 * Ürün listesi kartı ve detay sayfasında kullanılır.
 */
export default function PriceDisplay({ mode, basePrice, thicknessOptions }: PriceDisplayProps) {
  if (mode === 'hidden' || mode === 'quote_required') {
    return (
      <span className="text-sm text-fe-muted italic">
        {mode === 'quote_required' ? 'Teklif ile belirlenir' : 'Fiyat görüntülenmez'}
      </span>
    );
  }

  if (mode === 'from_price' && basePrice !== null) {
    return (
      <span className="text-brand-400 font-semibold">
        {basePrice.toLocaleString('tr-TR', { minimumFractionDigits: 0 })} TL
        <span className="text-fe-muted font-normal text-xs ml-1">'den başlayan</span>
      </span>
    );
  }

  if (mode === 'exact_price' && basePrice !== null) {
    return (
      <span className="text-white font-semibold">
        {basePrice.toLocaleString('tr-TR', { minimumFractionDigits: 0 })} TL
        <span className="text-fe-muted font-normal text-xs ml-1">/ m²</span>
      </span>
    );
  }

  return <span className="text-fe-muted text-sm">—</span>;
}
