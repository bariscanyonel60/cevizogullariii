import type { Metadata } from "next";
import { KeresteContent } from "@/components/organisms/kereste/KeresteContent";
import { JsonLd } from "@/components/atoms/JsonLd";
import { KERESTE_PAGES, getKerestePage } from "@/data/kereste";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const page = getKerestePage("index")!;

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: page.href,
  keywords: page.keywords,
});

export default function KeresteIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/kereste",
            name: page.metaTitle,
            description: page.metaDescription,
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Kereste", path: "/kereste" },
          ]),
          itemListJsonLd({
            path: "/kereste",
            name: "Kereste & Orman Ürünleri",
            items: KERESTE_PAGES.filter((p) => p.slug !== "index").map((p) => ({
              name: p.navLabel,
              path: p.href,
            })),
          }),
        ]}
      />
      <KeresteContent page={page} />
    </>
  );
}
