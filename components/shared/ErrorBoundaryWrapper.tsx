'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        // Production'da hata loglama servisi eklenebilir (Sentry, LogRocket vs.)
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
