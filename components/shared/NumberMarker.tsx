// Hub'daki "01 / 02 / 03" numaralı badge patterni.
// inline: kart üstünde küçük mono altın etiket (CategoryCards stili).
// display: timeline / nasıl çalışır section'ında büyük editorial rakam.

import type { ReactNode } from 'react';

type Tone = 'dark' | 'warm';
type Variant = 'inline' | 'display';

interface NumberMarkerProps {
  /** "01" ya da raw number — number ise iki haneye padlenir */
  n: number | string;
  /** İsteğe bağlı: rakamın yanına küçük etiket (ör. "ADIM") */
  label?: ReactNode;
  variant?: Variant;
  tone?: Tone;
  className?: string;
}

export default function NumberMarker({
  n,
  label,
  variant = 'inline',
  tone = 'dark',
  className = '',
}: NumberMarkerProps) {
  const formatted = typeof n === 'number' ? String(n).padStart(2, '0') : n;
  const accent = tone === 'warm' ? 'text-hub-gold' : 'text-hub-gold-soft';

  if (variant === 'display') {
    return (
      <div className={`flex items-baseline gap-3 ${className}`}>
        <span
          className={`font-heading font-bold leading-none tracking-tight text-5xl sm:text-6xl md:text-7xl ${accent}`}
        >
          {formatted}
        </span>
        {label && (
          <span
            className={`font-mono text-xs uppercase tracking-[0.18em] ${
              tone === 'warm' ? 'text-hub-ink-2' : 'text-fe-text/70'
            }`}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] ${accent} ${className}`}
    >
      <span>{formatted}</span>
      {label && (
        <span className={tone === 'warm' ? 'text-hub-ink-2' : 'text-fe-text/70'}>
          {label}
        </span>
      )}
    </span>
  );
}
