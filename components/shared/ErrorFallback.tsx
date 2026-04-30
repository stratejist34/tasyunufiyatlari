'use client';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-brand-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-2 border-red-200">
        <div className="text-center">
          {/* Icon */}
          <div className="text-6xl mb-4">😔</div>

          {/* Başlık */}
          <h2 className="text-2xl font-bold text-red-800 mb-2">Bir Hata Oluştu</h2>

          {/* Hata mesajı */}
          <p className="text-red-600 mb-6 text-sm">
            {error.message || 'Beklenmeyen bir hata oluştu'}
          </p>

          {/* Butonlar */}
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Tekrar Dene
            </button>

            <button
              onClick={() => (window.location.href = '/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Ana Sayfaya Dön
            </button>

            {/* Destek linki */}
            <a
              href="mailto:destek@tasyunu.com"
              className="block text-sm text-gray-500 hover:text-gray-700 mt-4"
            >
              Sorun devam ediyorsa destek ekibiyle iletişime geçin
            </a>
          </div>

          {/* Development ortamında hata detayları */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                Hata Detayları (Dev)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40 text-left">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
