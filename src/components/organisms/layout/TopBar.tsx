import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { SITE, whatsappUrl } from "@/lib/constants";

export function TopBar() {
  return (
    <div className="relative z-[60] hidden border-b border-white/10 bg-ink-950 text-white lg:block">
      <div className="container-wide flex h-11 items-center justify-between gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/70">
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-1.5 transition hover:text-gold-300"
          >
            <Phone className="size-3.5 text-gold-400" aria-hidden />
            {SITE.phone}
          </a>
          <a
            href={whatsappUrl("Merhaba, hızlı teklif almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-gold-300"
          >
            <WhatsAppIcon className="size-3.5 text-[#25D366]" />
            WhatsApp
          </a>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-gold-400" aria-hidden />
            {SITE.city} / {SITE.district}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-gold-400" aria-hidden />
            {SITE.hours}
          </span>
        </div>
        <Link
          href="/teklif-al"
          className="rounded-full bg-gold-500 px-3.5 py-1 font-semibold text-ink-950 transition hover:bg-gold-400"
        >
          Hızlı Teklif
        </Link>
      </div>
    </div>
  );
}
