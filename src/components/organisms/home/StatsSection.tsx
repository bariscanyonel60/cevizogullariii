"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/molecules/Reveal";
import { stats } from "@/data/content";

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 gradient-forest" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.18),transparent_40%)]" />
      <div ref={ref} className="container-wide relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.id} delay={index * 0.06}>
            <div className="text-center text-white">
              <p className="font-display text-4xl font-bold md:text-5xl">
                {inView ? (
                  <CountUp end={stat.value} duration={2.2} separator="." />
                ) : (
                  0
                )}
                <span className="text-gold-300">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-white/65">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
