"use client";

import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { BRANDS } from "@/data/products";

export function BrandsMarquee() {
  const row = [...BRANDS, ...BRANDS];

  return (
    <section
      id="markalar"
      className="scroll-mt-28 overflow-hidden section-padding-sm"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Markalar"
            title="Güvenilir markalarla çalışıyoruz"
            description="Yapı marketimizde bilinen üreticilerin ürün gamı."
            align="center"
          />
        </Reveal>
      </div>
      <div className="relative mt-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ivory-50 to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-mist-100 to-transparent md:w-28" />
        <div className="flex overflow-hidden py-4">
          <div className="animate-marquee flex min-w-max gap-4">
            {row.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex h-20 min-w-[10.5rem] items-center justify-center rounded-2xl border border-earth-400/10 bg-white px-6 shadow-sm"
              >
                <span className="font-display text-sm font-semibold tracking-wide text-forest-800">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
