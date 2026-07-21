import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { PropertyFilters } from "@/components/organisms/shared/PropertyFilters";
import { properties } from "@/data/properties";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gayrimenkul",
  description:
    "Satılık ve kiralık konut, villa, arsa, ofis ve işyeri portföyü. Filtreleyin, keşfedin.",
  path: "/gayrimenkul",
});

export default function PropertiesPage() {
  return (
    <>
      <PageHero
        title="Gayrimenkul"
        description="Prestijli lokasyonlarda seçilmiş portföy. İhtiyacınıza göre filtreleyin."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Gayrimenkul" },
        ]}
      />
      <section className="container-wide py-12 md:py-16">
        <PropertyFilters items={properties} />
      </section>
    </>
  );
}
