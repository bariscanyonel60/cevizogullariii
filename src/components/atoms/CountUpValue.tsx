"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1800;
const formatter = new Intl.NumberFormat("tr-TR");

/**
 * Gerçek değer SSR HTML'inde yer alır (crawler'lar için). Animasyon yalnızca
 * öğe hydrate anında görünür alanın dışındaysa ve hareket azaltma kapalıysa çalışır.
 */
export function CountUpValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    node.textContent = "0";
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - (1 - progress) ** 3;
          node.textContent = formatter.format(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = formatter.format(value);
    };
  }, [value]);

  return <span ref={ref}>{formatter.format(value)}</span>;
}
