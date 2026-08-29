import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Clock, Mail, MapPin, Phone, Trees } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ContactForm } from "@/components/organisms/shared/ContactForm";
import { InstagramCta } from "@/components/organisms/shared/InstagramCta";
import { Button } from "@/components/atoms/Button";
import { JsonLd } from "@/components/atoms/JsonLd";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { SITE, whatsappUrl } from "@/lib/constants";
import {
  breadcrumbJsonLd,
  buildMetadata,
  contactPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "İletişim · Turhal Mağaza Adres ve Telefon",
  description:
    "Pazar Mahallesi, Yeşilırmak Sk. No: 99, Turhal. Telefon +90 535 573 01 15 — WhatsApp ve harita.",
  path: "/iletisim",
  keywords: [
    "Turhal yapı market iletişim",
    "Tokat Cevizoğulları telefon",
    "Turhal adres",
  ],
});

const departments = [
  {
    title: "Yapı Market",
    text: "Boya, mantolama, çimento, çatı ve nalbur — reyon",
    href: "/yapi-malzemeleri",
    icon: Building2,
  },
  {
    title: "Orman Ürünleri",
    text: "OSB, plywood, kereste ve orman ürünleri",
    href: "/orman-urunleri",
    icon: Trees,
  },
  {
    title: "Yapı - İnşaat",
    text: "Konut, bina inşaatı ve dış cephe uygulamaları",
    href: "/yapi-insaat",
    icon: MapPin,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          contactPageJsonLd(),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "İletişim", path: "/iletisim" },
          ]),
        ]}
      />
      <PageHero
        title="İletişim"
        description="Pazar Mahallesi, Yeşilırmak Sk. No: 99. Mağazaya uğrayın veya WhatsApp’tan liste atın — Tokat ve çevre illere çıkarız."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />
      <section className="container-wide grid gap-10 py-12 md:py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-premium md:p-8">
            <h2 className="font-display text-2xl font-bold">İletişim Bilgileri</h2>
            <ul className="mt-6 space-y-5 text-ink-600">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold-500" />
                {SITE.address}
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-3 transition hover:text-forest-700"
                >
                  <Phone className="size-5 text-gold-500" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-3 transition hover:text-forest-700"
                >
                  <Mail className="size-5 text-gold-500" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold-500" />
                {SITE.hours}
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link
                  href={whatsappUrl("Merhaba, bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/teklif-al">Teklif Al</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Link
                  key={dept.title}
                  href={dept.href}
                  className="flex items-start gap-3 rounded-2xl border border-earth-400/10 bg-white p-4 shadow-sm transition hover:shadow-premium"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-forest-800 text-gold-300">
                    <Icon className="size-4" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-ink-900">
                      {dept.title}
                    </span>
                    <span className="mt-1 block text-xs text-ink-500">
                      {dept.text}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-3xl border border-earth-400/10 shadow-premium">
            <iframe
              title="İletişim haritası"
              src={SITE.mapEmbed}
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <InstagramCta compact />
        </div>
        <ContactForm />
      </section>
    </>
  );
}
