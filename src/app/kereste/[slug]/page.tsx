import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KeresteContent } from "@/components/organisms/kereste/KeresteContent";
import { JsonLd } from "@/components/atoms/JsonLd";
import { KERESTE_PAGES, getKerestePage } from "@/data/kereste";
import {
  breadcrumbJsonLd,
  buildMetadata,
  webPageJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ALLOWED = new Set(
  KERESTE_PAGES.filter((page) => page.slug !== "index").map((page) => page.slug),
);

export function generateStaticParams() {
  return [...ALLOWED].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getKerestePage(slug);
  if (!page || page.slug === "index") {
    return buildMetadata({
      title: "Kereste",
      description: "Kereste ve orman ürünleri",
      path: "/kereste",
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

export default async function KeresteSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getKerestePage(slug);
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
            { name: "Kereste", path: "/kereste" },
            { name: page.navLabel, path: page.href },
          ]),
        ]}
      />
      <KeresteContent page={page} />
    </>
  );
}
