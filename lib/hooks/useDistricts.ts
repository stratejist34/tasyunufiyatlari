import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ShippingDistrict } from '@/lib/types';

/**
 * Belirli bir şehre ait ilçeleri çeker
 *
 * @param cityCode - Şehir kodu
 * @returns İlçeler listesi, loading ve error state'leri
 *
 * @example
 * const { data: districts, isLoading } = useDistricts(34); // İstanbul'un ilçeleri
 */
export function useDistricts(cityCode: number | null) {
  return useQuery({
    queryKey: ['districts', cityCode],
    queryFn: async () => {
      if (!cityCode) return [];

      const { data, error } = await supabase
        .from('shipping_districts')
        .select('*')
        .eq('city_code', cityCode)
        .order('name');

      if (error) {
        console.error('İlçe çekme hatası:', error);
        throw new Error('İlçeler yüklenemedi');
      }

      return (data || []) as ShippingDistrict[];
    },
    enabled: !!cityCode, // Sadece cityCode varsa çalış
    staleTime: 15 * 60 * 1000, // 15 dakika cache
  });
}
