import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-fe-surface border-t border-fe-border mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Logo + slogan */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">TY</span>
              </div>
              <span className="text-white font-bold text-base">TaşYünü Fiyatları</span>
            </div>
            <p className="text-fe-muted text-xs max-w-xs">
              Türkiye geneli taşyünü ve EPS fiyatları. Lojistik dahil mantolama maliyetinizi hesaplayın.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="text-fe-muted hover:text-brand-400 transition-colors">
              Hesap Makinesi
            </Link>
            <Link href="/urunler" className="text-fe-muted hover:text-brand-400 transition-colors">
              Ürün Kataloğu
            </Link>
            <Link href="/urunler/tasyunu-levha" className="text-fe-muted hover:text-brand-400 transition-colors">
              Taşyünü Levha
            </Link>
            <Link href="/urunler/eps-levha" className="text-fe-muted hover:text-brand-400 transition-colors">
              EPS Levha
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-fe-border/60 text-xs text-fe-muted text-center">
          © {new Date().getFullYear()} TaşYünü Fiyatları. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
