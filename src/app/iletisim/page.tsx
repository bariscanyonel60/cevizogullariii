import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ContactForm } from "@/components/organisms/shared/ContactForm";
import { InstagramCta } from "@/components/organisms/shared/InstagramCta";
import { Button } from "@/components/atoms/Button";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { SITE, whatsappUrl } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  description: `${SITE.shortName} iletişim: ${SITE.address}, ${SITE.phone}, WhatsApp ve Instagram.`,
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="İletişim"
        description="Turhal’daki yapı marketimize uğrayın veya WhatsApp’tan yazın."
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
                <Link
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.social.instagramHandle}
                </Link>
              </Button>
            </div>
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
