"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUp, FileText, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { SITE, whatsappUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TOP_THRESHOLD = 480;
const WHATSAPP_MESSAGE =
  "Merhaba, Cevizoğulları Yapı Market hakkında bilgi almak istiyorum.";

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

function subscribeMobileNav(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-mobile-nav"],
  });
  return () => observer.disconnect();
}

function getMobileNavOpenSnapshot() {
  return document.body.dataset.mobileNav === "open";
}

function getMobileNavOpenServerSnapshot() {
  return false;
}

export function FloatingActions() {
  const showTop = useSyncExternalStore(
    subscribeScroll,
    getShowTopSnapshot,
    getShowTopServerSnapshot,
  );
  const menuOpen = useSyncExternalStore(
    subscribeMobileNav,
    getMobileNavOpenSnapshot,
    getMobileNavOpenServerSnapshot,
  );

  if (menuOpen) return null;

  return (
    <>
      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-70 flex flex-col items-end gap-2.5 md:bottom-8 md:right-8">
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

        <a
          href={SITE.phoneHref}
          aria-label="Telefon et"
          className="hidden size-11 items-center justify-center rounded-full bg-ink-950 text-white shadow-premium transition hover:scale-[1.03] hover:bg-ink-900 md:inline-flex"
        >
          <Phone className="size-4" />
        </a>

        <Link
          href={whatsappUrl(WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp ile yazın"
          className="hidden items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-premium-hover transition hover:scale-[1.03] hover:brightness-105 md:inline-flex"
        >
          <WhatsAppIcon className="size-5" />
          WhatsApp
        </Link>
      </div>

      <nav
        aria-label="Hızlı iletişim"
        className="fixed inset-x-0 bottom-0 z-70 grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-t border-earth-400/15 bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(12,31,16,0.08)] backdrop-blur-md md:hidden"
      >
        <a
          href={SITE.phoneHref}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-forest-800 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          <Phone className="size-4" aria-hidden />
          Hemen Ara
        </a>
        <a
          href={whatsappUrl(WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </a>
        <Link
          href="/teklif-al"
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-forest-800/20 bg-forest-50 text-sm font-semibold text-forest-800 transition active:scale-[0.98]"
        >
          <FileText className="size-4" aria-hidden />
          Teklif
        </Link>
      </nav>
    </>
  );
}
