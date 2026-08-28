"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/** Lenis içerik yüksekliği yenileme (resize / lazy load sonrası) */
function LenisResizeBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const refresh = () => {
      lenis.resize();
    };

    refresh();
    const timer = window.setTimeout(refresh, 400);
    const timer2 = window.setTimeout(refresh, 1200);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(timer2);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      ro.disconnect();
    };
  }, [lenis]);

  // Menü kilidi sonrası Lenis’in takılı kalmasını önle
  useEffect(() => {
    if (!lenis) return;

    const ensureRunning = () => {
      if (document.body.dataset.mobileNav === "open") return;
      if (document.documentElement.classList.contains("lenis-stopped")) {
        lenis.start();
        lenis.resize();
      }
    };

    ensureRunning();
    const observer = new MutationObserver(ensureRunning);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-mobile-nav", "style"],
    });
    return () => observer.disconnect();
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
        autoResize: true,
      }}
    >
      <LenisResizeBridge />
      {children}
    </ReactLenis>
  );
}
