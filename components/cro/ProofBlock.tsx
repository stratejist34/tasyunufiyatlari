import Image from 'next/image';
import { FileText, Truck, BuildingOffice, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { ICON_WEIGHT } from '@/lib/design/tokens';

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
          {/* PDF kartı */}
          <div className="rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-6">
            <div className="flex items-center gap-3">
              <FileText size={26} weight={ICON_WEIGHT} className="text-brand" aria-hidden />
              <h3 className="text-lg font-semibold text-fe-text">Örnek PDF teklif</h3>
            </div>
            <p className="mt-2 text-sm text-fe-muted leading-relaxed">
              Resmi başlık, kalem listesi, nakliye dahil tutar, referans numarası ve 24 saat geçerlilik. Aşağıda anonimleştirilmiş gerçek bir örnek.
            </p>
            <div className="mt-5 overflow-hidden rounded-lg border border-fe-border/30 bg-fe-surface/40">
              <Image
                src="/images/ornek-pdf.webp"
                alt="Anonimleştirilmiş örnek mantolama PDF teklifi"
                width={800}
                height={1100}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Depo kartı */}
          <div className="rounded-2xl border border-fe-border/40 bg-fe-raised/40 p-6">
            <div className="flex items-center gap-3">
              <BuildingOffice size={26} weight={ICON_WEIGHT} className="text-brand" aria-hidden />
              <h3 className="text-lg font-semibold text-fe-text">Aktif depo, paletli sevkiyat</h3>
            </div>
            <p className="mt-2 text-sm text-fe-muted leading-relaxed">
              Tuzla deposundan paletli yüklemeyle çıkış. Sahaya kırık ve eksik palet riski en aza iner; yükleme öncesi sayım yapılır.
            </p>
            <div className="mt-5 overflow-hidden rounded-lg border border-fe-border/30 bg-fe-surface/40">
              <Image
                src="/images/depo.webp"
                alt="ÖzerGrup Tuzla deposundan paletli sevkiyat çıkışı"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
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
