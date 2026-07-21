"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { testimonials } from "@/data/content";

export function TestimonialsSection() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  });

  return (
    <section className="container-wide py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Müşteri Yorumları"
          title="Güven, kelimelerle doğrulanır"
          description="Birlikte çalıştığımız müşterilerimizin deneyimleri."
        />
      </Reveal>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="min-w-0 shrink-0 grow-0 basis-full rounded-3xl border border-earth-400/10 bg-white p-7 shadow-premium sm:basis-[80%] md:basis-[55%] lg:basis-[40%]"
            >
              <Quote className="size-8 text-gold-400" aria-hidden />
              <p className="mt-5 text-base leading-relaxed text-ink-700">
                “{item.quote}”
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-earth-400/10 pt-5">
                <div>
                  <p className="font-display font-semibold text-ink-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-ink-400">{item.role}</p>
                </div>
                <div className="flex gap-0.5" aria-label={`${item.rating} yıldız`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
