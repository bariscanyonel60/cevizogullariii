import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { MediaCredit } from "@/components/atoms/MediaCredit";
import { InstagramIcon } from "@/components/atoms/SocialIcons";
import { BUSINESS_AREAS, SITE } from "@/lib/constants";

const corporateLinks = [
  { href: "/kurumsal", label: "Hakkımızda" },
  { href: "/tokat", label: "Tokat" },
  { href: "/blog", label: "Blog" },
  { href: "/projelerimiz", label: "Projeler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/#sss", label: "SSS" },
];

const quickLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#hizmetler", label: "Hizmetler" },
  { href: "/teklif-al", label: "Teklif Al" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/yapi-malzemeleri", label: "Ürünler" },
  { href: "/yapi-insaat", label: "Yapı - İnşaat" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 size-72 rounded-full bg-forest-800/30 blur-3xl" />

      <div className="container-wide relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="space-y-5">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            {SITE.description}
          </p>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/80 transition hover:border-gold-400/50 hover:text-gold-300"
          >
            <InstagramIcon className="size-4" />
            {SITE.social.instagramHandle}
          </a>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
            Hızlı Linkler
          </p>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
            İş Alanları & Kurumsal
          </p>
          <ul className="mt-5 space-y-3">
            {BUSINESS_AREAS.map((area) => (
              <li key={area.href}>
                <Link
                  href={area.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {area.label}
                </Link>
              </li>
            ))}
            {corporateLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
            İletişim
          </p>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
              {SITE.address}
            </li>
            <li>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-3 transition hover:text-white"
              >
                <Phone className="size-4 text-gold-400" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-3 transition hover:text-white"
              >
                <Mail className="size-4 text-gold-400" />
                {SITE.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="Cevizoğulları konum haritası"
              src={SITE.mapEmbed}
              className="h-36 w-full grayscale contrast-125"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
          </p>
          <MediaCredit
            inverted
            className="rounded-full border border-orange-400/35 bg-orange-500/15 px-4 py-2 shadow-[0_0_24px_rgba(249,115,22,0.22)]"
          />
        </div>
      </div>
    </footer>
  );
}
