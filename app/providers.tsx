'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache süresi: 5 dakika
            staleTime: 5 * 60 * 1000,
            // Garbage collection: 10 dakika
            gcTime: 10 * 60 * 1000,
            // Hata durumunda 3 kez tekrar dene
            retry: 3,
            // Pencere focus olunca otomatik yenileme yapma
            refetchOnWindowFocus: false,
            // Bağlantı yenilenince otomatik refetch yapma
            refetchOnReconnect: true,
          },
          mutations: {
            // Mutation hataları için 1 kez tekrar dene
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Development modunda DevTools göster */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
