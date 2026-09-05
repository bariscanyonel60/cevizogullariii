import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Layers,
  Store,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

const SERVICE_ICONS: { match: string; icon: LucideIcon }[] = [
  { match: "orman", icon: Trees },
  { match: "yalıtım", icon: Layers },
  { match: "yalitim", icon: Layers },
  { match: "cephe", icon: Layers },
  { match: "inşaat", icon: Building2 },
  { match: "insaat", icon: Building2 },
  { match: "market", icon: Store },
];

function serviceIcon(title: string, href: string): LucideIcon {
  const haystack = `${title} ${href}`.toLowerCase();
  const found = SERVICE_ICONS.find((entry) => haystack.includes(entry.match));
  return found?.icon ?? Store;
}

export function ServicesSection({
  services = [],
}: {
  services?: { title: string; description: string; href: string }[];
}) {
  if (services.length === 0) return null;

  return (
    <section
      id="hizmetler"
      className="container-wide scroll-mt-28 py-20 md:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Üç iş, tek adres"
          title="Yapı market, kereste, inşaat"
          description="Reyon, kereste ve saha. Boyadan OSB’ye, listeden şantiyeye."
        />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service, index) => {
          const Icon = serviceIcon(service.title, service.href);
          return (
            <Reveal key={service.title} delay={index * 0.06}>
              <Link
                href={service.href}
                className="group flex h-full min-h-52 flex-col justify-between gap-8 rounded-[1.75rem] bg-forest-950 p-7 text-white transition duration-300 hover:bg-forest-900 md:min-h-64 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-white">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 transition group-hover:border-gold-400/50 group-hover:bg-gold-400/10">
                    <ArrowUpRight className="size-5 text-gold-300" />
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                    {service.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={0.16}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild variant="gold">
            <Link href="/teklif-al">Teklif Al</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/yapi-malzemeleri">Yapı Market</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
