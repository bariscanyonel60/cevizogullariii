import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { QuoteForm } from "@/components/organisms/shared/QuoteForm";
import { Button } from "@/components/atoms/Button";
import { SITE, whatsappUrl } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Teklif Al · Tokat Turhal Yapı Market",
  description:
    "Tokat / Turhal boya, yalıtım, kereste, OSB veya şantiye malzemesi için hızlı teklif. WhatsApp ve form ile Cevizoğulları’na ulaşın.",
  path: "/teklif-al",
  keywords: [
    "Tokat yapı malzemesi teklif",
    "Turhal mantolama fiyat",
    "Tokat kereste teklif",
  ],
});

const trust = [
  "Aynı gün dönüş hedefi",
  "Stok ve fiyat şeffaflığı",
  "Tokat / Turhal hızlı tedarik",
];

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
      <section className="container-wide grid gap-10 py-12 md:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-forest-800 p-6 text-white md:p-8">
            <h2 className="font-display text-2xl font-bold">Hızlı kanal</h2>
            <p className="mt-3 text-sm text-white/70">
              Formu doldurun veya doğrudan arayın / WhatsApp yazın.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild variant="gold">
                <a href={SITE.phoneHref}>
                  <Phone className="size-4" />
                  {SITE.phone}
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href={whatsappUrl("Merhaba, teklif almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp Teklif
                </Link>
              </Button>
            </div>
          </div>
          <ul className="space-y-3">
            {trust.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <CheckCircle2 className="size-5 text-forest-700" />
                <span className="text-sm font-medium text-ink-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <QuoteForm />
      </section>
    </>
  );
}
