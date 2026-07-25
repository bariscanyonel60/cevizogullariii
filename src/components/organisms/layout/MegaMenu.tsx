"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BUSINESS_AREAS, NAV_LINKS } from "@/lib/constants";
import { CATEGORY_SHOWCASE } from "@/data/products";
import { ORMAN_URUNLERI_PAGES } from "@/data/orman-urunleri";
import { cn } from "@/lib/utils";

type MegaMenuProps = {
  activeLabel: string | null;
  onClose: () => void;
};

const YAPI_MARKET_KEYS = new Set([
  "boya",
  "izolasyon",
  "cati",
  "cephe",
  "cimento",
  "siva",
  "nalbur",
  "demir",
  "boru",
]);

type MegaCard = {
  href: string;
  title: string;
  description: string;
  image: string;
};

function cardsForLabel(label: string): MegaCard[] {
  switch (label) {
    case "Yapı Market":
      return CATEGORY_SHOWCASE.filter((c) => YAPI_MARKET_KEYS.has(c.key))
        .slice(0, 6)
        .map((c) => ({
          href: `/yapi-malzemeleri?kategori=${c.key}#urunler`,
          title: c.label,
          description: c.description,
          image: c.image,
        }));
    case "Orman Ürünleri":
      return ORMAN_URUNLERI_PAGES.filter((p) => p.slug !== "index").map((p) => ({
        href: p.href,
        title: p.navLabel,
        description: p.description,
        image: p.image,
      }));
    case "Yapı - İnşaat":
      return [
        {
          href: "/yapi-insaat",
          title: "Konut & Bina İnşaatı",
          description:
            "Yeni konut ve bina projelerinde kaba-ince işler ve uygulama.",
          image: "/projects/modern-konut-cephe.jpg",
        },
        {
          href: "/projelerimiz",
          title: "Uygulama Örnekleri",
          description: "Dış cephe, şantiye ve konut uygulamalarından örnekler.",
          image: "/projects/modern-konut-bahce.jpg",
        },
        {
          href: "/teklif-al",
          title: "Proje Teklifi",
          description: "İnşaat ve uygulama ihtiyacınız için hızlı teklif.",
          image: "/about-project.jpg",
        },
      ];
    default: {
      const area = BUSINESS_AREAS.find((a) => a.label === label);
      if (!area) return [];
      return [
        {
          href: area.href,
          title: area.title,
          description: area.description,
          image: area.image,
        },
      ];
    }
  }
}

function hubHref(label: string) {
  const fromNav = NAV_LINKS.find((l) => l.label === label);
  if (fromNav) return fromNav.href;
  return BUSINESS_AREAS.find((a) => a.label === label)?.href ?? "/";
}

export function MegaMenu({ activeLabel, onClose }: MegaMenuProps) {
  const cards = activeLabel ? cardsForLabel(activeLabel) : [];
  const area = BUSINESS_AREAS.find((a) => a.label === activeLabel);

  return (
    <AnimatePresence>
      {activeLabel && cards.length > 0 && (
        <motion.div
          key={activeLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full z-50 pt-3"
          onMouseLeave={onClose}
        >
          <div className="container-wide">
            <div className="overflow-hidden rounded-3xl border border-earth-400/15 bg-ivory-50/95 p-4 shadow-premium backdrop-blur-xl md:p-5">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                    {activeLabel}
                  </p>
                  <p className="mt-1 max-w-xl text-sm text-ink-500">
                    {area?.description}
                  </p>
                </div>
                <Link
                  href={hubHref(activeLabel)}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 transition hover:text-forest-700"
                >
                  Tümünü gör
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>

              <div
                className={cn(
                  "grid gap-3",
                  cards.length <= 2
                    ? "md:grid-cols-2"
                    : cards.length === 3
                      ? "md:grid-cols-3"
                      : "sm:grid-cols-2 lg:grid-cols-4",
                )}
              >
                {cards.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    onClick={onClose}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-earth-400/10 bg-white",
                      "transition hover:-translate-y-0.5 hover:shadow-premium-hover",
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={card.image}
                        alt={`${card.title} — Tokat Turhal Cevizoğulları`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/25 to-transparent" />
                      <span className="absolute bottom-3 left-3 font-display text-base font-semibold text-white md:text-lg">
                        {card.title}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 p-3.5">
                      <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
                        {card.description}
                      </p>
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-forest-800 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
