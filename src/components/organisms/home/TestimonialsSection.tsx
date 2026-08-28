"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import type { Testimonial } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSection({
  testimonials = [],
}: {
  testimonials?: Testimonial[];
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    axis: "x",
    loop: true,
    skipSnaps: false,
    watchDrag: true,
  });

  return (
    <section
      id="yorumlar"
      className="container-wide scroll-mt-28 section-padding"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Sahadan"
          title="Şantiye ve tadilattan dönen sözler"
          description="Turhal mağazasından malzeme alan usta, müteahhit ve ev sahiplerinin anlattıkları."
        />
      </Reveal>
      <div
        className="overflow-hidden"
        ref={emblaRef}
        style={{ touchAction: "pan-y pinch-zoom" }}
      >
        <div className="flex gap-5">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="min-w-0 shrink-0 grow-0 basis-full rounded-3xl border border-earth-400/10 bg-white p-7 shadow-premium sm:basis-[80%] md:basis-[55%] lg:basis-[40%]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="grid size-12 place-items-center rounded-full bg-forest-800 font-display text-sm font-bold text-gold-300"
                    aria-hidden
                  >
                    {initials(item.name)}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-ink-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-ink-400">{item.role}</p>
                  </div>
                </div>
                <Quote className="size-7 text-gold-400" aria-hidden />
              </div>
              <div
                className="mt-4 flex gap-0.5"
                aria-label={`${item.rating} yıldız`}
              >
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-gold-400 text-gold-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-ink-700">
                “{item.quote}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
