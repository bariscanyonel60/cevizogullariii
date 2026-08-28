import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrmanUrunleriContent } from "@/components/organisms/orman-urunleri/OrmanUrunleriContent";
import { JsonLd } from "@/components/atoms/JsonLd";
import { getOrmanPage, getOrmanPages, getProducts } from "@/lib/cms-store";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getOrmanPage("index");
  if (!page) {
    return buildMetadata({
      title: "Orman Ürünleri",
      description: "Orman ürünleri",
      path: "/orman-urunleri",
    });
  }
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.href,
    keywords: page.keywords,
  });
}

export default async function OrmanUrunleriIndexPage() {
  const [page, ormanPages, products] = await Promise.all([
    getOrmanPage("index"),
    getOrmanPages(),
    getProducts(),
  ]);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/orman-urunleri",
            name: page.metaTitle,
            description: page.metaDescription,
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Orman Ürünleri", path: "/orman-urunleri" },
          ]),
          itemListJsonLd({
            path: "/orman-urunleri",
            name: "Orman Ürünleri",
            items: ormanPages
              .filter((item) => item.slug !== "index")
              .map((item) => ({
                name: item.navLabel,
                path: item.href,
              })),
          }),
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
