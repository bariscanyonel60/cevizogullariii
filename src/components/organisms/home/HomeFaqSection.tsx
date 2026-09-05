"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { cn } from "@/lib/utils";

export function HomeFaqSection({
  faqs = [],
}: {
  faqs?: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="sss" className="container-wide scroll-mt-28 section-padding">
      <Reveal>
        <SectionHeading
          eyebrow="SSS"
          title="Sık sorulanlar"
          description="Stok var mı, götürür müsünüz, mantolama nasıl — kısaca."
        />
      </Reveal>
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <Reveal key={faq.question} delay={index * 0.05}>
              <div className="overflow-hidden rounded-2xl border border-earth-400/15 bg-white/80">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                  aria-expanded={open}
                  onClick={() =>
                    setOpenIndex((current) => (current === index ? null : index))
                  }
                >
                  <span className="font-display text-base font-semibold text-ink-900 md:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-forest-800 transition",
                      open && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-earth-400/10 px-5 pb-5 pt-3 text-sm leading-relaxed text-ink-500 md:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
