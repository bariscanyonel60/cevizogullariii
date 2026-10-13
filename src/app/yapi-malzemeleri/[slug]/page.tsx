import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { CdnImage } from "@/components/atoms/CdnImage";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { LazyQuoteForm } from "@/components/organisms/shared/LazyQuoteForm";
import { CategoryLandingView } from "@/components/organisms/catalog/CategoryLandingView";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { JsonLd } from "@/components/atoms/JsonLd";
import { ProductCard } from "@/components/molecules/ProductCard";
import { WhatsAppPriceButton } from "@/components/molecules/WhatsAppPriceButton";
import { PRODUCT_CATEGORY_LABELS, USE_CASE_LABELS } from "@/data/products";
import {
  brandHref,
  brandLinksForProduct,
  brandPages,
  CATEGORY_INDEX_MIN_PRODUCTS,
  CATEGORY_LANDING_SLUGS,
  CATEGORY_LANDINGS,
  categoryHref,
  getCategoryLandingBySlug,
  relatedPostsForProduct,
  type CategoryLanding,
} from "@/lib/catalog";
import {
  getBlogPosts,
  getBrands,
  getProductBySlug,
  getProducts,
} from "@/lib/cms-store";
import { MAPS_DIRECTIONS_URL, SITE } from "@/lib/constants";
import {
  breadcrumbJsonLd,
  buildMetadata,
  productImageAlt,
  productJsonLd,
  productSeoDescription,
  productSeoTitle,
} from "@/lib/seo";
import type { Product } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return [
    ...CATEGORY_LANDING_SLUGS.map((slug) => ({ slug })),
    ...products.map((p) => ({ slug: p.slug })),
  ];
}

function productsInCategory(landing: CategoryLanding, products: Product[]) {
  return products.filter((product) => product.category === landing.key);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const landing = getCategoryLandingBySlug(slug);
  if (landing) {
    const count = productsInCategory(landing, await getProducts()).length;
    return buildMetadata({
      title: landing.title,
      description: landing.description,
      path: categoryHref(landing.key),
      noIndex: count < CATEGORY_INDEX_MIN_PRODUCTS,
    });
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Ürün bulunamadı",
      description: "Aradığınız ürün bulunamadı.",
      path: "/yapi-malzemeleri",
      noIndex: true,
    });
  }
  return buildMetadata({
    title: productSeoTitle(product),
    description: productSeoDescription(product),
    path: `/yapi-malzemeleri/${product.slug}`,
    image: product.image,
  });
}

export default async function YapiMalzemeleriSlugPage({ params }: Props) {
  const { slug } = await params;
  const landing = getCategoryLandingBySlug(slug);
  if (landing) return <CategoryPage landing={landing} />;
  return <ProductDetail slug={slug} />;
}

async function CategoryPage({ landing }: { landing: CategoryLanding }) {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const items = productsInCategory(landing, products);
  const pages = brandPages(brands, products);
  const categoryBrands = pages.filter((page) =>
    page.products.some((product) => product.category === landing.key),
  );
  const relatedCategories = Object.values(CATEGORY_LANDINGS)
    .filter((other) => other.key !== landing.key)
    .map((other) => ({
      key: other.key,
      count: productsInCategory(other, products).length,
    }))
    .filter((entry) => entry.count > 0);

  return (
    <CategoryLandingView
      landing={landing}
      products={items}
      brands={categoryBrands}
      relatedCategories={relatedCategories}
    />
  );
}

async function ProductDetail({ slug }: { slug: string }) {
  const [product, allProducts, brands, posts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
    getBrands(),
    getBlogPosts(),
  ]);
  if (!product) notFound();

  const others = allProducts.filter((item) => item.slug !== product.slug);
  const related = [
    ...others.filter((item) => item.category === product.category),
    ...others.filter(
      (item) =>
        item.category !== product.category &&
        item.useCases.some((u) => product.useCases.includes(u)),
    ),
  ].slice(0, 3);
  const productBrands = brandLinksForProduct(product, brandPages(brands, allProducts));
  const relatedPosts = relatedPostsForProduct(product, posts);
  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category];
  const categoryPath = categoryHref(product.category);

  const schemas = [
    productJsonLd(
      product,
      productBrands.map((brand) => brand.name),
    ),
    breadcrumbJsonLd([
      { name: "Ana Sayfa", path: "/" },
      { name: "Yapı Malzemeleri", path: "/yapi-malzemeleri" },
      { name: categoryLabel, path: categoryPath },
      { name: product.title, path: `/yapi-malzemeleri/${product.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        title={product.title}
        description={`${product.brand} · ${categoryLabel}`}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı Malzemeleri", href: "/yapi-malzemeleri" },
          { label: categoryLabel, href: categoryPath },
          { label: product.title },
        ]}
      />
      <section className="container-wide grid gap-10 py-12 md:py-16 lg:grid-cols-2">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-premium">
          <CdnImage
            src={product.image}
            alt={productImageAlt(product)}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {productBrands.length > 0 ? (
              productBrands.map((brand) => (
                <Link key={brand.slug} href={brandHref(brand.slug)}>
                  <Badge className="transition hover:brightness-110">
                    {brand.name}
                  </Badge>
                </Link>
              ))
            ) : (
              <Badge>{product.brand}</Badge>
            )}
            <Link href={categoryPath}>
              <Badge className="bg-mist-100 text-ink-600 transition hover:bg-forest-50 hover:text-forest-800">
                {categoryLabel}
              </Badge>
            </Link>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            {product.description}
          </p>
          <p className="mt-4 text-sm text-ink-500">Satış birimi: {product.unit}</p>
          {product.useCases.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-500">
                Kullanım alanları
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.useCases.map((u) => (
                  <li
                    key={u}
                    className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-800"
                  >
                    {USE_CASE_LABELS[u]}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.specs.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-500">
                Teknik özellikler
              </h2>
              <dl className="mt-3 space-y-2">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm"
                  >
                    <dt className="text-ink-500">{spec.label}</dt>
                    <dd className="text-right font-semibold text-ink-800">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppPriceButton productTitle={product.title} />
            <Button asChild variant="secondary">
              <a href={SITE.phoneHref}>
                <Phone className="size-4" aria-hidden />
                Hemen Ara
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="#teklif-formu">Teklif Al</Link>
            </Button>
            {product.catalogPdf && (
              <Button asChild variant="ghost">
                <a href={product.catalogPdf}>PDF Katalog</a>
              </Button>
            )}
          </div>
          <div className="mt-8 rounded-2xl border border-earth-400/15 bg-ivory-50 p-5 text-sm text-ink-600">
            <p className="font-display text-base font-semibold text-ink-900">
              Fiyat ve stok bilgisi
            </p>
            <p className="mt-1">
              Fiyatlar ve stok durumu değişkendir; güncel bilgi için telefon
              veya WhatsApp üzerinden ulaşabilirsiniz.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden />
                {SITE.address}
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden />
                {SITE.hours}
              </li>
              <li>
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-forest-800 hover:underline"
                >
                  <Navigation className="size-4" aria-hidden />
                  Yol tarifi al
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="container-wide pb-12 md:pb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold">Benzer ürünler</h2>
            <Link
              href={categoryPath}
              className="text-sm font-semibold text-forest-800 hover:underline"
            >
              Tüm {categoryLabel} ürünleri
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
      {relatedPosts.length > 0 && (
        <section className="container-wide pb-12 md:pb-16">
          <h2 className="mb-4 font-display text-2xl font-bold">İlgili rehberler</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block h-full rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-premium"
                >
                  <span className="font-display text-lg font-semibold text-ink-900">
                    {post.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink-500">{post.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section id="teklif-formu" className="container-wide scroll-mt-28 pb-16">
        <h2 className="mb-6 font-display text-2xl font-bold">Teklif Formu</h2>
        <LazyQuoteForm defaultType="boya" />
      </section>
    </>
  );
}
