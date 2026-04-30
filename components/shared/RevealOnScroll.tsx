'use client';

// Scroll-driven reveal: viewport'a giren element data-revealed='true' alır,
// CSS transition `.reveal-on-scroll[data-revealed="true"]` ile animate eder.
// prefers-reduced-motion globals.css'te zaten kapatılır.

import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  /** Wrapper tag — default 'div' */
  as?: ElementType;
  /** Tetiklenmeden önce viewport içinde ne kadar görünmeli (0–1) */
  threshold?: number;
  /** Tetiklenmeden önce ne kadar geç görsün (px). negatif: erken görür. */
  rootMargin?: string;
  /** Her tetikten sonra observer'ı sök; tek seferlik animasyon */
  once?: boolean;
  /** Sıralı çocuklar için stagger delay (ms). 0 = devre dışı. */
  delay?: number;
  className?: string;
}

export default function RevealOnScroll({
  children,
  as: Tag = 'div',
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
  delay = 0,
  className = '',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Browser desteği yoksa direkt göster
    if (typeof IntersectionObserver === 'undefined') {
      node.setAttribute('data-revealed', 'true');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delay > 0) {
              window.setTimeout(() => {
                node.setAttribute('data-revealed', 'true');
              }, delay);
            } else {
              node.setAttribute('data-revealed', 'true');
            }
            if (once) observer.unobserve(node);
          } else if (!once) {
            node.setAttribute('data-revealed', 'false');
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`reveal-on-scroll ${className}`}
    >
      {children}
    </Tag>
  );
}
