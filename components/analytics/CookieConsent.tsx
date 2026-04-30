'use client';

// Cookie / KVKK rıza bildirimi.
// İlk ziyarette default deny aktif (Consent Mode v2 — GoogleAnalytics.tsx).
// Kullanıcı seçim yapana kadar banner görünür.
//   "Kabul Et"  → analytics + ad çerezleri 'granted'
//   "Reddet"    → mevcut deny korunur
// Tercih localStorage'a yazılır; banner bir daha gösterilmez.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from '@phosphor-icons/react';
import { ICON_WEIGHT } from '@/lib/design/tokens';

const STORAGE_KEY = 'cookie-consent-v1';

type ConsentValue = 'accepted' | 'rejected';

type GtagWindow = Window & {
  gtag?: (
    command: 'consent',
    action: 'update',
    params: Record<string, 'granted' | 'denied'>
  ) => void;
};

function setGtagConsent(value: ConsentValue) {
  if (typeof window === 'undefined') return;
  const w = window as GtagWindow;
  if (typeof w.gtag !== 'function') return;
  if (value === 'accepted') {
    w.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  } else {
    w.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
        return;
      }
      // Önceki seçimi her sayfa yüklemesinde gtag'a tekrar bildir
      setGtagConsent(stored as ConsentValue);
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* private mode — yoksay */
    }
    setGtagConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] px-3 sm:px-6 pb-3 sm:pb-6 pointer-events-none"
      role="region"
      aria-label="Çerez bildirimi"
    >
      <div className="pointer-events-auto max-w-3xl mx-auto bg-fe-bg/96 backdrop-blur-md border border-fe-border rounded-2xl shadow-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg mb-2 tracking-tight">
              Çerez ve gizlilik tercihleri
            </h3>
            <p className="text-fe-text/85 text-sm leading-relaxed">
              Site deneyimini iyileştirmek ve trafik istatistiklerini ölçmek için çerez kullanıyoruz.
              Onay vermezseniz yalnızca zorunlu çerezler çalışır; analytics çerezleri yüklenmez.
              Detay için{' '}
              <Link href="/kvkk" className="text-hub-gold-soft underline hover:text-hub-gold">
                Aydınlatma Metni
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => persist('rejected')}
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg text-fe-muted hover:text-white hover:bg-fe-surface/60 transition-colors"
            aria-label="Reddet ve kapat"
          >
            <X weight={ICON_WEIGHT} size={18} />
          </button>
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => persist('rejected')}
            className="btn-ghost !px-4"
          >
            Sadece Zorunlu
          </button>
          <button
            type="button"
            onClick={() => persist('accepted')}
            className="btn-primary"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
