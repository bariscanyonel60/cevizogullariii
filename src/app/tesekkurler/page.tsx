import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Phone } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { HelpfulLinks } from "@/components/molecules/HelpfulLinks";
import { SITE, whatsappUrl } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Teşekkürler · Talebiniz Alındı",
  description:
    "Talebiniz Cevizoğulları ekibine ulaştı. Mesai saatlerinde aynı gün içinde size dönüş yapacağız.",
  path: "/tesekkurler",
  noIndex: true,
});

type Props = {
  searchParams: Promise<{ tur?: string }>;
};

export default async function ThankYouPage({ searchParams }: Props) {
  const { tur } = await searchParams;
  const isQuote = tur === "teklif";

  return (
    <section className="container-wide flex flex-col items-center pb-20 pt-36 text-center md:pt-40">
      <span className="grid size-20 place-items-center rounded-full bg-forest-50 text-forest-800">
        <CheckCircle2 className="size-10" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink-900 md:text-5xl">
        Teşekkürler, {isQuote ? "teklif talebiniz" : "mesajınız"} bize ulaştı
      </h1>
      <p className="mt-4 max-w-xl text-ink-500">
        {isQuote
          ? "Ürün listenizi inceleyip stok ve fiyat bilgisiyle size dönüş yapacağız."
          : "Mesajınızı aldık; ekibimiz en kısa sürede sizinle iletişime geçecek."}{" "}
        Acil bir durum varsa bizi doğrudan arayabilirsiniz.
      </p>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-ink-600 shadow-sm">
        <Clock className="size-4 text-forest-700" aria-hidden />
        {SITE.hours} · aynı gün dönüş hedefi
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <a href={SITE.phoneHref}>
            <Phone className="size-4" />
            Hemen Ara
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a
            href={whatsappUrl("Merhaba, web sitesinden talep gönderdim.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">
            <InstagramIcon className="size-4" />
            Instagram’da takip et
          </a>
        </Button>
      </div>
      <Link
        href="/"
        className="mt-6 text-sm font-semibold text-forest-800 hover:underline"
      >
        Ana sayfaya dön
      </Link>
      <div className="mt-14 w-full max-w-5xl">
        <HelpfulLinks title="Bu arada göz atın" />
      </div>
    </section>
  );
}
