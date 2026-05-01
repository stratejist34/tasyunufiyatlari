import { Warning, TrendDown, Wallet, Drop } from '@phosphor-icons/react/dist/ssr';
import { ICON_WEIGHT } from '@/lib/design/tokens';

const RISKS = [
  {
    Icon: TrendDown,
    title: 'Yetersiz kalınlıkla %15–25 fazladan ısınma gideri',
    body: 'Ilıman bölgede 4 cm seçen, 10 yılda kalınlık tasarrufunu fazlasıyla geri kaybeder.',
  },
  {
    Icon: Wallet,
    title: 'Eksik metraj — sahada ek nakliye + parça kesim',
    body: 'Bir paket eksik gelmek, tek başına 1 km için bile yeniden tek araba demek.',
  },
  {
    Icon: Drop,
    title: 'Yanlış malzeme — nem ve küf sorunu',
    body: 'EPS uygunsuz çatıda nem tutar; taşyünü doğru detaylandırılmazsa ses köprüsü yapar.',
  },
  {
    Icon: Warning,
    title: 'Belgesiz sistem — EKB ve iskan riski',
    body: 'TSE/CE belgesi olmayan kalemlerle yapılan iş, EKB onayında geri dönebilir.',
  },
] as const;

export function RiskBlock() {
  return (
    <section
      aria-labelledby="risk-baslik"
      className="bg-fe-bg-2/30 py-16 sm:py-24"
    >
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="max-w-[640px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fe-accent">
            Hesabı Eksik Yaparsanız
          </p>
          <h2
            id="risk-baslik"
            className="mt-3 font-heading font-extrabold text-[28px] sm:text-[36px] leading-[1.15] tracking-tight text-fe-text"
          >
            Mantolama hesabı eksik yapılırsa ne olur?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-fe-text-muted leading-relaxed">
            Bu 4 risk hesaplayıcının arka planda otomatik koruduğu — fakat manuel hesapta sıkça atlanan — kalemlerdir.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {RISKS.map(({ Icon, title, body }) => (
            <li key={title} className="flex items-start gap-4">
              <Icon
                size={26}
                weight={ICON_WEIGHT}
                className="mt-1 shrink-0 text-fe-accent"
                aria-hidden
              />
              <div>
                <p className="text-base font-semibold text-fe-text">{title}</p>
                <p className="mt-1.5 text-sm text-fe-text-muted leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
