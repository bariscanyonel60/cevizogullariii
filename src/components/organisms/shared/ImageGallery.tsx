"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl"
          onClick={() => setOpen(true)}
          aria-label="Galeri lightbox aç"
        >
          <Image
            src={images[active]}
            alt={`${alt} - görsel ${active + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </button>
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl ring-2 transition ${
                active === index ? "ring-forest-700" : "ring-transparent"
              }`}
              aria-label={`Görsel ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} - küçük görsel ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Görsel lightbox"
          >
            <button
              type="button"
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
            >
              <X className="size-5" />
            </button>
            <div className="relative h-[70vh] w-full max-w-5xl">
              <Image
                src={images[active]}
                alt={`${alt} büyük görsel`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
