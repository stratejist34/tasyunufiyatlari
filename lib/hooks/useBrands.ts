import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Brand } from '@/lib/types';

/**
 * Markaları çeker
 *
 * @param levhaTipi - 'tasyunu' | 'eps' | null
 * @returns Markalar listesi, loading ve error state'leri
 *
 * @example
 * const { data: brands, isLoading } = useBrands('tasyunu');
 */
export function useBrands(levhaTipi: 'tasyunu' | 'eps' | null) {
  return useQuery({
    queryKey: ['brands', levhaTipi],
    queryFn: async () => {
      if (!levhaTipi) return [];

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (error) {
        console.error('Marka çekme hatası:', error);
        throw new Error('Markalar yüklenemedi');
      }

      return (data || []) as Brand[];
    },
    enabled: !!levhaTipi, // Sadece levhaTipi seçiliyse çalış
    staleTime: 10 * 60 * 1000, // 10 dakika cache (markalar sık değişmez)
  });
}
