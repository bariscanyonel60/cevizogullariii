import Link from "next/link";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Button } from "@/components/atoms/Button";
import { SERVICE_AREA_CITIES } from "@/lib/seo";

const pillars = [
  {
    title: "Tokat & Turhal tedarik",
    text: "Yapı market stokumuzla boya, mantolama, yalıtım, çatı ve orman ürünlerinde yerel erişim sağlıyoruz.",
  },
  {
    title: "İlçe ve yakın illere sevkiyat",
    text: "Zile, Erbaa, Niksar, Pazar ile Amasya, Yozgat, Sivas, Çorum ve Samsun şantiyelerine planlı tedarik.",
  },
  {
    title: "Depreme hazır malzeme",
    text: "2026 deprem koşullarına uygun yapı yaklaşımıyla doğru ürün ve uygulama yönlendirmesi yapıyoruz.",
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
            eyebrow="Hizmet Bölgesi · GEO"
            title="Tokat yapı malzemeleri ve güvenli inşaat desteği"
            description="Turhal merkezli Cevizoğulları; Tokat ilçeleri ve yakın illerde yapı malzemesi, orman ürünleri ve yapı-inşaat desteği sunar."
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
                <h3 className="font-display text-xl font-semibold text-forest-900">
                  {item.title}
                </h3>
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
              <strong className="font-semibold text-ink-800">
                Tokat yapı malzemeleri
              </strong>
              ,{" "}
              <strong className="font-semibold text-ink-800">
                Turhal yapı market
              </strong>{" "}
              ve orman ürünleri / yapı-inşaat arayanlar için Cevizoğulları; boya,
              mantolama, yalıtım, çatı, OSB ve çimento gibi temel ürünleri tek
              çatı altında toplar.
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
