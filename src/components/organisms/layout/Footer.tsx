import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { MediaCredit } from "@/components/atoms/MediaCredit";
import { InstagramIcon, WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { CATEGORY_SHOWCASE } from "@/data/products";
import { categoryHref } from "@/lib/catalog";
import {
  BUSINESS_AREAS,
  MAPS_DIRECTIONS_URL,
  SERVICE_AREA_CITIES,
  SITE,
  whatsappUrl,
} from "@/lib/constants";

const corporateLinks = [
  { href: "/kurumsal", label: "Hakkımızda" },
  { href: "/projelerimiz", label: "Projelerimiz" },
  { href: "/galeri", label: "Galeri" },
  { href: "/blog", label: "Blog" },
  { href: "/tokat", label: "Tokat Hizmet Bölgesi" },
  { href: "/#sss", label: "Sık Sorulan Sorular" },
  { href: "/iletisim", label: "İletişim" },
];

const legalLinks = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
];

const headingClass =
  "font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300";
const linkClass = "text-sm text-white/70 transition hover:text-white";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-950 pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-white md:pb-0">
      <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 size-72 rounded-full bg-forest-800/30 blur-3xl" />

      <div className="container-wide relative pt-14 lg:pt-16">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-forest-900 to-forest-800 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-display text-2xl font-bold text-balance">
              Projeniz için ücretsiz teklif alın
            </p>
            <p className="mt-2 text-sm text-white/70">
              Listenizi gönderin; stok ve fiyatla aynı gün dönüş yapalım.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/teklif-al"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gold-500 px-5 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
            >
              Teklif Al
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Phone className="size-4" aria-hidden />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-wide relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-16">
        <div className="space-y-5">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            {SITE.description}
          </p>
          <div className="flex gap-2">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram: ${SITE.social.instagramHandle}`}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold-400/50 hover:text-gold-300"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={whatsappUrl("Merhaba, bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ile yazın"
              className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-[#25D366]/60 hover:text-[#25D366]"
            >
              <WhatsAppIcon className="size-4" />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="E-posta gönderin"
              className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold-400/50 hover:text-gold-300"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <nav aria-label="Ürün kategorileri">
          <p className={headingClass}>Ürünler</p>
          <ul className="mt-5 space-y-3">
            {CATEGORY_SHOWCASE.slice(0, 7).map((category) => (
              <li key={category.key}>
                <Link
                  href={categoryHref(category.key)}
                  className={linkClass}
                >
                  {category.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/markalar" className={linkClass}>
                Markalar
              </Link>
            </li>
            <li>
              <Link
                href="/yapi-malzemeleri"
                className="text-sm font-semibold text-gold-300 transition hover:text-gold-200"
              >
                Tüm ürünler
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Kurumsal">
          <p className={headingClass}>Kurumsal</p>
          <ul className="mt-5 space-y-3">
            {BUSINESS_AREAS.map((area) => (
              <li key={area.href}>
                <Link href={area.href} className={linkClass}>
                  {area.title}
                </Link>
              </li>
            ))}
            {corporateLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={headingClass}>İletişim</p>
          <address className="mt-5 space-y-4 text-sm not-italic text-white/70">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden />
              {SITE.address}
            </p>
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Phone className="size-4 shrink-0 text-gold-400" aria-hidden />
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Mail className="size-4 shrink-0 text-gold-400" aria-hidden />
              {SITE.email}
            </a>
            <p className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-gold-400" aria-hidden />
              {SITE.hours}
            </p>
          </address>
          <a
            href={MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/80 transition hover:border-gold-400/50 hover:text-gold-300"
          >
            <Navigation className="size-4" aria-hidden />
            Yol tarifi al
          </a>
        </div>
      </div>

      <div className="container-wide relative pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Hizmet bölgeleri
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SERVICE_AREA_CITIES.map((city) => (
            <li
              key={city}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
            >
              {city}
            </li>
          ))}
          <li>
            <Link
              href="/tokat"
              className="inline-block rounded-full border border-gold-400/30 px-3 py-1 text-xs font-semibold text-gold-300 transition hover:border-gold-400/60"
            >
              Tokat hizmet bölgesi
            </Link>
          </li>
        </ul>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-wide flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
            <p className="text-xs text-white/45">
              © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/55 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/sitemap.xml"
                  className="text-xs text-white/55 transition hover:text-white"
                >
                  Site Haritası
                </a>
              </li>
            </ul>
          </div>
          <MediaCredit
            inverted
            className="self-start rounded-full border border-orange-400/35 bg-orange-500/15 px-4 py-2 shadow-[0_0_24px_rgba(249,115,22,0.22)] lg:self-auto"
          />
        </div>
      </div>
    </footer>
  );
}
