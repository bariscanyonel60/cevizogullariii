import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { QuoteForm } from "@/components/organisms/shared/QuoteForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Teklif Al",
  description:
    "Boya, yalıtım, orman ürünleri veya şantiye malzemesi için WhatsApp üzerinden hızlı teklif alın.",
  path: "/teklif-al",
});

export default function QuotePage() {
  return (
    <>
      <PageHero
        title="Teklif Al"
        description="İhtiyacınızı yazın; WhatsApp üzerinden size özel dönüş yapalım."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Teklif Al" },
        ]}
      />
      <section className="container-wide max-w-3xl py-12 md:py-16">
        <QuoteForm />
      </section>
    </>
  );
}
