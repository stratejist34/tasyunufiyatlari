"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface ThicknessSelectorProps {
  thicknessOptions: number[];
  popularThickness?: number | null;
}

/**
 * URL query param olarak kalınlık seçimini yönetir.
 * ?kalinlik=9cm şeklinde URL'yi günceller (scroll olmadan).
 * parseInt("9cm") → 9 çalışır, parse ek işlem gerektirmez.
 */
export default function ThicknessSelector({ thicknessOptions, popularThickness }: ThicknessSelectorProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!thicknessOptions || thicknessOptions.length === 0) return null;

  const currentRaw      = searchParams.get('kalinlik');
  const currentThickness = currentRaw ? parseInt(currentRaw, 10) : null;
  const activeThickness  =
    currentThickness !== null && thicknessOptions.includes(currentThickness)
      ? currentThickness
      : (popularThickness != null && thicknessOptions.includes(popularThickness) ? popularThickness : thicknessOptions[0]);

  function select(t: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('kalinlik', `${t}cm`);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (thicknessOptions.length === 1) {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 bg-brand-600/20 text-brand-400 text-sm rounded-lg border border-brand-500/50 font-medium">
          {thicknessOptions[0]} cm
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {thicknessOptions.map((t) => {
        const isActive  = t === activeThickness;
        // Badge yalnızca aktif chip = sistem önerisi olduğunda gösterilir.
        // URL override ile ayrışınca (örn. ?kalinlik=3 ama popular=5) badge gizlenir.
        const isPopular = popularThickness != null && t === popularThickness && t === activeThickness;
        return (
          <div key={t} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => select(t)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer font-medium ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border-brand-500/50'
                  : 'bg-fe-raised/60 text-fe-text border-fe-border hover:border-brand-500/40 hover:text-brand-300'
              }`}
            >
              {t} cm
            </button>
            {isPopular && (
              <span className="text-[9px] text-brand-400/70 mt-0.5 leading-none">
                En çok tercih
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
