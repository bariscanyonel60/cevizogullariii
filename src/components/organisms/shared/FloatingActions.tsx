"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUp, FileText, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { SITE, whatsappUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TOP_THRESHOLD = 480;

function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getShowTopSnapshot() {
  return window.scrollY > TOP_THRESHOLD;
}

function getShowTopServerSnapshot() {
  return false;
}

export function FloatingActions() {
  const showTop = useSyncExternalStore(
    subscribeScroll,
    getShowTopSnapshot,
    getShowTopServerSnapshot,
  );

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-2.5 md:bottom-8 md:right-8">
      <button
        type="button"
        aria-label="Yukarı çık"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-full border border-earth-400/20 bg-white text-forest-800 shadow-premium transition",
          showTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowUp className="size-4" />
      </button>

      <Link
        href="/teklif-al"
        aria-label="Teklif al"
        className="inline-flex size-11 items-center justify-center rounded-full bg-forest-800 text-white shadow-premium transition hover:bg-forest-700 hover:scale-[1.03] sm:hidden"
      >
        <FileText className="size-4" />
      </Link>

      <a
        href={SITE.phoneHref}
        aria-label="Telefon et"
        className="inline-flex size-11 items-center justify-center rounded-full bg-ink-950 text-white shadow-premium transition hover:scale-[1.03] hover:bg-ink-900"
      >
        <Phone className="size-4" />
      </a>

      <Link
        href={whatsappUrl(
          "Merhaba, Cevizoğulları Yapı Market hakkında bilgi almak istiyorum.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile yazın"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-premium-hover transition hover:scale-[1.03] hover:brightness-105"
      >
        <WhatsAppIcon className="size-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Link>
    </div>
  );
}
