import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { processSteps } from "@/data/content";

export function ProcessSection() {
  return (
    <section id="surec" className="container-wide scroll-mt-28 section-padding">
      <Reveal>
        <SectionHeading
          eyebrow="Çalışma Sürecimiz"
          title="Keşiften teslimata"
          description="Şeffaf ve planlı tedarik süreci — her adımda net iletişim."
        />
      </Reveal>
      <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div
          className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent lg:block"
          aria-hidden
        />
        {processSteps.map((item, index) => (
          <Reveal key={item.step} delay={index * 0.08}>
            <li className="relative h-full rounded-3xl bg-white p-6 shadow-premium">
              <span className="relative z-10 grid size-12 place-items-center rounded-full bg-forest-800 font-display text-sm font-bold text-gold-300 shadow-premium">
                {item.step}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {item.description}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
