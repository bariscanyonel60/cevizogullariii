import type { Metadata } from "next";
import { CdnImage } from "@/components/atoms/CdnImage";
import Link from "next/link";
import { Building2, HardHat, Layers, Ruler } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { JsonLd } from "@/components/atoms/JsonLd";
import { getFeaturedProjects } from "@/lib/cms-store";
import { getPublicMedia } from "@/lib/media-store";
import { GallerySection } from "@/components/organisms/shared/GallerySection";
import { SiteVideoSection } from "@/components/organisms/shared/SiteVideoSection";
import { YAPI_INSAAT_VIDEO } from "@/data/yapi-insaat-media";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Konut ve Bina İnşaatı · Tokat Turhal",
  description:
    "Tokat ve Turhal’da konut, bina ve dış cephe uygulaması. Cevizoğulları Yapı-İnşaat ile sahadan teslime.",
  path: "/yapi-insaat",
  keywords: [
    "Tokat inşaat",
    "Turhal bina inşaatı",
    "Tokat konut inşaatı",
    "Turhal dış cephe",
    "Tokat yapı inşaat",
  ],
});

export const revalidate = 60;

const SERVICES = [
  {
    icon: Building2,
    title: "Konut & kaba-ince",
    text: "Temel üstü kaba iş, cephe ve bitiş. Malzeme listesini reyonla eşleştirip sahaya bağlarız.",
  },
  {
    icon: Layers,
    title: "Dış cephe & mantolama",
    text: "EPS/XPS, file, dübel, sıva ve Permolit. Tokat kışına göre kalınlık; yağmura göre boya sistemi.",
  },
  {
    icon: HardHat,
    title: "Şantiye uygulaması",
    text: "İskele, tempo ve malzeme sırası. Usta beklemeyecek şekilde palet ve günlük kalem planlanır.",
  },
  {
    icon: Ruler,
    title: "Tadilat & yenileme",
    text: "Mevcut evde boya, yalıtım, çatı ve iç mekan. Metrekareye göre malzeme; fazla kova almayın.",
  },
] as const;

export default async function YapiInsaatPage() {
  const featured = (await getFeaturedProjects()).slice(0, 6);
  const { items: galleryItems } = await getPublicMedia("yapi-insaat");

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
        description="Konut, cephe, tadilat. Malzeme ve saha aynı ekipten."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı - İnşaat" },
        ]}
      />

      <section className="container-wide py-10 md:py-14">
        <Reveal>
          <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-earth-400/10 bg-white shadow-premium lg:grid-cols-2">
            <div className="relative min-h-64 lg:min-h-full">
              <CdnImage
                src="/media/yapi-insaat/ova-apt-3.jpg"
                alt="CVZ Yapı İnşaat Ova Apt. 3 — teslim edilmiş konut cephesi, Turhal / Tokat"
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
                Konut ve cepheyi yerinde kuruyoruz
              </h2>
              <p className="text-ink-500 leading-relaxed">
                Cevizoğulları Yapı - İnşaat, Turhal yapı marketinin saha koludur.
                Ova Apt. 3 bitti. Kaba iş ve ince iş kareleri de bu sayfada.
                Malzeme raftan çıkar, ekip duvara koyar.
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
              Ne iş alıyoruz?
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

      <SiteVideoSection
        src={YAPI_INSAAT_VIDEO.src}
        poster={YAPI_INSAAT_VIDEO.poster}
        title={YAPI_INSAAT_VIDEO.title}
        description={YAPI_INSAAT_VIDEO.description}
      />

      <GallerySection
        id="santiye-galeri"
        items={galleryItems}
        eyebrow="Şantiye galerisi"
        title="Uygulama ve saha görselleri"
        description="Ova Apt. 3, villa cephe, ahşap kalıp, temel beton ve iç kapı bitişi — CVZ Yapı İnşaat sahasından güncel kareler."
      />

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
