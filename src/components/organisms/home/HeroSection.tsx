"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { MouseGlow } from "@/components/organisms/shared/MouseGlow";
import { Parallax } from "@/components/organisms/shared/Parallax";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Parallax speed={0.15} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2400&q=80"
          alt="Modern mimari villa dış görünümü"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-110"
        />
      </Parallax>

      <div className="absolute inset-0 gradient-hero-overlay" />
      <MouseGlow className="pointer-events-none absolute inset-0 mix-blend-soft-light" />

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <motion.div
          aria-hidden
          className="absolute -left-20 top-1/4 size-72 rounded-full bg-forest-500/30 blur-3xl"
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-1/4 right-0 size-80 rounded-full bg-gold-400/20 blur-3xl"
          animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-end pb-24 pt-32 md:items-center md:pb-0">
        <div className="container-wide w-full">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.28em] text-gold-300 md:text-base">
              Cevizoğulları
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              Profesyonel yapı malzemeleri & inşaat tedariki
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Turhal’da orman ürünleri, nalbur ve inşaat ihtiyaçlarınız için
              güvenilir çözüm ortağınız. Kaliteli ürün, uygun fiyat ve yılların
              tecrübesi.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <Link href="/projelerimiz">İncele</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/iletisim">İletişime Geç</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <a
        href="#kurumsal"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition hover:text-white"
        aria-label="Aşağı kaydır"
      >
        <span className="text-[11px] uppercase tracking-[0.2em]">Keşfet</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </a>
    </section>
  );
}
