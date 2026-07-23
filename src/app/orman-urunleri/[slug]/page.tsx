import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrmanUrunleriContent } from "@/components/organisms/orman-urunleri/OrmanUrunleriContent";
import { JsonLd } from "@/components/atoms/JsonLd";
import { ORMAN_URUNLERI_PAGES, getOrmanUrunleriPage } from "@/data/orman-urunleri";
import {
  breadcrumbJsonLd,
  buildMetadata,
  webPageJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ALLOWED = new Set(
  ORMAN_URUNLERI_PAGES.filter((page) => page.slug !== "index").map((page) => page.slug),
);

export function generateStaticParams() {
  return [...ALLOWED].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getOrmanUrunleriPage(slug);
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
  const page = getOrmanUrunleriPage(slug);
  if (!page || page.slug === "index" || !ALLOWED.has(slug)) notFound();

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
      <OrmanUrunleriContent page={page} />
    </>
  );
}
