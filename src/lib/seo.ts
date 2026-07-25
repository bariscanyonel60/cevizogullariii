import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import type { BlogPost, Product, Project } from "@/types";

const defaultOgImage = `${SITE.url}/og-default.jpg`;

/** Canonical hizmet bölgesi — UI, FAQ ve tüm JSON-LD ile senkron */
export const SERVICE_AREA_CITIES = [
  "Tokat",
  "Turhal",
  "Zile",
  "Erbaa",
  "Niksar",
  "Pazar",
  "Amasya",
  "Yozgat",
  "Sivas",
  "Çorum",
  "Samsun",
] as const;

export const SERVICE_AREA_SCHEMA = SERVICE_AREA_CITIES.map((name) => ({
  "@type": "City" as const,
  name,
}));

export const LOCAL_SEO_SUFFIX =
  "Turhal / Tokat — Cevizoğulları Yapı Market stok, tedarik ve danışmanlık.";

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
};

/** Açıklamada yerel sinyal yoksa Tokat/Turhal ekler */
export function withLocalDescription(description: string, extra?: string) {
  const base = description.trim();
  const hasLocal = /tokat|turhal|erbaa|niksar|zile/i.test(base);
  const localized = hasLocal ? base : `${base} ${LOCAL_SEO_SUFFIX}`;
  return extra ? `${localized} ${extra}`.trim() : localized;
}

export function productImageAlt(product: Pick<Product, "title" | "brand">) {
  return `${product.title} (${product.brand}) — Tokat Turhal yapı malzemeleri`;
}


export function projectImageAlt(
  project: Pick<Project, "title" | "location">,
  index = 1,
) {
  return `${project.title} proje görseli ${index} — ${project.location}`;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image = defaultOgImage,
  type = "website",
  noIndex = false,
  keywords,
}: BuildMetadataInput): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle =
    title === SITE.name ? title : `${title} | ${SITE.shortName}`;
  const absoluteImage = image.startsWith("http")
    ? image
    : `${SITE.url}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.length ? keywords : [...SITE.seoKeywords],
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/** One-page / yerel SEO için birincil anahtar kelimeler */
export const HOME_SEO = {
  title: "Tokat Yapı Malzemeleri & Turhal Yapı Market",
  description:
    "Tokat ve Turhal’da yapı malzemeleri, mantolama, boya, yalıtım, orman ürünleri ve yapı-inşaat. Deprem koşullarına uygun malzeme seçimi, hızlı teslimat. Cevizoğulları Yapı Market.",
  keywords: [
    "Tokat yapı malzemeleri",
    "Turhal yapı market",
    "Tokat inşaat malzemesi",
    "Tokat mantolama",
    "Turhal boya",
    "Tokat yalıtım",
    "Tokat orman ürünleri",
    "Tokat OSB",
    "deprem yönetmeliği yapı malzemesi",
    "Tokat yapı inşaat",
    "Turhal bina inşaatı",
    "Erbaa yapı malzemeleri",
    "Niksar mantolama",
    "Zile inşaat",
    "Cevizoğulları",
  ],
} as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HardwareStore", "LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: [`${SITE.url}/logo.png`, `${SITE.url}/og-default.jpg`],
    logo: `${SITE.url}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pazar Mahallesi, Yeşilırmak Sk. No: 99",
      addressLocality: "Turhal",
      addressRegion: "Tokat",
      postalCode: "60300",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.3889,
      longitude: 36.0831,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "19:00",
      },
    ],
    areaServed: [
      ...SERVICE_AREA_SCHEMA,
      { "@type": "AdministrativeArea", name: "Tokat" },
    ],
    sameAs: [SITE.social.instagram],
    hasMap: SITE.mapEmbed.replace("&output=embed", ""),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "customer service",
      areaServed: SERVICE_AREA_CITIES.map((name) => ({
        "@type": "City",
        name,
      })),
      availableLanguage: ["Turkish"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "tr-TR",
  };
}

export function faqJsonLd(
  items: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
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

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType:
      "Yapı malzemeleri, orman ürünleri ve yapı-inşaat tedarik / danışmanlık",
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SERVICE_AREA_SCHEMA,
    description: HOME_SEO.description,
    url: SITE.url,
  };
}


export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE.url}/iletisim#contact`,
    name: "İletişim | Cevizoğulları Turhal Tokat",
    url: `${SITE.url}/iletisim`,
    description: `${SITE.address} — telefon, WhatsApp ve harita.`,
    mainEntity: { "@id": `${SITE.url}/#organization` },
    about: { "@id": `${SITE.url}/#organization` },
  };
}

export function webPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}${input.path}#webpage`,
    url: `${SITE.url}${input.path}`,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    inLanguage: "tr-TR",
  };
}

export function productJsonLd(product: Product) {
  const image = product.image.startsWith("http")
    ? product.image
    : `${SITE.url}${product.image}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.url}/yapi-malzemeleri/${product.slug}#product`,
    name: product.title,
    description: withLocalDescription(product.description),
    image,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category,
    sku: product.slug,
  };
}


export function articleJsonLd(post: BlogPost) {
  const image = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${SITE.url}${post.coverImage}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}/blog/${post.slug}#article`,
    headline: post.title,
    description: withLocalDescription(post.excerpt),
    image,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE.url,
    },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "tr-TR",
  };
}

export function projectJsonLd(project: Project) {
  const images = project.images.map((src) =>
    src.startsWith("http") ? src : `${SITE.url}${src}`,
  );
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE.url}/projelerimiz/${project.slug}#project`,
    name: project.title,
    description: withLocalDescription(project.description),
    image: images,
    dateCreated: String(project.year),
    locationCreated: {
      "@type": "Place",
      name: project.location,
      address: {
        "@type": "PostalAddress",
        addressRegion: "Tokat",
        addressCountry: "TR",
      },
    },
    creator: { "@id": `${SITE.url}/#organization` },
    url: `${SITE.url}/projelerimiz/${project.slug}`,
  };
}

export function itemListJsonLd(input: {
  path: string;
  name: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    url: `${SITE.url}${input.path}`,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE.url}${item.path}`,
    })),
  };
}
