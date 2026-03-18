import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Teklif talebini Supabase'e gönderir
 *
 * @returns Mutation fonksiyonları ve state'leri
 *
 * @example
 * const { mutate: submitQuote, isPending } = useQuoteSubmit();
 *
 * const handleSubmit = () => {
 *   submitQuote(quoteData, {
 *     onSuccess: () => alert('Teklif gönderildi!'),
 *     onError: (error) => alert(error.message)
 *   });
 * };
 */
export function useQuoteSubmit() {
  return useMutation({
    mutationFn: async (quoteData: any) => {
      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select()
        .single();

      if (error) {
        console.error('Teklif gönderme hatası:', error);
        throw new Error('Teklif gönderilemedi. Lütfen tekrar deneyin.');
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Teklif başarıyla gönderildi:', data);
      // Burada toast notification gösterilebilir
    },
    onError: (error: Error) => {
      console.error('Mutation hatası:', error);
      // Burada toast notification gösterilebilir
    },
  });
}
