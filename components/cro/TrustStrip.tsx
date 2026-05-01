import { Truck, Certificate, Factory, Calculator } from '@phosphor-icons/react/dist/ssr';
import { ICON_WEIGHT } from '@/lib/design/tokens';

const ITEMS = [
  {
    Icon: Factory,
    title: 'Fabrika çıkışlı',
    body: 'Aracı yok — üretici fiyatına eşit teklif.',
  },
  {
    Icon: Truck,
    title: 'Türkiye geneli sevkiyat',
    body: '81 il, kısmi yük + tam araç seçenekleri.',
  },
  {
    Icon: Certificate,
    title: 'TSE & CE belgeli sistem',
    body: 'Tüm kalemler standartlara uygun, raporlu.',
  },
  {
    Icon: Calculator,
    title: 'Tek hesapta 8 kalem',
    body: 'Sıva, dübel, file dahil — eksik kalem yok.',
  },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Güven göstergeleri"
      className="border-y border-fe-border/40 bg-fe-raised/40"
    >
      <div className="max-w-[1200px] mx-auto px-4 py-6 sm:py-8">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {ITEMS.map(({ Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon
                size={22}
                weight={ICON_WEIGHT}
                className="mt-0.5 shrink-0 text-brand"
                aria-hidden
              />
              <div>
                <p className="text-sm font-semibold text-fe-text">{title}</p>
                <p className="mt-0.5 text-xs text-fe-muted leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
