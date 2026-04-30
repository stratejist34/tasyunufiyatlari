// WhatsApp tıklama niyetini sunucuya bildir.
// Tarayıcı sayfa değiştirse bile fetch tamamlansın diye `keepalive: true`.
// Hata sessiz: WA linkinin çalışmasını engellemez.

import type { WhatsappIntentPayload } from './analytics/whatsappSource';

export function notifyWhatsappIntent(payload: WhatsappIntentPayload): void {
  if (typeof window === 'undefined') return;

  const fullPayload: WhatsappIntentPayload = {
    ...payload,
    page: payload.page ?? window.location.pathname,
  };

  try {
    fetch('/api/whatsapp-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Fetch fail olursa kullanıcı akışı bozulmasın — sessiz yut
  }

  // GA4 paralel event (gtag yüklendiğinde paralel akış)
  // gtag global'i yoksa hiçbir şey yapma.
  type GtagWindow = Window & {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams: Record<string, unknown>
    ) => void;
  };
  const w = window as GtagWindow;
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'whatsapp_intent', {
      source: fullPayload.source,
      page_path: fullPayload.page,
      product_name: fullPayload.productName,
    });
  }
}
