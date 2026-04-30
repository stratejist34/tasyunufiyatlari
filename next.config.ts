import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage'a yüklenen görseller zaten optimize boyut/format'ta
    // (WebP, doğru en-boy oranı). Vercel'in image optimization katmanı bu
    // durumda gereksiz transformasyon üretiyor — Hobby tier 5K/ay limit hızla
    // dolardı. unoptimized:true → orijinal URL'ler direkt servis edilir,
    // transformation sayılmaz.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      // ─── Levha kategorileri ────────────────────────────
      { source: '/kategori/tasyunu-levhalar', destination: '/urunler/tasyunu-levha', permanent: true },
      { source: '/kategori/eps-levhalar',     destination: '/urunler/eps-levha',     permanent: true },

      // ─── Aksesuar alt-kategorileri (eski → yeni ayrı sayfalar) ──
      { source: '/kategori/dubeller',         destination: '/urunler/dubel',                     permanent: true },
      { source: '/kategori/yapistiricilar',   destination: '/urunler/yapistirici',               permanent: true },
      { source: '/kategori/fileler',          destination: '/urunler/file',                      permanent: true },
      { source: '/kategori/profiller',        destination: '/urunler/fileli-kose-profilleri',    permanent: true },
      { source: '/kategori/sivalar',          destination: '/urunler/siva',                      permanent: true },
      { source: '/kategori/astarlar',         destination: '/urunler/astar',                     permanent: true },
      { source: '/kategori/kaplamalar',       destination: '/urunler/kaplama',                   permanent: true },

      // ─── Boyalar (DB'de yok) → Filli Boya markasına ────
      { source: '/kategori/boyalar',          destination: '/marka/filli-boya',                  permanent: true },

      // ─── Yardımcı Ürünler (preventive) ─────────────────
      { source: '/kategori/yardimci-urunler', destination: '/urunler',                           permanent: true },

      // ─── Aksesuar landing kaldırılır ───────────────────
      { source: '/urunler/aksesuar',          destination: '/urunler',                           permanent: true },

      // ─── Marka alt yolları → ana marka sayfası ─────────
      { source: '/marka/fawori',                   destination: '/marka/filli-boya', permanent: true },
      { source: '/marka/fawori/:rest*',            destination: '/marka/filli-boya', permanent: true },
      { source: '/marka/filli-boya/expert',        destination: '/marka/filli-boya', permanent: true },
      { source: '/marka/filli-boya/expert/:rest*', destination: '/marka/filli-boya', permanent: true },
      { source: '/marka/:brand/page/:n',           destination: '/marka/:brand',     permanent: true },

      // ─── Eski WP shop & yardımcı sayfalar ──────────────
      { source: '/shop',                  destination: '/urunler', permanent: true },
      { source: '/shop/page/:n*',         destination: '/urunler', permanent: true },
      { source: '/tasyunu-eps-depo',      destination: '/depomuz', permanent: true },
      { source: '/tasyunu-eps-depo/:rest*', destination: '/depomuz', permanent: true },
    ];
  },
};

export default nextConfig;
