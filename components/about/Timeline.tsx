'use client';

// Sticky stepper timeline — sol kolonda sticky yıllar, sağda scroll'la değişen içerik.
// Aktif yıl IntersectionObserver ile algılanır; mobilde dikey collapse (klasik liste).

import { useEffect, useRef, useState } from 'react';

export interface Milestone {
  year: string;
  title: string;
  body: string;
}

interface TimelineProps {
  milestones: Milestone[];
  /** Tema: warm (krem zemin) veya dark */
  tone?: 'warm' | 'dark';
}

export default function Timeline({ milestones, tone = 'warm' }: TimelineProps) {
  const isWarm = tone === 'warm';
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number(visible.target.getAttribute('data-idx'));
          if (!Number.isNaN(idx)) setActiveIdx(idx);
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.1, 0.5, 0.9] }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [milestones.length]);

  const yearActive   = isWarm ? 'text-hub-gold'      : 'text-hub-gold-soft';
  const yearMuted    = isWarm ? 'text-hub-ink-2/35'  : 'text-fe-text/30';
  const titleColor   = isWarm ? 'text-hub-ink'       : 'text-white';
  const bodyColor    = isWarm ? 'text-hub-ink-2'     : 'text-fe-text/85';
  const dotActive    = isWarm ? 'bg-hub-gold'        : 'bg-hub-gold-soft';
  const dotMuted     = isWarm ? 'bg-hub-rule-strong' : 'bg-fe-border';
  const ruleColor    = isWarm ? 'border-hub-rule'    : 'border-fe-border';

  return (
    <div ref={containerRef} className="grid md:grid-cols-12 gap-10 md:gap-16">
      {/* Sol — sticky yıl listesi (md+ only) */}
      <aside className="hidden md:block md:col-span-4 md:sticky md:top-28 self-start">
        <div className="flex flex-col gap-6">
          {milestones.map((m, i) => {
            const active = i === activeIdx;
            return (
              <div key={m.year} className="flex items-center gap-4">
                <span
                  className={`shrink-0 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    active ? `${dotActive} scale-125 shadow-[0_0_0_4px_rgba(160,122,44,0.18)]` : dotMuted
                  }`}
                />
                <span
                  className={`font-heading font-bold tracking-tight transition-all duration-300 ${
                    active
                      ? `${yearActive} text-4xl lg:text-5xl`
                      : `${yearMuted} text-2xl lg:text-3xl`
                  }`}
                >
                  {m.year}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Sağ — scroll içerik */}
      <div className="md:col-span-8 space-y-14 md:space-y-24">
        {milestones.map((m, i) => (
          <article
            key={m.year}
            ref={(el) => { itemRefs.current[i] = el; }}
            data-idx={i}
            className={`pb-10 md:pb-0 border-b ${ruleColor} md:border-0`}
          >
            {/* Yıl rozeti — md altı için */}
            <div className={`md:hidden font-heading font-bold tracking-tight text-3xl ${yearActive} mb-3`}>
              {m.year}
            </div>
            <h3 className={`font-heading font-bold tracking-tight text-2xl md:text-3xl lg:text-4xl leading-snug mb-4 ${titleColor}`}>
              {m.title}
            </h3>
            <p className={`text-base md:text-lg leading-relaxed max-w-2xl ${bodyColor}`}>
              {m.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
