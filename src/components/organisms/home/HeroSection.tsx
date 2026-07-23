"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { MouseGlow } from "@/components/organisms/shared/MouseGlow";
import { BUSINESS_AREAS } from "@/lib/constants";

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
        <Image
          src="/hero-home.jpg"
          alt="Modern mimari villa dış görünümü"
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
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.28em] text-gold-300 md:text-base">
                Cevizoğulları · Turhal / Tokat
              </p>
              <h1 className="font-display text-display font-bold tracking-tight text-white text-balance">
                Yapı market, orman ürünleri ve yapı-inşaat — tek marka
              </h1>
              <p className="mt-6 max-w-xl text-lead text-white/75">
                İnşaat malzemelerinden orman ürünlerine, bina inşaatına
                kadar premium tedarik ve güvenilir yerel hizmet.
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

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
            >
              {BUSINESS_AREAS.map((area, index) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/18"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={area.image}
                      alt={`${area.label} — Tokat Turhal`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                      sizes="64px"
                      priority={index === 0}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-white">
                      {area.label}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-white/65">
                      {area.description}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-gold-300 transition group-hover:translate-x-0.5" />
                </Link>
              ))}
            </motion.div>
          </div>
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
