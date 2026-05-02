import Image from 'next/image';
import { FileText, Truck, BuildingOffice, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { ICON_WEIGHT } from '@/lib/design/tokens';

const TRUST_ROW = [
  { Icon: ShieldCheck, t: 'TSE & CE belgeli sistem', d: 'Tüm kalemler standartlara uygun, raporlu.' },
  { Icon: BuildingOffice, t: 'ÖzerGrup — 2006', d: 'Yalıtım ve izolasyon alanında 19 yıl.' },
  { Icon: Truck, t: '81 il sevkiyat', d: 'Kısmi yükten tam araca her ölçek.' },
] as const;

const OPERATION_STATS = [
  { value: '40+', label: 'Palet kapasiteli stok', sub: 'Anlık takip, kırılma riski en aza iner.' },
  { value: '81', label: 'İl aktif sevkiyat ağı', sub: 'Kısmi yük + tam araç, iskonto bölgeli.' },
  { value: '24 sa.', label: 'PDF teklif geçerlilik', sub: 'Sabit fiyat, referans no, WhatsApp\'tan onay.' },
] as const;

export function ProofBlock() {
  return (
    <section
      aria-labelledby="proof-baslik"
      className="bg-fe-raised/40 py-16 sm:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center max-w-[680px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Söz Değil, Kanıt
          </p>
          <h2
            id="proof-baslik"
            className="mt-3 font-heading font-extrabold text-[28px] sm:text-[36px] leading-[1.15] tracking-tight text-fe-text"
          >
            Neye dayanarak güveneceğinizi gösteriyoruz
          </h2>
        </div>

        {/* Asymmetric main row: large PDF card + tall stat band stack */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* PDF kartı — büyük, görsel ağırlıklı (3/5 desktop) */}
          <div className="lg:col-span-3 rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-6">
            <div className="flex items-center gap-3">
              <FileText size={26} weight={ICON_WEIGHT} className="text-brand" aria-hidden />
              <h3 className="text-lg font-semibold text-fe-text">Örnek PDF teklif</h3>
            </div>
            <p className="mt-2 text-sm text-fe-muted leading-relaxed">
              Resmi başlık, kalem listesi, nakliye dahil tutar, referans numarası, 24 saat geçerlilik. Aşağıda anonimleştirilmiş gerçek bir örnek var.
            </p>
            <div className="mt-5 overflow-hidden rounded-lg border border-fe-border/30 bg-fe-surface/40">
              <Image
                src="/images/ornek-pdf.webp"
                alt="Anonimleştirilmiş örnek mantolama PDF teklifi"
                width={800}
                height={1000}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Stat band — operational scale (2/5 desktop) */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4 content-start">
            {OPERATION_STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-5">
                <p className="font-heading font-extrabold text-3xl sm:text-4xl text-brand leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-fe-text">{s.label}</p>
                <p className="mt-1 text-xs text-fe-muted leading-relaxed">{s.sub}</p>
              </div>
            ))}
            {/* Sevkiyat ağı kartı — text + icon, no image */}
            <div className="rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-5">
              <div className="flex items-center gap-2">
                <Truck size={22} weight={ICON_WEIGHT} className="text-brand" aria-hidden />
                <h3 className="text-base font-semibold text-fe-text">Tüm Türkiye sevkiyat ağı</h3>
              </div>
              <p className="mt-1.5 text-xs text-fe-muted leading-relaxed">
                Kısmi yük, kamyon ve TIR; iskonto bölgelerine göre ek avantaj.
              </p>
            </div>
          </div>
        </div>

        {/* Trust row — kept as-is */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRUST_ROW.map(({ Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3 rounded-2xl border border-fe-border/40 bg-fe-surface/60 p-4">
              <Icon size={22} weight={ICON_WEIGHT} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-fe-text">{t}</p>
                <p className="mt-0.5 text-xs text-fe-muted">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
