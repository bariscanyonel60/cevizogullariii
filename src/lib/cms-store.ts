import { randomUUID } from "node:crypto";
import { fallbackCmsSnapshot } from "@/lib/cms-fallback";
import type { OrmanUrunleriPage } from "@/data/orman-urunleri";
import {
  deleteBlogRow,
  deleteBrandRow,
  deleteCardRow,
  deleteExteriorRow,
  deleteFaqRow,
  deleteOrmanRow,
  deleteProductRow,
  deleteProjectRow,
  deleteShowcaseRow,
  deleteStatRow,
  deleteTestimonialRow,
  ensureCmsSchema,
  getCmsTableCounts,
  readCmsSnapshotFromMysql,
  replaceCmsSnapshot,
  upsertBlogRow,
  upsertBrandRow,
  upsertCardRow,
  upsertExteriorRow,
  upsertFaqRow,
  upsertOrmanRow,
  upsertProductRow,
  upsertProjectRow,
  upsertShowcaseRow,
  upsertStatRow,
  upsertTestimonialRow,
} from "@/lib/db/cms-sql";
import { isDatabaseConfigured } from "@/lib/db/pool";
import type {
  CmsBrand,
  CmsCategoryShowcase,
  CmsEntity,
  CmsExteriorPackage,
  CmsFaq,
  CmsSiteCard,
  CmsSnapshot,
  FaqPage,
  NavCms,
  SiteCardKind,
} from "@/lib/cms-types";
import type {
  BlogPost,
  Product,
  Project,
  StatItem,
  Testimonial,
} from "@/types";

export type CmsRecord =
  | Product
  | CmsBrand
  | CmsCategoryShowcase
  | CmsExteriorPackage
  | BlogPost
  | Project
  | OrmanUrunleriPage
  | StatItem
  | Testimonial
  | CmsSiteCard
  | CmsFaq;

let seedPromise: Promise<void> | null = null;

async function seedIfEmpty(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const counts = await getCmsTableCounts();
      const empty = Object.values(counts).every((value) => value === 0);
      if (!empty) return;
      await replaceCmsSnapshot(fallbackCmsSnapshot());
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  await seedPromise;
}

async function readLiveSnapshot(): Promise<CmsSnapshot | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    await ensureCmsSchema();
    await seedIfEmpty();
    const snapshot = await readCmsSnapshotFromMysql();
    if (snapshot.products.length === 0 && snapshot.posts.length === 0) {
      return null;
    }
    return snapshot;
  } catch (error) {
    console.error("[cms] MySQL okunamadı, statik yedek kullanılıyor", error);
    return null;
  }
}

export async function getCmsSnapshot(): Promise<CmsSnapshot> {
  return (await readLiveSnapshot()) ?? fallbackCmsSnapshot();
}

export async function seedCmsNow(options?: { force?: boolean }): Promise<CmsSnapshot> {
  if (!isDatabaseConfigured()) {
    throw new Error("MySQL ortam değişkenleri eksik");
  }
  await ensureCmsSchema();
  if (options?.force) {
    await replaceCmsSnapshot(fallbackCmsSnapshot());
  } else {
    await seedIfEmpty();
  }
  return readCmsSnapshotFromMysql();
}

export async function getProducts(): Promise<Product[]> {
  return (await getCmsSnapshot()).products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((item) => item.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((item) => item.featured);
}

export async function getBrands(): Promise<CmsBrand[]> {
  return (await getCmsSnapshot()).brands;
}

export async function getCategoryShowcase(): Promise<CmsCategoryShowcase[]> {
  return (await getCmsSnapshot()).showcase;
}

export async function getExteriorPackage(): Promise<CmsExteriorPackage[]> {
  return (await getCmsSnapshot()).exterior;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await getCmsSnapshot()).posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return (await getBlogPosts()).find((item) => item.slug === slug);
}

export async function getRelatedPosts(slug: string, limit = 2): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const current = posts.find((item) => item.slug === slug);
  if (!current) return posts.slice(0, limit);
  return posts
    .filter((item) => item.slug !== slug && item.category === current.category)
    .concat(posts.filter((item) => item.slug !== slug))
    .filter((item, index, arr) => arr.findIndex((x) => x.slug === item.slug) === index)
    .slice(0, limit);
}

export async function getProjects(): Promise<Project[]> {
  return (await getCmsSnapshot()).projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((item) => item.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((item) => item.featured);
}

export async function getOrmanPages(): Promise<OrmanUrunleriPage[]> {
  return (await getCmsSnapshot()).ormanPages;
}

export async function getOrmanPage(slug: string): Promise<OrmanUrunleriPage | undefined> {
  return (await getOrmanPages()).find((item) => item.slug === slug);
}

export async function getStats(): Promise<StatItem[]> {
  return (await getCmsSnapshot()).stats;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await getCmsSnapshot()).testimonials;
}

export async function getSiteCards(kind: SiteCardKind): Promise<CmsSiteCard[]> {
  return (await getCmsSnapshot()).cards.filter((item) => item.kind === kind);
}

export async function getFaqs(page: FaqPage): Promise<CmsFaq[]> {
  return (await getCmsSnapshot()).faqs.filter((item) => item.page === page);
}

export async function getNavCms(): Promise<NavCms> {
  const snapshot = await getCmsSnapshot();
  return {
    categories: snapshot.showcase,
    ormanPages: snapshot.ormanPages,
  };
}

function requireDatabase(): void {
  if (!isDatabaseConfigured()) {
    throw new Error("MySQL yapılandırılmamış; içerik kaydı için DATABASE_* gerekli");
  }
}

export async function saveCmsEntity(
  entity: CmsEntity,
  record: CmsRecord,
): Promise<CmsSnapshot> {
  requireDatabase();
  await ensureCmsSchema();
  await seedIfEmpty();

  switch (entity) {
    case "product":
      await upsertProductRow(record as unknown as Product);
      break;
    case "brand":
      await upsertBrandRow(record as unknown as CmsBrand);
      break;
    case "showcase":
      await upsertShowcaseRow(record as unknown as CmsCategoryShowcase);
      break;
    case "exterior":
      await upsertExteriorRow(record as unknown as CmsExteriorPackage);
      break;
    case "blog":
      await upsertBlogRow(record as unknown as BlogPost);
      break;
    case "project":
      await upsertProjectRow(record as unknown as Project);
      break;
    case "orman":
      await upsertOrmanRow(record as unknown as OrmanUrunleriPage);
      break;
    case "stat":
      await upsertStatRow(record as unknown as StatItem);
      break;
    case "testimonial":
      await upsertTestimonialRow(record as unknown as Testimonial);
      break;
    case "card":
      await upsertCardRow(record as unknown as CmsSiteCard);
      break;
    case "faq":
      await upsertFaqRow(record as unknown as CmsFaq);
      break;
    default: {
      const neverEntity: never = entity;
      throw new Error(`Bilinmeyen kayıt türü: ${String(neverEntity)}`);
    }
  }

  return readCmsSnapshotFromMysql();
}

export async function deleteCmsEntity(
  entity: CmsEntity,
  id: string,
): Promise<CmsSnapshot> {
  requireDatabase();
  await ensureCmsSchema();
  let removed = false;
  switch (entity) {
    case "product":
      removed = await deleteProductRow(id);
      break;
    case "brand":
      removed = await deleteBrandRow(id);
      break;
    case "showcase":
      removed = await deleteShowcaseRow(id);
      break;
    case "exterior":
      removed = await deleteExteriorRow(id);
      break;
    case "blog":
      removed = await deleteBlogRow(id);
      break;
    case "project":
      removed = await deleteProjectRow(id);
      break;
    case "orman":
      removed = await deleteOrmanRow(id);
      break;
    case "stat":
      removed = await deleteStatRow(id);
      break;
    case "testimonial":
      removed = await deleteTestimonialRow(id);
      break;
    case "card":
      removed = await deleteCardRow(id);
      break;
    case "faq":
      removed = await deleteFaqRow(id);
      break;
    default: {
      const neverEntity: never = entity;
      throw new Error(`Bilinmeyen kayıt türü: ${String(neverEntity)}`);
    }
  }
  if (!removed) {
    throw new Error("Kayıt bulunamadı");
  }
  return readCmsSnapshotFromMysql();
}

export function newCmsId(): string {
  return randomUUID();
}
