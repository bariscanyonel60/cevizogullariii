import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

const defaultOgImage = `${SITE.url}/og-default.jpg`;

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "",
  image = defaultOgImage,
  type = "website",
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle =
    title === SITE.name ? title : `${title} | ${SITE.shortName}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE.url}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pazar Mahallesi, Yeşilırmak Sk. No: 99",
      addressLocality: "Turhal",
      addressRegion: "Tokat",
      postalCode: "60300",
      addressCountry: "TR",
    },
    openingHours: "Mo-Sa 08:00-19:00",
    sameAs: [SITE.social.instagram],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}
