import { useMutation } from '@tanstack/react-query';

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
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        console.error('Teklif gönderme hatası:', data);
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
