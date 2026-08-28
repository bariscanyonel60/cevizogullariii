import type { Metadata } from "next";
import Link from "next/link";
import { FileText, PaintBucket, Shield, Home } from "lucide-react";
import { CdnImage } from "@/components/atoms/CdnImage";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ProductFilters } from "@/components/organisms/shared/ProductFilters";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { PRODUCT_CATEGORY_LABELS } from "@/data/products";
import {
  getBrands,
  getCategoryShowcase,
  getExteriorPackage,
  getProducts,
} from "@/lib/cms-store";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import type { ProductCategory } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Tokat Yapı Malzemeleri · Turhal Yapı Market Ürünleri",
  description:
    "Permolit dış cephe boyası, mantolama, yalıtım, çatı, OSB ve yapı malzemeleri. Turhal / Tokat stoklu tedarik — Cevizoğulları Yapı Market.",
  path: "/yapi-malzemeleri",
  keywords: [
    "Tokat yapı malzemeleri",
    "Turhal yapı market",
    "Tokat mantolama",
    "Turhal boya",
    "Tokat OSB",
    "Tokat yalıtım",
  ],
});

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ kategori?: string }>;
};

function parseCategory(
  value: string | undefined,
): "" | ProductCategory {
  if (!value) return "";
  return value in PRODUCT_CATEGORY_LABELS
    ? (value as ProductCategory)
    : "";
}

export default async function ProductsPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const initialCategory = parseCategory(kategori);
  const [products, brands, showcase, exterior] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategoryShowcase(),
    getExteriorPackage(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/yapi-malzemeleri",
            name: "Tokat Yapı Malzemeleri · Turhal Yapı Market",
            description:
              "Permolit boya, mantolama, yalıtım, çatı ve yapı malzemeleri — Turhal / Tokat.",
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Yapı Market", path: "/yapi-malzemeleri" },
          ]),
          itemListJsonLd({
            path: "/yapi-malzemeleri",
            name: "Yapı malzemesi kategorileri",
            items: showcase.map((c) => ({
              name: c.label,
              path: `/yapi-malzemeleri?kategori=${c.key}`,
            })),
          }),
        ]}
      />
      <PageHero
        title="Yapı Malzemeleri & Ürünler"
        description="Evinizin dışı için boyadan mantolamaya, çatıdan sıvaya kadar her şey. Permolit ve diğer büyük markalar — Tokat / Turhal stok."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı Market" },
        ]}
      />

      <section className="container-wide py-12 md:py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-900 via-forest-800 to-earth-700 px-6 py-10 text-white md:px-10 md:py-12">
            <div className="pointer-events-none absolute -right-16 top-0 size-64 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  <Home className="size-4" aria-hidden />
                  Evin dışı için komple çözüm
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-balance">
                  Duvar boyasından mantolamaya — dış cephe paketiniz hazır
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                  Astar, Permolit dış cephe boyası, EPS/XPS, file, sıva, membran ve
                  oluk… Tadilat veya yeni yapıda ihtiyacınız olan malzemeleri tek
                  noktadan temin edin.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="gold">
                    <a href="#urunler">Ürünlere Git</a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/teklif-al">Dış Cephe Teklifi Al</Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {exterior.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="font-display text-sm font-semibold text-gold-300">
                      {step.title}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-white/70">
                      {step.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-wide pb-8">
        <Reveal>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Markalar
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink-900">
                Büyük firmaların ürünlerini kullanıyoruz
              </h2>
            </div>
            <PaintBucket className="hidden size-8 text-forest-700 sm:block" aria-hidden />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <a
                key={brand.name}
                href="#urunler"
                className="flex items-start gap-3 rounded-2xl border border-earth-400/10 bg-white p-5 shadow-sm transition hover:border-forest-700/20 hover:shadow-premium"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-800 font-display text-sm font-bold text-gold-300">
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
                <span>
                  <span className="block font-display font-semibold text-ink-900">
                    {brand.name}
                  </span>
                  <span className="mt-1 block text-sm text-ink-500">
                    {brand.blurb}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-wide py-10">
        <Reveal>
          <div className="mb-8 flex items-center gap-2">
            <Shield className="size-5 text-forest-700" aria-hidden />
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Kategoriler
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {showcase.map((cat) => (
              <a
                key={cat.key}
                href={`?kategori=${cat.key}#urunler`}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-premium transition hover:-translate-y-1 hover:shadow-premium-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CdnImage
                    src={cat.image}
                    alt={`${cat.label} kategorisi — Tokat Turhal yapı malzemeleri`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-display text-lg font-semibold text-white">
                      {cat.label}
                    </p>
                    <p className="mt-1 text-xs text-white/75">{cat.description}</p>
                    <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-gold-300">
                      Ürünleri gör →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-wide pb-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-forest-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                Katalog & toplu teklif
              </h2>
              <p className="mt-1 text-sm text-white/65">
                Permolit boya, mantolama seti veya şantiye listesi için hemen
                teklif alın.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/iletisim">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="urunler" className="container-wide scroll-mt-28 pb-16 md:pb-24">
        <ProductFilters items={products} initialCategory={initialCategory} />
      </section>
    </>
  );
}
