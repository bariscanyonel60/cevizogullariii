import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrmanUrunleriContent } from "@/components/organisms/orman-urunleri/OrmanUrunleriContent";
import { JsonLd } from "@/components/atoms/JsonLd";
import { getOrmanPage, getOrmanPages, getProducts } from "@/lib/cms-store";
import {
  breadcrumbJsonLd,
  buildMetadata,
  webPageJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getOrmanPages();
  return pages
    .filter((page) => page.slug !== "index")
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getOrmanPage(slug);
  if (!page || page.slug === "index") {
    return buildMetadata({
      title: "Orman Ürünleri",
      description: "Orman ürünleri",
      path: "/orman-urunleri",
      noIndex: true,
    });
  }
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.href,
    keywords: page.keywords,
  });
}

export default async function OrmanUrunleriSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, ormanPages, products] = await Promise.all([
    getOrmanPage(slug),
    getOrmanPages(),
    getProducts(),
  ]);
  if (!page || page.slug === "index") notFound();

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: page.href,
            name: page.metaTitle,
            description: page.metaDescription,
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Orman Ürünleri", path: "/orman-urunleri" },
            { name: page.navLabel, path: page.href },
          ]),
        ]}
      />
      <OrmanUrunleriContent
        page={page}
        ormanPages={ormanPages}
        products={products}
      />
    </>
  );
}
