import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/piyasa', '/ofis', '/api/admin'],
      },
    ],
    sitemap: 'https://tasyunufiyatlari.com/sitemap.xml',
  };
}
