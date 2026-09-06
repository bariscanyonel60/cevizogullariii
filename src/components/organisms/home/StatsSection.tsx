"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/molecules/Reveal";
import { cn } from "@/lib/utils";
import type { StatItem } from "@/types";
import "./StatsSection.css";

export function StatsSection({ stats = [] }: { stats?: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18%" });

  return (
    <section id="istatistik" className="home-stats">
      <div className="home-stats-line" aria-hidden />
      <div className="home-stats-glow" aria-hidden />
      <div className="home-stats-grain" aria-hidden />

      <div className="container-wide home-stats-inner">
        <div ref={ref} className="home-stats-grid">
          {stats.map((stat, index) => {
            const lastOdd =
              stats.length % 2 === 1 && index === stats.length - 1;
            return (
              <Reveal key={stat.id} delay={index * 0.06} className="min-w-0">
                <article
                  className={cn(
                    "home-stats-card",
                    index > 0 && "is-split",
                    lastOdd && "is-wide",
                  )}
                >
                  <p className="home-stats-index">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="home-stats-value">
                    {inView ? (
                      <CountUp end={stat.value} duration={2.2} separator="." />
                    ) : (
                      0
                    )}
                    <span className="home-stats-suffix">{stat.suffix}</span>
                  </p>
                  <p className="home-stats-label">{stat.label}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
