// /urunler hub hero — sol başlık + lede, sağ 3 stat (kategori · ürün · marka).
// Hero arkaplan görseli YOK, iskonto stat hücresi YOK (bkz. brief 4. düzeltme).

type Props = {
  totals: { kategori: number; urun: number; marka: number };
};

export default function HubHero({ totals }: Props) {
  return (
    <section className="bg-hub-warm border-b border-hub-rule-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* Sol: Başlık + lede */}
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-hub-gold mb-5">
              <span className="inline-block w-9 h-px bg-hub-gold align-middle mr-3" />
              Ürün Kataloğu · 2026
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.025em] leading-[1.05] text-hub-ink mb-6">
              Isı yalıtım ürünleri
            </h1>
            <p className="text-base lg:text-lg leading-relaxed text-hub-ink-2 max-w-[52ch]">
              Müteahhide paket, mimara şartname, ustaya satır net. Marka, kalınlık ve şehir
              seçin — fabrika çıkışı fiyatınız ekrana düşsün, paket içeriği eksiksiz olsun.
            </p>
          </div>

          {/* Sağ: 3 stat hücresi (kategori · ürün · marka) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 border-t border-hub-rule">
              <Stat label="Kategori" value={totals.kategori} />
              <Stat label="Ürün"     value={totals.urun} divider />
              <Stat label="Marka"    value={totals.marka} divider />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, divider = false }: { label: string; value: number; divider?: boolean }) {
  return (
    <div className={`pt-5 pb-2 px-4 ${divider ? 'border-l border-hub-rule' : ''}`}>
      <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-hub-muted mb-2">
        {label}
      </div>
      <div className="font-bold text-3xl lg:text-4xl tracking-[-0.03em] text-hub-ink tabular-nums">
        {value}
      </div>
    </div>
  );
}
