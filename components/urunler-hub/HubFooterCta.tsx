// /urunler hub footer CTA — koyu zemin, büyük başlık, hesap makinesi linki.

import Link from 'next/link';

export default function HubFooterCta() {
  return (
    <section className="bg-hub-dark text-hub-warm py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8">
          <h3 className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.028em] leading-[1.05]">
            Saniyede paket{' '}
            <span className="text-hub-gold-soft">fiyatına git.</span>
          </h3>
          <p className="mt-4 text-base lg:text-lg text-hub-warm/65 max-w-[48ch] leading-relaxed">
            Şehir + m² + kalınlık. Sistem paketi (levha, dübel, file, sıva)
            bölge iskontosuyla ekrana düşsün.
          </p>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Link
            href="/#mantolama-hesaplayici"
            prefetch={false}
            className="inline-flex items-center gap-4 bg-hub-gold-soft hover:bg-hub-warm text-hub-dark px-7 py-5 rounded-xl text-base font-semibold tracking-[-0.005em] transition-colors"
          >
            Hesap Makinesi
            <span className="w-8 h-8 rounded-full bg-hub-dark text-hub-gold-soft flex items-center justify-center text-sm">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
