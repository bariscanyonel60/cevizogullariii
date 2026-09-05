import Link from "next/link";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Button } from "@/components/atoms/Button";
import { SERVICE_AREA_CITIES } from "@/lib/seo";

const pillars = [
  {
    title: "Mağaza Turhal’da",
    text: "Boya, mantolama, yalıtım, çatı, kereste. Listeyle gelin, raftan toplarız.",
  },
  {
    title: "İlçeye de gider",
    text: "Zile, Erbaa, Niksar, Pazar. İsterseniz kendi aracımızla götürürüz.",
  },
  {
    title: "Yanlış ürün yok",
    text: "Kalınlık, astar, levha: ne işe gideceğini sorar, ona göre veririz.",
  },
] as const;

export function HomeLocalSeoSection() {
  return (
    <section
      id="bolge"
      className="scroll-mt-28 border-y border-earth-400/10 bg-forest-50/60 section-padding"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Nereden alınır"
            title="Tokat yapı malzemeleri Turhal’dan"
            description="İlçeye de gönderiyoruz; isterseniz kendi aracımızla."
          />
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {SERVICE_AREA_CITIES.map((city) => (
            <Link
              key={city}
              href="/tokat"
              className="rounded-full border border-forest-800/15 bg-white px-4 py-2 text-sm font-medium text-forest-800 transition hover:bg-forest-800 hover:text-white"
            >
              {city}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="h-full rounded-3xl border border-earth-400/15 bg-white/90 p-6 shadow-sm">
                <p className="font-display text-xl font-semibold text-forest-900">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-10 max-w-3xl space-y-4 text-sm leading-relaxed text-ink-500 md:text-base">
            <p>
              Tokat yapı malzemeleri Turhal’daki mağazadan çıkar: boya,
              mantolama, yalıtım, çatı, OSB, çimento. Turhal yapı malzemeleri
              stoku aynı yerde; listeyi getirin, raftan toplayıp yükleriz.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/tokat">Tokat & Bölge Rehberi</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/yapi-malzemeleri">Yapı Market Kataloğu</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
