"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/molecules/Reveal";
import type { StatItem } from "@/types";

export function StatsSection({ stats = [] }: { stats?: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      id="istatistik"
      className="relative scroll-mt-28 overflow-hidden section-padding-sm"
    >
      <div className="absolute inset-0 gradient-forest" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(199,163,74,0.18),transparent_40%)]" />
      <div
        ref={ref}
        className="container-wide relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5"
      >
        {stats.map((stat, index) => (
          <Reveal key={stat.id} delay={index * 0.05}>
            <div className="text-center text-white">
              <p className="font-display text-3xl font-bold md:text-4xl lg:text-5xl">
                {inView ? (
                  <CountUp end={stat.value} duration={2.2} separator="." />
                ) : (
                  0
                )}
                <span className="text-gold-300">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/65 md:text-sm">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
