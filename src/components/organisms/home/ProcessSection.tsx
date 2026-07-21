import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { processSteps } from "@/data/content";

export function ProcessSection() {
  return (
    <section className="container-wide py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Çalışma Sürecimiz"
          title="Hizmet sürecimizi inceleyin"
          description="Keşiften teslimata kadar şeffaf ve planlı bir tedarik süreci."
        />
      </Reveal>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((item, index) => (
          <Reveal key={item.step} delay={index * 0.08}>
            <div className="h-full rounded-3xl bg-white p-6 shadow-premium">
              <p className="font-display text-sm font-bold tracking-[0.2em] text-gold-600">
                {item.step}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
