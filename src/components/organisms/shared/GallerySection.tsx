"use client";

import { CdnImage } from "@/components/atoms/CdnImage";
import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import type { MediaItem } from "@/lib/media-types";

type GallerySectionProps = {
  items: MediaItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
};

export function GallerySection({
  items,
  eyebrow = "Galeri",
  title,
  description,
  id = "galeri",
}: GallerySectionProps) {
  const [active, setActive] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section id={id} className="container-wide scroll-mt-28 py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </Reveal>

      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={Math.min(index, 6) * 0.05}>
            <button
              type="button"
              onClick={() => setActive(index)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left focus-visible:outline-none"
              aria-label={`${item.alt} — büyüt`}
            >
              <div className="relative aspect-4/5 overflow-hidden bg-mist-100">
                <CdnImage
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {item.title || item.alt}
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && items[active] && (
          <motion.div
            className="fixed inset-0 z-80 flex items-center justify-center bg-ink-950/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Galeri lightbox"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white"
              onClick={() => setActive(null)}
              aria-label="Kapat"
            >
              <X className="size-5" />
            </button>
            <div
              className="flex h-[82vh] w-full max-w-5xl flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1">
                <CdnImage
                  src={items[active].url}
                  alt={items[active].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              {items[active].title || items[active].alt ? (
                <div className="pt-4 text-center">
                  {items[active].title ? (
                    <p className="font-display text-lg font-semibold text-white">
                      {items[active].title}
                    </p>
                  ) : null}
                  {items[active].alt &&
                  items[active].alt !== items[active].title ? (
                    <p className="mt-1 text-sm text-white/70">
                      {items[active].alt}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
