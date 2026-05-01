'use client';

// Next.js App Router client-side navigation gtag.js'in otomatik pageview
// trackleme mekanizmasını tetiklemiyor. Bu komponent route değişikliklerini
// dinleyip her geçişte explicit page_view eventi atar.

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface Props {
  measurementId: string;
}

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

function Tracker({ measurementId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as GtagWindow;
    if (typeof w.gtag !== 'function') return;

    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;

    w.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      send_to: measurementId,
    });
  }, [pathname, searchParams, measurementId]);

  return null;
}

export default function GAPageviewTracker(props: Props) {
  return (
    <Suspense fallback={null}>
      <Tracker {...props} />
    </Suspense>
  );
}
