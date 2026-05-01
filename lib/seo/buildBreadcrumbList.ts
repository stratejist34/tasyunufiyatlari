export type BreadcrumbCrumb = { name: string; path: string };

export type BreadcrumbListSchema = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

/**
 * BreadcrumbList JSON-LD üretir. Origin parametresi tam URL oluşturmak için kullanılır
 * (örn: 'https://www.tasyunufiyatlari.com'). path '/' ile başlamalıdır.
 */
export function buildBreadcrumbList(
  crumbs: BreadcrumbCrumb[],
  origin: string,
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: origin + c.path,
    })),
  };
}
