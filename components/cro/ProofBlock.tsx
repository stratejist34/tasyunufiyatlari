import Image from 'next/image';
import { FileText, Truck, BuildingOffice, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { ICON_WEIGHT } from '@/lib/design/tokens';

function ImagePlaceholder({ label, ratio = 'aspect-[4/5]' }: { label: string; ratio?: string }) {
  return (
    <div
      className={`mt-4 ${ratio} rounded-lg border-2 border-dashed border-fe-border/50 bg-fe-surface/60 flex items-center justify-center p-6`}
      role="img"
      aria-label={`Yer tutucu: ${label}`}
    >
      <p className="text-xs text-fe-muted text-center leading-relaxed">
        {label}
        <br />
        <span className="text-[10px] uppercase tracking-wider opacity-70">
          gerçek görsel hazır olunca eklenecek
        </span>
      </p>
    </div>
  );
}

const TRUST_ROW = [
  { Icon: ShieldCheck, t: 'TSE & CE belgeli sistem', d: 'Tüm kalemler standartlara uygun, raporlu.' },
  { Icon: BuildingOffice, t: 'ÖzerGrup — 2006', d: 'Yalıtım ve izolasyon alanında 19 yıl.' },
  { Icon: Truck, t: '81 il sevkiyat', d: 'Kısmi yükten tam araca her ölçek.' },
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

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-6">
            <FileText size={28} weight={ICON_WEIGHT} className="text-brand" aria-hidden />
            <h3 className="mt-3 text-lg font-semibold text-fe-text">Örnek PDF teklif</h3>
            <p className="mt-1.5 text-sm text-fe-muted leading-relaxed">
              Resmi başlık, kalem listesi, nakliye dahil tutar, referans numarası ve 24 saat geçerlilik. Aşağıda anonimleştirilmiş gerçek bir örnek var.
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-fe-border/30 bg-fe-surface/40">
              <Image
                src="/ornek-pdf.webp"
                alt="Anonimleştirilmiş örnek mantolama PDF teklifi"
                width={800}
                height={1000}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-6">
              <BuildingOffice size={28} weight={ICON_WEIGHT} className="text-brand" aria-hidden />
              <h3 className="mt-3 text-lg font-semibold text-fe-text">Aktif depo, paletli stok</h3>
              <p className="mt-1.5 text-sm text-fe-muted leading-relaxed">
                Anlık stok takibi, paletli sevkiyat — sahaya kırık/eksik palet riski en aza iner.
              </p>
              {/* TODO: public/proof/depo.jpg hazır olunca ImagePlaceholder → next/image */}
              <ImagePlaceholder label="ÖzerGrup depo iç görünüm" ratio="aspect-[16/10]" />
            </div>
            <div className="rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-6">
              <Truck size={28} weight={ICON_WEIGHT} className="text-brand" aria-hidden />
              <h3 className="mt-3 text-lg font-semibold text-fe-text">Tüm Türkiye sevkiyat ağı</h3>
              <p className="mt-1.5 text-sm text-fe-muted leading-relaxed">
                Kısmi yük, kamyon ve TIR sevkiyatı; iskonto bölgelerine göre ek avantaj.
              </p>
            </div>
          </div>
        </div>

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
