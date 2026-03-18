import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Plate } from '@/lib/types';

/**
 * Levhaları çeker
 *
 * @returns Levhalar listesi, loading ve error state'leri
 *
 * @example
 * const { data: plates, isLoading } = usePlates();
 */
export function usePlates() {
  return useQuery({
    queryKey: ['plates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plates')
        .select('*')
        .order('name');

      if (error) {
        console.error('Levha çekme hatası:', error);
        throw new Error('Levhalar yüklenemedi');
      }

      return (data || []) as Plate[];
    },
    staleTime: 10 * 60 * 1000, // 10 dakika cache
  });
}
