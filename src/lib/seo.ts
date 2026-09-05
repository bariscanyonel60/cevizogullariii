import type { Metadata } from "next";
import { HOME_HERO_VIDEO } from "@/data/home-hero";
import { PRODUCT_CATEGORY_LABELS } from "@/data/products";
import { SITE } from "@/lib/constants";
import { absoluteMediaUrl } from "@/lib/media";
import type { BlogPost, Product, Project } from "@/types";

const META_DESCRIPTION_MAX = 155;

const defaultOgImage = absoluteMediaUrl("/og-default.jpg", SITE.url);

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

/** Bing/Google snippet:  ~50–155 karakter, kelime ortasında kesme. */
export function clipMetaDescription(text: string, max = META_DESCRIPTION_MAX) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const clipped = (lastSpace > 80 ? slice.slice(0, lastSpace) : slice).replace(
    /[\s.,;:–—-]+$/u,
    "",
  );
  return `${clipped}...`;
}

function formatDocumentTitle(title: string) {
  const trimmed = title.trim();
  if (trimmed === SITE.name) return trimmed;
  if (trimmed.includes(SITE.shortName)) return trimmed;
  const withoutPipes = trimmed.replace(/\s*\|\s*/g, " · ");
  return `${withoutPipes} | ${SITE.shortName}`;
}

export function productSeoTitle(
  product: Pick<Product, "title" | "category">,
) {
  const category = PRODUCT_CATEGORY_LABELS[product.category].split(" · ")[0];
  return `${product.title} · ${category} · Turhal`;
}

export function productSeoDescription(
  product: Pick<Product, "description" | "brand" | "category">,
) {
  const category = PRODUCT_CATEGORY_LABELS[product.category].split(" · ")[0];
  const parts = [product.description.trim()];
  if (product.brand && !parts[0].includes(product.brand)) {
    parts.push(product.brand);
  }
  if (category && !parts.join(" ").includes(category)) {
    parts.push(category);
  }
  parts.push("Turhal stokunda.");
  return clipMetaDescription(parts.join(" "));
}

export function projectSeoTitle(
  project: Pick<Project, "title" | "location">,
) {
  return `${project.title} · ${project.location} uygulama`;
}

export function projectSeoDescription(
  project: Pick<Project, "description" | "location" | "year">,
) {
  return clipMetaDescription(
    `${project.description} ${project.location}, ${project.year} — Cevizoğulları saha uygulaması.`,
  );
}

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
  return `${product.title} — Tokat yapı malzemeleri, ${product.brand} Turhal`;
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
  const fullTitle = formatDocumentTitle(title);
  const metaDescription = clipMetaDescription(description);
  const absoluteImage = image.startsWith("http")
    ? image
    : absoluteMediaUrl(image.startsWith("/") ? image : `/${image}`, SITE.url);

  return {
    title: { absolute: fullTitle },
    description: metaDescription,
    keywords: keywords?.length ? keywords : [...SITE.seoKeywords],
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
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
      description: metaDescription,
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
  title: "Tokat Yapı Malzemeleri · Turhal Yapı Market",
  description:
    "Turhal yapı malzemeleri reyonunda boya, mantolama, yalıtım ve OSB. Tokat yapı malzemeleri listesini Turhal’dan yükleriz.",
  keywords: [
    "Tokat yapı malzemeleri",
    "Turhal yapı malzemeleri",
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
    image: [
      absoluteMediaUrl("/logo.png", SITE.url),
      absoluteMediaUrl("/og-default.jpg", SITE.url),
    ],
    logo: absoluteMediaUrl("/logo.png", SITE.url),
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

export function videoObjectJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${SITE.url}/#hero-video`,
    name: "Cevizoğulları Yapı Market — Turhal saha görüntüsü",
    description: HOME_SEO.description,
    thumbnailUrl: HOME_HERO_VIDEO.poster,
    contentUrl: HOME_HERO_VIDEO.src,
    uploadDate: "2026-09-05",
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "tr-TR",
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE.url}/iletisim#contact`,
    name: "İletişim · Turhal Mağaza Adres ve Telefon",
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
  const image = absoluteMediaUrl(product.image, SITE.url);
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
  const image = absoluteMediaUrl(post.coverImage, SITE.url);
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
  const images = project.images.map((src) => absoluteMediaUrl(src, SITE.url));
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
