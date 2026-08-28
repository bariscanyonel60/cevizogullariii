"use client";

import Link from "next/link";
import { CdnImage } from "@/components/atoms/CdnImage";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { MouseGlow } from "@/components/organisms/shared/MouseGlow";

const trustItems = [
  "Stoklu yapı market",
  "Orman ürünleri & OSB",
  "Yapı - inşaat uygulamaları",
];

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 will-change-transform">
        <CdnImage
          src="/hero-home.jpg"
          alt="Tokat yapı malzemeleri — Turhal yapı market, dış cephe ve inşaat tedariki"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-110"
        />
      </div>

      <div className="absolute inset-0 gradient-hero-overlay" />
      <MouseGlow className="pointer-events-none absolute inset-0 mix-blend-soft-light" />

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <motion.div
          aria-hidden
          className="absolute -left-20 top-1/4 size-72 rounded-full bg-forest-500/25 blur-3xl"
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

      <div className="relative z-10 flex min-h-[100svh] items-end pb-16 pt-40 md:items-center md:pb-20 md:pt-44 lg:pt-40">
        <div className="container-wide w-full">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.28em] text-gold-300 md:text-base">
              Cevizoğulları · Turhal / Tokat
            </p>
            <h1 className="font-display text-display font-bold tracking-tight text-white text-balance">
              Tokat Yapı Malzemeleri
            </h1>
            <p className="mt-6 max-w-xl text-lead text-white/75">
              Tokat yapı malzemeleri, orman ürünleri ve yapı-inşaat için
              Turhal’dan stoklu tedarik — boya, mantolama ve şantiye
              ihtiyacında yerel, güvenilir hizmet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur"
                >
                  <CheckCircle2 className="size-3.5 text-gold-300" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <Link href="/teklif-al">Teklif Al</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/yapi-malzemeleri">Ürünleri Keşfet</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <a
        href="#istatistik"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60 transition hover:text-white"
        aria-label="Aşağı kaydır"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </a>
    </section>
  );
}
