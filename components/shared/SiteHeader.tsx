'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type Tone = 'dark' | 'warm';

interface SiteHeaderProps {
  /** dark: ürün/teknik sayfalar (/, /urunler/*, /marka/*, /urun/*, /depomuz)
   *  warm: kurumsal sayfalar (/hakkimizda, /iletisim) */
  tone?: Tone;
  /** Geriye dönük uyumluluk: önceki adı `theme`, kademeli geçiş için */
  theme?: Tone;
}

const NAV = [
  { href: '/urunler', label: 'Ürün Kataloğu' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function SiteHeader({ tone, theme }: SiteHeaderProps) {
  const resolvedTone: Tone = tone ?? theme ?? 'dark';
  const isWarm = resolvedTone === 'warm';
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ─── Sticky scroll arka plan + alt çizgi reaksiyonu ────────────
  // Hem dark hem warm sayfalarda header KOYU kalır (logo yutulmasın, kimlik tutarlı).
  // Warm = hub-dark (warm-siyah, footer ile aynı dil); dark = fe-surface.
  const headerBg = isWarm
    ? scrolled
      ? 'bg-hub-dark/92 backdrop-blur-md border-b border-hub-warm/15 shadow-[0_1px_0_rgba(255,255,255,0.04)]'
      : 'bg-hub-dark border-b border-transparent'
    : scrolled
      ? 'bg-fe-surface/92 backdrop-blur-md border-b border-fe-border shadow-[0_1px_0_rgba(255,255,255,0.04)]'
      : 'bg-fe-surface border-b border-fe-border/40';

  // ─── Top bar — sadece dark theme'da render edilir ───────────────
  const showTopBar = !isWarm;

  return (
    <>
      {showTopBar && (
        <div className="bg-fe-surface border-b border-fe-border text-center py-2 px-4 text-xs sm:text-sm">
          <span className="font-semibold text-white">Fabrika Çıkışlı Satış</span>
          <span className="hidden sm:inline mx-2 sm:mx-4 text-fe-muted">|</span>
          <span className="hidden sm:inline text-fe-text/80">Depo: İstanbul/Tuzla &amp; Gebze</span>
          <span className="mx-2 sm:mx-4 text-fe-muted">|</span>
          <span className="text-hub-gold-soft font-semibold">Bölgeye Göre İskonto</span>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200 ease-out ${headerBg}`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              prefetch={false}
              className="flex items-center shrink-0"
              aria-label="TaşYünü Fiyatları — Anasayfa"
            >
              <Image
                src="/tasyunu-logo.webp"
                alt="TaşYünü Fiyatları"
                width={260}
                height={54}
                priority
                className="h-7 sm:h-9 w-auto"
              />
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                // Header artık her iki tonda da koyu zeminli; nav linkleri ortak dil.
                const linkBase   = 'text-fe-text/85 hover:text-hub-gold-soft';
                const activeText = 'text-hub-gold-soft';
                const underline  = 'bg-hub-gold-soft';
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                      active ? activeText : linkBase
                    }`}
                  >
                    <span>{item.label}</span>
                    {/* Aktif altın alt çizgi (Hub badge pattern) */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left transition-transform duration-200 ${underline} ${
                        active ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                );
              })}
              <Link
                href="/"
                prefetch={false}
                className="btn-primary !py-2 !px-4 !text-sm ml-1 sm:ml-3"
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
