// Editorial section header: eyebrow + h2 + opsiyonel lead paragraph.
// Tüm yeni section'lar bunu kullanır; aynı tipografi disiplini her yerde.

import type { ReactNode } from 'react';
import Eyebrow from './Eyebrow';

type Tone = 'dark' | 'warm';
type Align = 'left' | 'center';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
  align?: Align;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  lead,
  tone = 'dark',
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isWarm = tone === 'warm';
  const titleColor = isWarm ? 'text-hub-ink' : 'text-white';
  const leadColor  = isWarm ? 'text-hub-ink-2' : 'text-fe-text/85';
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const eyebrowJustify = align === 'center' ? 'justify-center' : '';

  return (
    <div className={`${alignClass} max-w-2xl ${className}`}>
      {eyebrow && (
        <Eyebrow tone={tone} className={`mb-5 ${eyebrowJustify}`}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={`font-heading font-bold tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl ${titleColor} ${
          lead ? 'mb-5' : ''
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`${leadColor} text-base sm:text-lg leading-relaxed`}>
          {lead}
        </p>
      )}
    </div>
  );
}
