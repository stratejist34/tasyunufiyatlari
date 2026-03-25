import Link from 'next/link';

export default function SiteHeader() {
  return (
    <>
      {/* Top bar */}
      <div className="bg-fe-surface border-b border-fe-border text-center py-2 px-4 text-xs sm:text-sm">
        <span className="font-semibold text-white">TIR BAZLI SATIŞ</span>
        <span className="mx-2 sm:mx-4 text-fe-muted">|</span>
        <span className="text-fe-muted">DEPO: İstanbul &amp; Gebze</span>
        <span className="mx-2 sm:mx-4 text-fe-muted">|</span>
        <span className="text-brand-500 font-semibold">Bölgeye Göre İskonto</span>
      </div>

      {/* Main header */}
      <header className="bg-fe-surface/80 backdrop-blur-md border-b border-fe-border sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-base">TY</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block tracking-tight">
                TaşYünü Fiyatları
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-4">
              <Link
                href="/urunler"
                className="text-fe-text hover:text-brand-400 transition-colors text-sm font-medium hidden sm:block"
              >
                Ürün Kataloğu
              </Link>
              <Link
                href="/"
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Hesap Makinesi
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
