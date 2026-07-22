import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { QuoteForm } from "@/components/organisms/shared/QuoteForm";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  getProductBySlug,
  PRODUCT_CATEGORY_LABELS,
  products,
  USE_CASE_LABELS,
} from "@/data/products";
import {
  breadcrumbJsonLd,
  buildMetadata,
  productImageAlt,
  productJsonLd,
  withLocalDescription,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Ürün bulunamadı",
      description: "Aradığınız ürün bulunamadı.",
      path: "/yapi-malzemeleri",
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${product.title} · Tokat Turhal`,
    description: withLocalDescription(
      product.description,
      `${product.brand} ürünü Turhal Yapı Market’te.`,
    ),
    path: `/yapi-malzemeleri/${product.slug}`,
    image: product.image,
    keywords: [
      product.title,
      product.brand,
      "Tokat yapı malzemeleri",
      "Turhal yapı market",
      product.category,
    ],
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const schemas = [
    productJsonLd(product),
    breadcrumbJsonLd([
      { name: "Ana Sayfa", path: "/" },
      { name: "Yapı Malzemeleri", path: "/yapi-malzemeleri" },
      { name: product.title, path: `/yapi-malzemeleri/${product.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        title={product.title}
        description={`${product.brand} · Tokat / Turhal stoklu tedarik`}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı Malzemeleri", href: "/yapi-malzemeleri" },
          { label: product.title },
        ]}
      />
      <section className="container-wide grid gap-10 py-12 md:py-16 lg:grid-cols-2">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-premium">
          <Image
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
            <Badge>{product.brand}</Badge>
            <Badge className="bg-mist-100 text-ink-600">
              {PRODUCT_CATEGORY_LABELS[product.category]}
            </Badge>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold">{product.title}</h2>
          <p className="mt-4 leading-relaxed text-ink-500">{product.description}</p>
          <p className="mt-4 text-sm text-ink-400">Birim: {product.unit}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.useCases.map((u) => (
              <span
                key={u}
                className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-800"
              >
                {USE_CASE_LABELS[u]}
              </span>
            ))}
          </div>
          <ul className="mt-6 space-y-3">
            {product.specs.map((spec) => (
              <li
                key={spec.label}
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm"
              >
                <span className="text-ink-400">{spec.label}</span>
                <span className="font-semibold text-ink-800">{spec.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            {product.catalogPdf && (
              <Button asChild variant="secondary">
                <a href={product.catalogPdf}>PDF Katalog</a>
              </Button>
            )}
          </div>
        </div>
      </section>
      <section className="container-wide pb-16">
        <h2 className="mb-6 font-display text-2xl font-bold">Teklif Formu</h2>
        <QuoteForm defaultType="boya" />
      </section>
    </>
  );
}
