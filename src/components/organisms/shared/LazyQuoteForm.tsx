"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { QuoteMailValues } from "@/lib/mail-schema";

function FormPlaceholder() {
  return (
    <div
      className="min-h-[640px] rounded-3xl border border-earth-400/15 bg-white shadow-premium"
      aria-busy="true"
    />
  );
}

const QuoteForm = dynamic(
  () => import("@/components/organisms/shared/QuoteForm").then((mod) => mod.QuoteForm),
  { ssr: false, loading: FormPlaceholder },
);

/** Form kütüphaneleri (react-hook-form, zod) yalnızca form görünüme yaklaşınca indirilir. */
export function LazyQuoteForm({
  defaultType,
}: {
  defaultType?: QuoteMailValues["type"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? <QuoteForm defaultType={defaultType} /> : <FormPlaceholder />}
    </div>
  );
}
