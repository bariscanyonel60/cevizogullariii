import type { OrmanUrunleriPage } from "@/data/orman-urunleri";
import {
  isFaqPage,
  isSiteCardKind,
  type CmsBrand,
  type CmsCategoryShowcase,
  type CmsExteriorPackage,
  type CmsFaq,
  type CmsSiteCard,
} from "@/lib/cms-types";
import type {
  BlogPost,
  Product,
  ProductCategory,
  ProductUseCase,
  Project,
  ProjectCategory,
  StatItem,
  Testimonial,
} from "@/types";

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "boya",
  "izolasyon",
  "cati",
  "cephe",
  "orman",
  "cimento",
  "siva",
  "demir",
  "ahsap",
  "boru",
  "nalbur",
];

const USE_CASES: ProductUseCase[] = ["dis-cephe", "ic-mekan", "cati", "genel"];

const PROJECT_CATEGORIES: ProjectCategory[] = [
  "konut",
  "ticari",
  "restorasyon",
  "peyzaj",
  "dis-cephe",
  "yapi",
];

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function requireText(value: unknown, label: string): string {
  const text = asString(value);
  if (!text) throw new Error(`${label} gerekli`);
  return text;
}

function asCategory(value: unknown): ProductCategory {
  const text = asString(value);
  if ((PRODUCT_CATEGORIES as string[]).includes(text)) {
    return text as ProductCategory;
  }
  throw new Error("Geçersiz ürün kategorisi");
}

export function parseProduct(body: Record<string, unknown>, id: string): Product {
  const useCases = asStringList(body.useCases).filter((item): item is ProductUseCase =>
    (USE_CASES as string[]).includes(item),
  );
  const specsRaw = typeof body.specs === "string" ? body.specs : "";
  const specs =
    Array.isArray(body.specs)
      ? (body.specs as { label?: unknown; value?: unknown }[])
          .map((item) => ({
            label: asString(item.label),
            value: asString(item.value),
          }))
          .filter((item) => item.label && item.value)
      : specsRaw
          .split("\n")
          .map((line) => {
            const [label, ...rest] = line.split(":");
            return { label: label?.trim() ?? "", value: rest.join(":").trim() };
          })
          .filter((item) => item.label && item.value);

  const product: Product = {
    id,
    slug: requireText(body.slug, "Slug"),
    title: requireText(body.title, "Başlık"),
    description: requireText(body.description, "Açıklama"),
    category: asCategory(body.category),
    brand: requireText(body.brand, "Marka"),
    unit: requireText(body.unit, "Birim"),
    image: requireText(body.image, "Görsel"),
    useCases: useCases.length > 0 ? useCases : ["genel"],
    specs,
  };
  if (body.featured === true || body.featured === 1 || body.featured === "true") {
    product.featured = true;
  }
  const catalogPdf = asString(body.catalogPdf);
  if (catalogPdf) product.catalogPdf = catalogPdf;
  return product;
}

export function parseBrand(body: Record<string, unknown>, id: string): CmsBrand {
  return {
    id,
    name: requireText(body.name, "Marka adı"),
    blurb: requireText(body.blurb, "Kısa açıklama"),
  };
}

export function parseShowcase(
  body: Record<string, unknown>,
  id: string,
): CmsCategoryShowcase {
  return {
    id,
    key: asCategory(body.key ?? body.category),
    label: requireText(body.label, "Etiket"),
    description: requireText(body.description, "Açıklama"),
    image: requireText(body.image, "Görsel"),
  };
}

export function parseExterior(
  body: Record<string, unknown>,
  id: string,
): CmsExteriorPackage {
  const items = asStringList(body.items);
  if (items.length === 0) throw new Error("Paket maddeleri gerekli");
  return {
    id,
    title: requireText(body.title, "Başlık"),
    items,
  };
}

export function parseBlog(body: Record<string, unknown>, id: string): BlogPost {
  return {
    id,
    slug: requireText(body.slug, "Slug"),
    title: requireText(body.title, "Başlık"),
    excerpt: requireText(body.excerpt, "Özet"),
    content: requireText(body.content, "İçerik"),
    category: requireText(body.category, "Kategori"),
    tags: asStringList(body.tags),
    coverImage: requireText(body.coverImage, "Kapak görseli"),
    author: asString(body.author, "Cevizoğulları Editör"),
    publishedAt: requireText(body.publishedAt, "Yayın tarihi"),
    readingTime: Math.max(1, asNumber(body.readingTime, 3)),
  };
}

export function parseProject(body: Record<string, unknown>, id: string): Project {
  const category = asString(body.category);
  if (!(PROJECT_CATEGORIES as string[]).includes(category)) {
    throw new Error("Geçersiz proje kategorisi");
  }
  const images = asStringList(body.images);
  if (images.length === 0) throw new Error("En az bir proje görseli gerekli");
  const project: Project = {
    id,
    slug: requireText(body.slug, "Slug"),
    title: requireText(body.title, "Başlık"),
    description: requireText(body.description, "Açıklama"),
    category: category as ProjectCategory,
    location: requireText(body.location, "Konum"),
    year: asNumber(body.year, new Date().getFullYear()),
    images,
  };
  const beforeImage = asString(body.beforeImage);
  const afterImage = asString(body.afterImage);
  const instagramUrl = asString(body.instagramUrl);
  if (beforeImage) project.beforeImage = beforeImage;
  if (afterImage) project.afterImage = afterImage;
  if (instagramUrl) project.instagramUrl = instagramUrl;
  if (body.featured === true || body.featured === 1 || body.featured === "true") {
    project.featured = true;
  }
  return project;
}

export function parseOrman(body: Record<string, unknown>): OrmanUrunleriPage {
  const slug = requireText(body.slug, "Slug");
  const highlightsRaw = Array.isArray(body.highlights)
    ? body.highlights
    : asStringList(body.highlightsText).map((line) => {
        const [title, ...rest] = line.split("|");
        return { title: title?.trim() ?? "", text: rest.join("|").trim() };
      });
  const highlights = highlightsRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { title?: unknown; text?: unknown };
      const title = asString(record.title);
      const text = asString(record.text);
      if (!title || !text) return null;
      return { title, text };
    })
    .filter((item): item is { title: string; text: string } => item !== null);

  const relatedCategories = asStringList(body.relatedCategories).filter(
    (item): item is ProductCategory =>
      (PRODUCT_CATEGORIES as string[]).includes(item),
  );

  return {
    slug,
    href: asString(body.href) || (slug === "index" ? "/orman-urunleri" : `/orman-urunleri/${slug}`),
    title: requireText(body.title, "Başlık"),
    navLabel: requireText(body.navLabel, "Menü etiketi"),
    eyebrow: asString(body.eyebrow, "Orman Ürünleri"),
    description: requireText(body.description, "Açıklama"),
    metaTitle: requireText(body.metaTitle, "SEO başlığı"),
    metaDescription: requireText(body.metaDescription, "SEO açıklaması"),
    keywords: asStringList(body.keywords),
    image: requireText(body.image, "Görsel"),
    highlights,
    body: asStringList(body.body),
    relatedSlugs: asStringList(body.relatedSlugs),
    relatedCategories: relatedCategories.length > 0 ? relatedCategories : undefined,
  };
}

export function parseStat(body: Record<string, unknown>, id: string): StatItem {
  return {
    id,
    value: asNumber(body.value),
    suffix: asString(body.suffix, "+"),
    label: requireText(body.label, "Etiket"),
  };
}

export function parseTestimonial(
  body: Record<string, unknown>,
  id: string,
): Testimonial {
  return {
    id,
    name: requireText(body.name, "İsim"),
    role: requireText(body.role, "Rol"),
    quote: requireText(body.quote, "Yorum"),
    rating: Math.min(5, Math.max(1, asNumber(body.rating, 5))),
  };
}

export function parseCard(body: Record<string, unknown>, id: string): CmsSiteCard {
  const kind = asString(body.kind);
  if (!isSiteCardKind(kind)) throw new Error("Geçersiz kart türü");
  const card: CmsSiteCard = {
    id,
    kind,
    title: requireText(body.title, "Başlık"),
    description: requireText(body.description, "Açıklama"),
  };
  const href = asString(body.href);
  const step = asString(body.step);
  const points = asStringList(body.points);
  if (href) card.href = href;
  if (step) card.step = step;
  if (points.length > 0) card.points = points;
  return card;
}

export function parseFaq(body: Record<string, unknown>, id: string): CmsFaq {
  const page = asString(body.page, "home");
  if (!isFaqPage(page)) throw new Error("SSS sayfası home veya tokat olmalı");
  return {
    id,
    page,
    question: requireText(body.question, "Soru"),
    answer: requireText(body.answer, "Cevap"),
  };
}
