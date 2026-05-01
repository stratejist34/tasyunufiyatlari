export type LocalBusinessSchema = {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness';
  name: string;
  legalName: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  areaServed: { '@type': 'Country'; name: string };
  openingHoursSpecification: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange: string;
};

export function buildLocalBusiness(): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taşyünü Fiyatları',
    legalName: 'ÖzerGrup Yalıtım ve İzolasyon A.Ş.',
    url: 'https://www.tasyunufiyatlari.com',
    telephone: '+905322041825',
    email: 'bilgi@tasyunufiyatlari.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Orhanlı Mescit Mh. Demokrasi Cd. No:5',
      addressLocality: 'Tuzla',
      addressRegion: 'İstanbul',
      addressCountry: 'TR',
    },
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '₺₺',
  };
}
