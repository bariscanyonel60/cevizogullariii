import type { Metadata } from "next";
import Link from "next/link";
import { Home, Phone } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { HelpfulLinks } from "@/components/molecules/HelpfulLinks";
import { SITE, whatsappUrl } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sayfa bulunamadı",
  description:
    "Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Cevizoğulları ana sayfasından yapı market ve inşaat sayfalarına geçin.",
  path: "/",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="container-wide flex min-h-[70vh] flex-col items-center justify-center pb-20 pt-36 text-center md:pt-40">
      <p className="font-display text-7xl font-bold text-forest-800/15 md:text-9xl" aria-hidden>
        404
      </p>
      <h1 className="-mt-4 font-display text-3xl font-bold text-ink-900 md:-mt-8 md:text-5xl">
        Aradığınız sayfa bulunamadı
      </h1>
      <p className="mt-4 max-w-xl text-ink-500">
        Sayfa taşınmış, adı değişmiş veya kaldırılmış olabilir. Aşağıdaki
        bağlantılardan devam edebilir ya da aradığınız ürünü bize doğrudan
        sorabilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" />
            Ana Sayfaya Dön
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <a href={SITE.phoneHref}>
            <Phone className="size-4" />
            {SITE.phone}
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a
            href={whatsappUrl("Merhaba, sitenizde aradığım sayfayı bulamadım.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
        </Button>
      </div>
      <div className="mt-14 w-full max-w-5xl">
        <HelpfulLinks title="Popüler sayfalar" />
      </div>
    </section>
  );
}
