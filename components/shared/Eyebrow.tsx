// Hub'daki altın eyebrow patterni (mono UPPERCASE + altın çizgi).
// Class: globals.css `.eyebrow`. tone='dark' default; warm sayfalar için 'warm'.

import type { ReactNode } from 'react';

type Tone = 'dark' | 'warm';

interface EyebrowProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export default function Eyebrow({
  children,
  tone = 'dark',
  className = '',
  as: Tag = 'span',
}: EyebrowProps) {
  const toneClass = tone === 'warm' ? 'text-hub-gold' : 'text-hub-gold-soft';
  return (
    <Tag className={`eyebrow ${toneClass} ${className}`}>
      {children}
    </Tag>
  );
}
