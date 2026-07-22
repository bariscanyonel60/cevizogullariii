"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BUSINESS_AREAS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full z-50 pt-3"
          onMouseLeave={onClose}
        >
          <div className="container-wide">
            <div className="overflow-hidden rounded-3xl border border-earth-400/15 bg-ivory-50/95 p-4 shadow-premium backdrop-blur-xl md:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {BUSINESS_AREAS.map((area) => (
                  <Link
                    key={area.href}
                    href={area.href}
                    onClick={onClose}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-earth-400/10 bg-white",
                      "transition hover:-translate-y-0.5 hover:shadow-premium-hover",
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={area.image}
                        alt={`${area.title} — Tokat Turhal Cevizoğulları`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 30vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/25 to-transparent" />
                      <span className="absolute bottom-3 left-3 font-display text-lg font-semibold text-white">
                        {area.title}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 p-4">
                      <p className="text-sm leading-relaxed text-ink-500">
                        {area.description}
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
