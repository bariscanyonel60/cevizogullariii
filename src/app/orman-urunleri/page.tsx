import type { Metadata } from "next";
import { OrmanUrunleriContent } from "@/components/organisms/orman-urunleri/OrmanUrunleriContent";
import { JsonLd } from "@/components/atoms/JsonLd";
import { ORMAN_URUNLERI_PAGES, getOrmanUrunleriPage } from "@/data/orman-urunleri";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const page = getOrmanUrunleriPage("index")!;

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: page.href,
  keywords: page.keywords,
});

export default function OrmanUrunleriIndexPage() {
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
            items: ORMAN_URUNLERI_PAGES.filter((p) => p.slug !== "index").map((p) => ({
              name: p.navLabel,
              path: p.href,
            })),
          }),
        ]}
      />
      <OrmanUrunleriContent page={page} />
    </>
  );
}
