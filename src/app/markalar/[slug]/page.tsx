import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { JsonLd } from "@/components/atoms/JsonLd";
import { ProductCard } from "@/components/molecules/ProductCard";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { PRODUCT_CATEGORY_LABELS } from "@/data/products";
import { brandHref, brandPages, categoryHref } from "@/lib/catalog";
import { getBrands, getProducts } from "@/lib/cms-store";
import { whatsappUrl } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";
import type { ProductCategory } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

async function findBrand(slug: string) {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  return brandPages(brands, products).find((page) => page.slug === slug);
}

export async function generateStaticParams() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  return brandPages(brands, products).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await findBrand(slug);
  if (!brand) {
    return buildMetadata({
      title: "Marka bulunamadı",
      description: "Aradığınız marka bulunamadı.",
      path: "/markalar",
      noIndex: true,
    });
  }
  const blurb = brand.blurb ? `${brand.blurb}. ` : "";
  return buildMetadata({
    title: `${brand.name} Ürünleri · Turhal`,
    description: `${blurb}Cevizoğulları Turhal mağazasındaki ${brand.name} ürünleri; güncel fiyat ve stok için bize ulaşın.`,
    path: brandHref(brand.slug),
    noIndex: brand.products.length < 2,
  });
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await findBrand(slug);
  if (!brand) notFound();

  const categories = [
    ...new Set(brand.products.map((product) => product.category)),
  ] as ProductCategory[];
  const path = brandHref(brand.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Markalar", path: "/markalar" },
            { name: brand.name, path },
          ]),
          itemListJsonLd({
            path,
            name: `${brand.name} ürünleri`,
            items: brand.products.map((product) => ({
              name: product.title,
              path: `/yapi-malzemeleri/${product.slug}`,
            })),
          }),
        ]}
      />
      <PageHero
        title={`${brand.name} Ürünleri`}
        description={brand.blurb || undefined}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Markalar", href: "/markalar" },
          { label: brand.name },
        ]}
      />
      <section className="container-wide py-10 md:py-14">
        {categories.length > 0 && (
          <ul className="mb-8 flex flex-wrap gap-2" aria-label="Kategoriler">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={categoryHref(category)}
                  className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm transition hover:text-forest-800"
                >
                  {PRODUCT_CATEGORY_LABELS[category]}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <h2 className="mb-6 font-display text-2xl font-bold text-ink-900">
          Mağazamızdaki {brand.name} ürünleri
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brand.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
      <section className="container-wide pb-16 md:pb-24">
        <div className="flex flex-col gap-4 rounded-3xl bg-forest-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              {brand.name} için fiyat ve stok bilgisi
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Aradığınız ürün listede yoksa sorun; tedarik edip edemeyeceğimizi
              iletelim.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={whatsappUrl(
                  `Merhaba, ${brand.name} ürünleri için güncel fiyat ve stok bilgisi almak istiyorum.`,
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
