import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ShippingZone } from '@/lib/types';

/**
 * Nakliye bölgelerini (şehirler) çeker
 *
 * @returns Şehirler listesi, loading ve error state'leri
 *
 * @example
 * const { data: cities, isLoading } = useShippingZones();
 */
export function useShippingZones() {
  const PRIORITY_CITIES = [
    'İstanbul',
    'Kocaeli',
    'Bolu',
    'Sakarya',
    'Düzce',
    'Tekirdağ',
    'Yalova',
    'Bursa',
    'Balıkesir',
  ];
  const sortShippingZones = (zones: ShippingZone[]) => {
    const priorityMap = new Map(
      PRIORITY_CITIES.map((name, idx) => [name.toLocaleLowerCase('tr-TR'), idx])
    );
    return [...zones].sort((a, b) => {
      const aKey = a.city_name.toLocaleLowerCase('tr-TR');
      const bKey = b.city_name.toLocaleLowerCase('tr-TR');
      const ai = priorityMap.get(aKey);
      const bi = priorityMap.get(bKey);
      if (ai != null && bi != null) return ai - bi;
      if (ai != null) return -1;
      if (bi != null) return 1;
      return a.city_name.localeCompare(b.city_name, 'tr-TR');
    });
  };

  return useQuery({
    queryKey: ['shipping-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('city_name');

      if (error) {
        console.error('Şehir çekme hatası:', error);
        throw new Error('Şehirler yüklenemedi');
      }

      return sortShippingZones((data || []) as ShippingZone[]);
    },
    staleTime: 15 * 60 * 1000, // 15 dakika cache (şehirler nadiren değişir)
  });
}
