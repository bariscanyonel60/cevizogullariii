import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, HardHat, Layers, Ruler } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { JsonLd } from "@/components/atoms/JsonLd";
import { getFeaturedProjects } from "@/data/projects";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Yapı - İnşaat · Konut & Bina İnşaatı | Tokat Turhal",
  description:
    "Tokat ve Turhal’da konut, bina ve dış cephe inşaatı. Cevizoğulları Yapı - İnşaat ile sahadan bitişe güvenilir uygulama.",
  path: "/yapi-insaat",
  keywords: [
    "Tokat inşaat",
    "Turhal bina inşaatı",
    "Tokat konut inşaatı",
    "Turhal dış cephe",
    "Tokat yapı inşaat",
  ],
});

const SERVICES = [
  {
    icon: Building2,
    title: "Konut & Bina İnşaatı",
    text: "Yeni konut ve çok katlı bina projelerinde kaba-ince işler, cephe ve bitiş uygulamaları.",
  },
  {
    icon: Layers,
    title: "Dış Cephe & Mantolama",
    text: "Isı yalıtımı, sıva ve boya sistemleriyle uzun ömürlü, enerji verimli cephe çözümleri.",
  },
  {
    icon: HardHat,
    title: "Şantiye Uygulama",
    text: "Saha organizasyonu, doğru malzeme seçimi ve uygulama temposuna uygun ilerleme.",
  },
  {
    icon: Ruler,
    title: "Tadilat & Güçlendirme",
    text: "Mevcut yapılarda yenileme, güçlendirme ve detay odaklı tadilat desteği.",
  },
] as const;

export default function YapiInsaatPage() {
  const featured = getFeaturedProjects().slice(0, 6);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/yapi-insaat",
            name: "Yapı - İnşaat · Tokat Turhal",
            description:
              "Tokat / Turhal’da konut ve bina inşaatı, dış cephe ve şantiye uygulamaları.",
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Yapı - İnşaat", path: "/yapi-insaat" },
          ]),
          itemListJsonLd({
            path: "/yapi-insaat",
            name: "Yapı - İnşaat hizmetleri",
            items: SERVICES.map((s) => ({
              name: s.title,
              path: "/yapi-insaat",
            })),
          }),
        ]}
      />
      <PageHero
        title="Yapı - İnşaat"
        description="Konut ve bina inşa ediyoruz. Turhal / Tokat’ta sahadan bitişe güvenilir yapı uygulamaları."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı - İnşaat" },
        ]}
      />

      <section className="container-wide py-10 md:py-14">
        <Reveal>
          <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-earth-400/10 bg-white shadow-premium lg:grid-cols-2">
            <div className="relative min-h-64 lg:min-h-full">
              <Image
                src="/projects/modern-konut-cephe.jpg"
                alt="Tokat Turhal konut inşaatı — Cevizoğulları Yapı İnşaat"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="space-y-5 p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                İnşaat & Uygulama
              </p>
              <h2 className="font-display text-3xl font-bold text-ink-900 md:text-4xl">
                Konut ve bina inşa ediyoruz
              </h2>
              <p className="text-ink-500 leading-relaxed">
                Cevizoğulları Yapı - İnşaat olarak Tokat ve Turhal’da konut,
                bina ve dış cephe uygulamaları gerçekleştiriyoruz. Malzeme
                tedarikinden saha uygulamasına kadar süreci birlikte yönetiriz.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <Link href="/teklif-al">Proje Teklifi Al</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/projelerimiz">Uygulama Örnekleri</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-wide pb-12 md:pb-16">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              Hizmetler
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink-900">
              Ne inşa ediyoruz?
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <article className="h-full rounded-3xl border border-earth-400/10 bg-white p-5 shadow-sm">
                <service.icon
                  className="size-8 text-forest-800"
                  aria-hidden
                />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {service.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-wide pb-16 md:pb-24">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Sahadan
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink-900">
                Seçilmiş uygulamalar
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link href="/projelerimiz">Tüm projeler</Link>
            </Button>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.06}>
              <ProjectCard project={project} tall={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
