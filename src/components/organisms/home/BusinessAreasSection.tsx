"use client";

import { CdnImage } from "@/components/atoms/CdnImage";
import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Button } from "@/components/atoms/Button";
import { BUSINESS_AREAS } from "@/lib/constants";

function TiltCard({
  area,
  index,
}: {
  area: (typeof BUSINESS_AREAS)[number];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const transform = useMotionTemplate`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -8);
    rotateY.set((px - 0.5) * 8);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <Reveal delay={index * 0.08}>
      <motion.a
        ref={ref}
        href={area.href}
        style={{ transform }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative block h-full min-h-[28rem] overflow-hidden rounded-[1.75rem] shadow-premium will-change-transform"
      >
        <CdnImage
          src={area.image}
          alt={
            area.href === "/yapi-malzemeleri"
              ? `Tokat yapı malzemeleri — ${area.title}, Turhal Cevizoğulları`
              : area.href === "/yapi-insaat"
                ? "CVZ Yapı İnşaat Ova Apt. 3 — Tokat Turhal konut inşaatı"
                : `${area.title} — Tokat Turhal Cevizoğulları iş alanı`
          }
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            İş Alanı
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
            {area.title}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            {area.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
            Keşfet
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </motion.a>
    </Reveal>
  );
}

export function BusinessAreasSection() {
  return (
    <section
      id="is-alanlari"
      className="container-wide scroll-mt-28 section-padding"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Ne iş yaparız"
          title="Tokat yapı malzemeleri, kereste, inşaat"
          description="Keresteden konuta, cepheden şantiyeye — hepsi aynı kapıdan."
          action={
            <Button asChild variant="secondary">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
          }
        />
      </Reveal>
      <div className="grid gap-5 lg:grid-cols-3">
        {BUSINESS_AREAS.map((area, index) => (
          <TiltCard key={area.href} area={area} index={index} />
        ))}
      </div>
    </section>
  );
}
