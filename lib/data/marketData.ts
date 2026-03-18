// ==========================================
// MOCK MARKET DATA
// ==========================================

export interface Transaction {
  id: string;
  city: string;
  district: string;
  system: string;
  brand: string;
  m2: number;
  timestamp: string;
}

export interface Hotspot {
  city: string;
  region: string;
  percent: number;
}

export interface VolumeDataPoint {
  date: string;
  m2: number;
}

// Mock işlemler (piyasa ticker ve listeler için)
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', city: 'İstanbul', district: 'Ümraniye', system: 'Taşyünü 10cm', brand: 'Dalmaçyalı', m2: 850, timestamp: '2025-01-15T14:30:00' },
  { id: '2', city: 'Ankara', district: 'Çankaya', system: 'EPS 8cm', brand: 'Optimix', m2: 650, timestamp: '2025-01-15T13:20:00' },
  { id: '3', city: 'İzmir', district: 'Bornova', system: 'Taşyünü 5cm', brand: 'Expert', m2: 1200, timestamp: '2025-01-15T11:45:00' },
  { id: '4', city: 'Bursa', district: 'Nilüfer', system: 'Taşyünü 10cm', brand: 'Dalmaçyalı', m2: 920, timestamp: '2025-01-14T16:10:00' },
  { id: '5', city: 'Antalya', district: 'Kepez', system: 'EPS 6cm', brand: 'Optimix', m2: 780, timestamp: '2025-01-14T15:00:00' },
  { id: '6', city: 'Konya', district: 'Selçuklu', system: 'Taşyünü 8cm', brand: 'Dalmaçyalı', m2: 1050, timestamp: '2025-01-14T14:20:00' },
  { id: '7', city: 'Adana', district: 'Seyhan', system: 'Taşyünü 5cm', brand: 'Expert', m2: 640, timestamp: '2025-01-14T12:30:00' },
  { id: '8', city: 'Gaziantep', district: 'Şahinbey', system: 'EPS 10cm', brand: 'Optimix', m2: 1100, timestamp: '2025-01-13T17:00:00' },
];

// Bölgesel yoğunluk (hotspots)
export const HOTSPOTS: Hotspot[] = [
  { city: 'İstanbul', region: 'Marmara', percent: 32 },
  { city: 'Ankara', region: 'İç Anadolu', percent: 18 },
  { city: 'İzmir', region: 'Ege', percent: 15 },
  { city: 'Bursa', region: 'Marmara', percent: 12 },
  { city: 'Antalya', region: 'Akdeniz', percent: 10 },
];

// Haftalık hacim grafiği
export const VOLUME_DATA: VolumeDataPoint[] = [
  { date: '16 Ara', m2: 3200 },
  { date: '17 Ara', m2: 4100 },
  { date: '18 Ara', m2: 3800 },
  { date: '19 Ara', m2: 5200 },
  { date: '20 Ara', m2: 4900 },
  { date: '21 Ara', m2: 6100 },
  { date: '22 Ara', m2: 5400 },
];
