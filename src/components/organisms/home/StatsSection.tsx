import { CountUpValue } from "@/components/atoms/CountUpValue";
import { Reveal } from "@/components/molecules/Reveal";
import { cn } from "@/lib/utils";
import type { StatItem } from "@/types";
import "./StatsSection.css";

export function StatsSection({ stats = [] }: { stats?: StatItem[] }) {
  if (stats.length === 0) return null;

  return (
    <section id="istatistik" className="home-stats" aria-label="Rakamlarla Cevizoğulları">
      <div className="home-stats-line" aria-hidden />
      <div className="home-stats-glow" aria-hidden />
      <div className="home-stats-grain" aria-hidden />

      <div className="container-wide home-stats-inner">
        <div className="home-stats-grid">
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
                  <p className="home-stats-index" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="home-stats-value">
                    <CountUpValue value={stat.value} />
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
