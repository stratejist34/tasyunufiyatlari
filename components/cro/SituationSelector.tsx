'use client';

import { useRouter } from 'next/navigation';
import {
  Thermometer,
  SpeakerSimpleHigh,
  House,
  Question,
} from '@phosphor-icons/react/dist/ssr';
import type { ComponentType, SVGProps } from 'react';
import { ICON_WEIGHT } from '@/lib/design/tokens';
import { notifySituationSelected, type SituationKey } from '@/lib/notifyWizardEvent';

type IconType = ComponentType<{
  size?: number | string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'duotone' | 'fill';
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
} & SVGProps<SVGSVGElement>>;

type Situation = {
  key: SituationKey;
  Icon: IconType;
  label: string;
  helper: string;
  scrollTarget: '#mantolama-hesaplayici' | '/iletisim';
};

const SITUATIONS: Situation[] = [
  {
    key: 'isi_yalitimi',
    Icon: Thermometer as IconType,
    label: 'Isı yalıtımı yaptırmak istiyorum',
    helper: 'Doğalgaz/elektrik faturası düşürmek hedefse — taşyünü veya EPS önerelim.',
    scrollTarget: '#mantolama-hesaplayici',
  },
  {
    key: 'ses_yalitimi',
    Icon: SpeakerSimpleHigh as IconType,
    label: 'Ses yalıtımı önemli',
    helper: 'Komşu, sokak veya iş yeri gürültüsü için yoğunluk farkı kritik.',
    scrollTarget: '#mantolama-hesaplayici',
  },
  {
    key: 'cati_yalitimi',
    Icon: House as IconType,
    label: 'Çatı/teras katı için',
    helper: 'Üst kat ısı kaybı ve nem için farklı kalınlık önerilir.',
    scrollTarget: '#mantolama-hesaplayici',
  },
  {
    key: 'emin_degilim',
    Icon: Question as IconType,
    label: 'Henüz emin değilim',
    helper: 'Sahanızı paylaşın, doğru paketi sizin için biz belirleyelim.',
    scrollTarget: '/iletisim',
  },
];

export function SituationSelector() {
  const router = useRouter();

  const onSelect = (s: Situation) => {
    notifySituationSelected({ situationKey: s.key, situationLabel: s.label });
    if (s.scrollTarget.startsWith('#')) {
      const el = document.querySelector(s.scrollTarget);
      if (el instanceof HTMLElement) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push(s.scrollTarget);
    }
  };

  return (
    <section
      aria-labelledby="situation-baslik"
      className="bg-fe-bg py-12 sm:py-16"
    >
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="text-center max-w-[640px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fe-accent">
            Önce Niyetinizi Söyleyin
          </p>
          <h2
            id="situation-baslik"
            className="mt-3 font-heading font-extrabold text-[28px] sm:text-[36px] leading-[1.15] tracking-tight text-fe-text"
          >
            Hangi sorun için araştırıyorsunuz?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-fe-text-muted leading-relaxed">
            Seçiminiz hesaplayıcıyı doğru yönlendirir. Kararsızsanız son seçenek size özel.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SITUATIONS.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="group h-full w-full text-left rounded-2xl border border-fe-border/50 bg-fe-bg-2/40 p-5 transition hover:border-fe-accent/60 hover:bg-fe-bg-2/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-fe-accent/40"
              >
                <s.Icon size={28} weight={ICON_WEIGHT} className="text-fe-accent" aria-hidden />
                <p className="mt-4 text-base font-semibold text-fe-text">{s.label}</p>
                <p className="mt-1.5 text-xs text-fe-text-muted leading-relaxed">{s.helper}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
