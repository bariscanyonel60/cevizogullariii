import { ShieldCheck, Layers, Gem, Compass } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

const icons = [ShieldCheck, Layers, Gem, Compass];

export function WhyUsSection({
  items = [],
}: {
  items?: { title: string; description: string }[];
}) {
  return (
    <section id="neden-biz" className="relative scroll-mt-28 overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-forest-50/80 via-transparent to-transparent" />
      <div className="container-wide relative">
        <Reveal>
          <SectionHeading
            eyebrow="Neden Cevizoğulları?"
            title="Turhal’da yapı market gibi çalışan bir tedarikçi"
            description="Reyon, stok ve şantiye teslimatı aynı yerde. Usta, müteahhit ve ev sahibine pratik çözüm."
          />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[index] ?? ShieldCheck;
            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-3xl border border-earth-400/10 bg-white/80 p-6 shadow-premium transition duration-300 hover:-translate-y-1 hover:shadow-premium-hover">
                  <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-forest-800 text-gold-300">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
