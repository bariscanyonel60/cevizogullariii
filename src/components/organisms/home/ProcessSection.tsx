import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

export function ProcessSection({
  steps = [],
}: {
  steps?: { step: string; title: string; description: string }[];
}) {
  return (
    <section id="surec" className="container-wide scroll-mt-28 section-padding">
      <Reveal>
        <SectionHeading
          eyebrow="Nasıl çalışırız"
          title="Listeden yüke, raftan şantiyeye"
          description="WhatsApp, mağaza veya teklif formu — stok söylenir, yük hazırlanır, teslim netleşir."
        />
      </Reveal>
      <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div
          className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent lg:block"
          aria-hidden
        />
        {steps.map((item, index) => (
          <Reveal key={item.step} delay={index * 0.08}>
            <li className="relative h-full rounded-3xl bg-white p-6 shadow-premium">
              <span className="relative z-10 grid size-12 place-items-center rounded-full bg-forest-800 font-display text-sm font-bold text-gold-300 shadow-premium">
                {item.step}
              </span>
              <p className="mt-5 font-display text-lg font-semibold text-ink-900">
                {item.title}
              </p>
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
