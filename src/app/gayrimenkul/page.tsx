import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { PropertyFilters } from "@/components/organisms/shared/PropertyFilters";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { JsonLd } from "@/components/atoms/JsonLd";
import { properties } from "@/data/properties";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  realEstateAgentJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Gayrimenkul · Satılık & Kiralık | Tokat Turhal",
  description:
    "Tokat ve Turhal’da satılık-kiralık konut, villa, arsa ve işyeri. Filtreleyin, favorileyin, teklif alın — Cevizoğulları Gayrimenkul.",
  path: "/gayrimenkul",
  keywords: [
    "Tokat gayrimenkul",
    "Turhal satılık daire",
    "Tokat villa",
    "Turhal arsa",
    "Erbaa kiralık",
    "Niksar satılık",
  ],
});

export default function PropertiesPage() {
  return (
    <>
      <JsonLd
        data={[
          realEstateAgentJsonLd(),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Gayrimenkul", path: "/gayrimenkul" },
          ]),
          itemListJsonLd({
            path: "/gayrimenkul",
            name: "Tokat Turhal gayrimenkul ilanları",
            items: properties.map((p) => ({
              name: p.title,
              path: `/gayrimenkul/${p.slug}`,
            })),
          }),
        ]}
      />
      <PageHero
        title="Gayrimenkul"
        description="Turhal / Tokat odaklı premium portföy. Fiyat, konum, m² ve odaya göre filtreleyin."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Gayrimenkul" },
        ]}
      />

      <section className="container-wide py-8">
        <Reveal>
          <div className="flex flex-col gap-4 rounded-3xl border border-earth-400/10 bg-white p-6 shadow-premium md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Emlak Portalı
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink-900">
                Doğru mülkü birlikte bulalım
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                {SITE.city} merkezli danışmanlık · {properties.length}+ aktif ilan
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/teklif-al">Teklif / Talep</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/iletisim">Danışmanlık</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-wide pb-16 md:pb-24">
        <PropertyFilters items={properties} />
      </section>
    </>
  );
}
