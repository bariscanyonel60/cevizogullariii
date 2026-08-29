import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

export function ServicesSection({
  services = [],
}: {
  services?: { title: string; description: string; href: string }[];
}) {
  return (
    <section
      id="hizmetler"
      className="container-wide scroll-mt-28 py-20 md:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Üç iş, tek adres"
          title="Yapı market, orman ürünleri, inşaat"
          description="Tokat ve Turhal’da boya-yalıtımdan OSB’ye, konut cephesinden şantiye listesine kadar aynı çatı."
        />
      </Reveal>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={index * 0.06}>
            <Link
              href={service.href}
              className="group flex h-full items-start justify-between gap-6 rounded-3xl bg-forest-950 p-7 text-white transition duration-300 hover:bg-forest-900 md:p-8"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                  0{index + 1}
                </p>
                <p className="mt-3 font-display text-2xl font-semibold text-white">
                  {service.title}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                  {service.description}
                </p>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 transition group-hover:border-gold-400/50 group-hover:bg-gold-400/10">
                <ArrowUpRight className="size-5 text-gold-300" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
