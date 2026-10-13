import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/atoms/JsonLd";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { brandHref, brandPages } from "@/lib/catalog";
import { getBrands, getProducts } from "@/lib/cms-store";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Markalar · Boya, Yalıtım ve Yapı Kimyasalları",
  description:
    "Cevizoğulları Turhal mağazasında bulunan boya, yalıtım, alçı ve çimento markaları ile bu markalara ait ürünler.",
  path: "/markalar",
});

export default async function BrandsPage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const pages = brandPages(brands, products);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Markalar", path: "/markalar" },
          ]),
          itemListJsonLd({
            path: "/markalar",
            name: "Markalar",
            items: pages.map((page) => ({
              name: page.name,
              path: brandHref(page.slug),
            })),
          }),
        ]}
      />
      <PageHero
        title="Markalar"
        description="Mağazamızda bulunan markalar ve bu markalara ait ürünler."
        crumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Markalar" }]}
      />
      <section className="container-wide py-12 md:py-16">
        {pages.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={brandHref(page.slug)}
                  className="group flex h-full items-start gap-4 rounded-3xl border border-earth-400/10 bg-white p-6 shadow-sm transition hover:border-forest-700/20 hover:shadow-premium"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-forest-800 font-display text-sm font-bold text-gold-300">
                    {page.name.slice(0, 2).toLocaleUpperCase("tr-TR")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 font-display text-lg font-semibold text-ink-900 group-hover:text-forest-800">
                      {page.name}
                      <ArrowUpRight className="size-4 opacity-60" aria-hidden />
                    </span>
                    {page.blurb && (
                      <span className="mt-1 block text-sm text-ink-500">
                        {page.blurb}
                      </span>
                    )}
                    <span className="mt-3 block text-xs font-semibold uppercase tracking-wider text-gold-600">
                      {page.products.length} ürün
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-ink-500">
            Marka listesi hazırlanıyor. Ürünler için{" "}
            <Link href="/yapi-malzemeleri" className="font-semibold text-forest-800 underline">
              kataloğa göz atın
            </Link>
            .
          </p>
        )}
      </section>
    </>
  );
}
