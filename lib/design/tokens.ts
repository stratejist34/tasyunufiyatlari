// ============================================================
// Design tokens for shared layout primitives.
// Tek kaynak: globals.css custom properties + Tailwind classları.
// Component'ler bu sabitleri import eder; raw rgba/hex değer yazılmaz.
// ============================================================

export type Tone = 'dark' | 'warm';

// Header / Footer / Section tone — Faz 2'de SiteHeader & SiteFooter kullanır.
export const TONE_CLASSES: Record<Tone, {
  surface: string;        // ana zemin
  surfaceRaised: string;  // ikinci kat (sticky scroll arka plan)
  text: string;           // ana metin
  textMuted: string;      // ikincil metin
  border: string;         // ayrım çizgileri
  accent: string;         // altın/CTA
  hover: string;          // link hover bg
}> = {
  dark: {
    surface:       'bg-fe-bg',
    surfaceRaised: 'bg-fe-surface',
    text:          'text-fe-text',
    textMuted:     'text-fe-muted',
    border:        'border-fe-border',
    accent:        'text-hub-gold-soft',
    hover:         'hover:bg-fe-surface-raised/40',
  },
  warm: {
    surface:       'bg-hub-cream',
    surfaceRaised: 'bg-hub-warm',
    text:          'text-hub-ink',
    textMuted:     'text-hub-ink-2',
    border:        'border-hub-rule',
    accent:        'text-hub-gold',
    hover:         'hover:bg-hub-rule/30',
  },
};

// Section padding utility — globals.css'teki .section-pad-*
export const SECTION_PAD = {
  sm: 'section-pad-sm',
  md: 'section-pad-md',
  lg: 'section-pad-lg',
} as const;

// Type scale utility — globals.css'teki .t-*
export const TYPE = {
  display: 't-display',
  h1:      't-h1',
  h2:      't-h2',
  h3:      't-h3',
  body:    't-body',
  meta:    't-meta',
} as const;

// CTA hierarchy classes — globals.css'teki .btn-*
export const BTN = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
} as const;

// Eyebrow class
export const EYEBROW = 'eyebrow';

// Phosphor icon weight kuralı: bu projede 'regular' weight kullanılır.
// import { Truck, Package } from '@phosphor-icons/react';
// <Truck weight={ICON_WEIGHT} size={20} />
export const ICON_WEIGHT = 'regular' as const;
export const ICON_SIZE = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;
