"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** Subtle mouse-follow ambient glow for hero atmospheres. */
export function MouseGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      el.style.background = `radial-gradient(500px circle at ${x}% ${y}%, rgba(212,175,55,0.14), transparent 45%)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        background:
          "radial-gradient(500px circle at 30% 40%, rgba(212,175,55,0.12), transparent 45%)",
      }}
    />
  );
}
