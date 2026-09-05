import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";

export function ContactCta() {
  return (
    <section id="iletisim-cta" className="container-wide scroll-mt-28 pb-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-900 via-forest-800 to-earth-700 px-8 py-14 text-white md:px-14 md:py-16">
          <div className="pointer-events-none absolute -right-10 top-0 size-64 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              İletişim
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-balance">
              Listeyi atın, stok ve fiyatı söyleyelim
            </h2>
            <p className="mt-4 text-white/70">
              Tokat yapı malzemeleri listenizi yazın: boya, mantolama, OSB,
              kereste. Turhal yapı malzemeleri stokuna bakıp fiyatı söyleriz;
              isterseniz arabayla götürürüz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href="/teklif-al">Teklif Al</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/iletisim">İletişime Geç</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
