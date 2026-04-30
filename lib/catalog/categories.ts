// Tüm listeleme sayfalarında ortak kullanılan kategori meta verisi.
// /urunler/[kategori] ve /marka/[brand]/[kategori] burayı import eder.

export type CategoryInfo = {
  /** Material parametresi: 'tasyunu' | 'eps' | 'aksesuar' (lib/catalog/server.ts MATERIAL_IDS) */
  material: string;
  title: string;
  desc: string;
  /** accessory_types.slug — material === 'aksesuar' için zorunlu */
  accessoryTypeSlug?: string;
  /** Sayfada hiç ürün yoksa gösterilecek özelleştirilmiş mesaj */
  emptyHint?: string;
};

export const KATEGORI_MAP: Record<string, CategoryInfo> = {
  'tasyunu-levha': {
    material: 'tasyunu',
    title: 'Taşyünü Levha',
    desc: 'Taşyünü ısı yalıtım levhası ürünleri — farklı marka, yoğunluk ve kalınlık seçenekleri.',
  },
  'eps-levha': {
    material: 'eps',
    title: 'EPS Levha',
    desc: 'Genleştirilmiş polistiren (EPS) ısı yalıtım levhaları.',
  },

  // ─── Aksesuar alt-kategorileri ───────────────────────
  'dubel': {
    material: 'aksesuar',
    accessoryTypeSlug: 'dubel',
    title: 'Dübel',
    desc: 'Plastik ve çelik çivili dübeller — taşyünü ve EPS sistemler için.',
    emptyHint: 'Dübeller sistem paketi içinde sunulur. Hesap makinesinden tam paket fiyatı alın.',
  },
  'yapistirici': {
    material: 'aksesuar',
    accessoryTypeSlug: 'yapistirici',
    title: 'Yapıştırıcı',
    desc: 'Isı yalıtım levhası yapıştırma harçları.',
  },
  'siva': {
    material: 'aksesuar',
    accessoryTypeSlug: 'siva',
    title: 'Sıva',
    desc: 'Mantolama sistem sıvaları ve yalıtım sıva harçları.',
  },
  'file': {
    material: 'aksesuar',
    accessoryTypeSlug: 'file',
    title: 'Donatı Filesi',
    desc: 'Mantolama donatı fileleri — 160 gr/m² standart.',
    emptyHint: 'Donatı filesi sistem paketi içinde sunulur. Hesap makinesinden tam paket fiyatı alın.',
  },
  'fileli-kose-profilleri': {
    material: 'aksesuar',
    accessoryTypeSlug: 'fileli-kose',
    title: 'Fileli Köşe Profilleri',
    desc: 'PVC fileli köşe profilleri — mantolama köşe çözümleri.',
    emptyHint: 'Fileli köşe profilleri sistem paketi içinde sunulur. Hesap makinesinden tam paket fiyatı alın.',
  },
  'astar': {
    material: 'aksesuar',
    accessoryTypeSlug: 'astar',
    title: 'Astar',
    desc: 'Kaplama astarları — dekoratif kaplama öncesi.',
  },
  'kaplama': {
    material: 'aksesuar',
    accessoryTypeSlug: 'kaplama',
    title: 'Mineral Kaplama',
    desc: 'Dekoratif mineral kaplamalar — mantolama dış yüzey.',
  },
};

/** Sıralı liste — UI'da chip/sidebar gezinme için. Levhalar önce, sonra aksesuar alt-kategorileri. */
export const KATEGORI_LIST: Array<{ slug: string; info: CategoryInfo }> =
  Object.entries(KATEGORI_MAP).map(([slug, info]) => ({ slug, info }));
