// ============================================================
// SEO Metadata Helper
// Sayfa generateMetadata fonksiyonlarının ortak iskeletini kurar:
// canonical URL, OpenGraph, Twitter card alanları tek yerden gelir.
// metadataBase root layout'ta tanımlı (https://tasyunufiyatlari.com)
// — bu helper relative path döndürür, Next.js absolute'a çevirir.
// ============================================================

import type { Metadata } from 'next';

const SITE_NAME = 'Taşyünü Fiyatları';
const DEFAULT_OG_IMAGE = '/og-default.png';

export type OgType = 'website' | 'article' | 'product';

export interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: OgType;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const canonical = path.startsWith('/') ? path : `/${path}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const hasCustomImage = Boolean(image);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: 'tr_TR',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: hasCustomImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: [ogImage],
    },
  };
}
