import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { JsonLd } from "@/components/atoms/JsonLd";
import { ProductCard } from "@/components/molecules/ProductCard";
import { HomeFaqSection } from "@/components/organisms/home/HomeFaqSection";
import { PageHero } from "@/components/organisms/shared/PageHero";
import {
  brandHref,
  CATEGORY_LANDINGS,
  categoryHref,
  type BrandPage,
  type CategoryLanding,
} from "@/lib/catalog";
import { SITE, whatsappUrl } from "@/lib/constants";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import type { Product } from "@/types";

type Props = {
  landing: CategoryLanding;
  products: Product[];
  brands: BrandPage[];
  relatedCategories: { key: CategoryLanding["key"]; count: number }[];
};

export function CategoryLandingView({
  landing,
  products,
  brands,
  relatedCategories,
}: Props) {
  const path = categoryHref(landing.key);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path,
            name: landing.title,
            description: landing.description,
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Yapı Malzemeleri", path: "/yapi-malzemeleri" },
            { name: landing.name, path },
          ]),
          ...(products.length > 0
            ? [
                itemListJsonLd({
                  path,
                  name: `${landing.name} ürünleri`,
                  items: products.map((product) => ({
                    name: product.title,
                    path: `/yapi-malzemeleri/${product.slug}`,
                  })),
                }),
              ]
            : []),
          faqJsonLd(landing.faqs),
        ]}
      />
      <PageHero
        title={landing.name}
        description={landing.intro}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı Malzemeleri", href: "/yapi-malzemeleri" },
          { label: landing.name },
        ]}
      />

      <section
        id="urunler"
        aria-labelledby="kategori-urunler"
        className="container-wide scroll-mt-28 py-10 md:py-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="kategori-urunler"
            className="font-display text-2xl font-bold text-ink-900 md:text-3xl"
          >
            {landing.name} ürünleri
          </h2>
          <Link
            href="/yapi-malzemeleri#urunler"
            className="text-sm font-semibold text-forest-800 hover:underline"
          >
            Tüm ürünler
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-earth-400/15 bg-white p-8 text-center shadow-sm">
            <p className="font-display text-lg font-semibold text-ink-900">
              Bu kategorideki ürünler için teklif hazırlıyoruz
            </p>
            <p className="mx-auto mt-2 max-w-xl text-ink-500">
              Ürün listesi sitede yer almıyor; ihtiyacınızı paylaşın, güncel
              fiyat ve stok bilgisini iletelim.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/teklif-al">Teklif Al</Link>
              </Button>
              <Button asChild variant="secondary">
                <a href={SITE.phoneHref}>
                  <Phone className="size-4" aria-hidden />
                  Hemen Ara
                </a>
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="container-wide grid gap-6 pb-12 md:pb-16 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-display text-xl font-bold text-ink-900">
            Kullanım alanları
          </h2>
          <ul className="mt-4 space-y-3">
            {landing.uses.map((use) => (
              <li key={use} className="flex gap-3 text-ink-600">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-forest-700"
                  aria-hidden
                />
                {use}
              </li>
            ))}
          </ul>
        </div>
        {brands.length > 0 && (
          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-display text-xl font-bold text-ink-900">
              Bu kategorideki markalar
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={brandHref(brand.slug)}
                    className="inline-flex items-center gap-1 rounded-full border border-forest-800/15 px-4 py-2 text-sm font-semibold text-forest-800 transition hover:bg-forest-50"
                  >
                    {brand.name}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <HomeFaqSection
        faqs={landing.faqs}
        title={`${landing.name} hakkında`}
        description="Kısa yanıtlar; detay için bizi arayabilirsiniz."
      />

      {relatedCategories.length > 0 && (
        <nav
          aria-label="Diğer kategoriler"
          className="container-wide pb-12 md:pb-16"
        >
          <h2 className="mb-4 font-display text-xl font-bold text-ink-900">
            Diğer kategoriler
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedCategories.map(({ key, count }) => (
              <li key={key}>
                <Link
                  href={categoryHref(key)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm transition hover:text-forest-800"
                >
                  {CATEGORY_LANDINGS[key].name}
                  <span className="text-xs text-ink-400">{count}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/orman-urunleri"
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm transition hover:text-forest-800"
              >
                Orman Ürünleri
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <section className="container-wide pb-16 md:pb-24">
        <div className="flex flex-col gap-4 rounded-3xl bg-forest-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              {landing.name} için fiyat ve stok bilgisi
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Listenizi gönderin; Turhal mağazamızdan güncel bilgiyi iletelim.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={whatsappUrl(
                  `Merhaba, ${landing.name} ürünleri için güncel fiyat ve stok bilgisi almak istiyorum.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp&apos;tan Sor
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
