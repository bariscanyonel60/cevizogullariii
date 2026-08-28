import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db/pool";
import type {
  CmsBrand,
  CmsCategoryShowcase,
  CmsExteriorPackage,
  CmsFaq,
  CmsSiteCard,
  CmsSnapshot,
  FaqPage,
  SiteCardKind,
} from "@/lib/cms-types";
import type { OrmanUrunleriPage } from "@/data/orman-urunleri";
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

const PRODUCT_CATEGORIES = new Set<ProductCategory>([
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
]);

const USE_CASES = new Set<ProductUseCase>([
  "dis-cephe",
  "ic-mekan",
  "cati",
  "genel",
]);

const PROJECT_CATEGORIES = new Set<ProjectCategory>([
  "konut",
  "ticari",
  "restorasyon",
  "peyzaj",
  "dis-cephe",
  "yapi",
]);

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS cms_products (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(32) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    unit VARCHAR(64) NOT NULL,
    image TEXT NOT NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    use_cases JSON NOT NULL,
    specs JSON NOT NULL,
    catalog_pdf VARCHAR(512) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    UNIQUE KEY uq_cms_products_slug (slug),
    INDEX idx_cms_products_category (category),
    INDEX idx_cms_products_featured (featured)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_brands (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    blurb VARCHAR(512) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_category_showcase (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    category_key VARCHAR(32) NOT NULL,
    label VARCHAR(128) NOT NULL,
    description VARCHAR(512) NOT NULL,
    image TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    UNIQUE KEY uq_cms_showcase_key (category_key)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_exterior_package (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    items JSON NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_blog_posts (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content MEDIUMTEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    tags JSON NOT NULL,
    cover_image TEXT NOT NULL,
    author VARCHAR(128) NOT NULL,
    published_at DATE NOT NULL,
    reading_time INT NOT NULL DEFAULT 1,
    UNIQUE KEY uq_cms_blog_slug (slug),
    INDEX idx_cms_blog_published (published_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_projects (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(32) NOT NULL,
    location VARCHAR(255) NOT NULL,
    year SMALLINT NOT NULL,
    images JSON NOT NULL,
    before_image TEXT NULL,
    after_image TEXT NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    instagram_url TEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    UNIQUE KEY uq_cms_projects_slug (slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_orman_pages (
    slug VARCHAR(64) NOT NULL PRIMARY KEY,
    href VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    nav_label VARCHAR(128) NOT NULL,
    eyebrow VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    keywords JSON NOT NULL,
    image TEXT NOT NULL,
    highlights JSON NOT NULL,
    body JSON NOT NULL,
    related_slugs JSON NOT NULL,
    related_categories JSON NULL,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_stats (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    value INT NOT NULL,
    suffix VARCHAR(16) NOT NULL,
    label VARCHAR(128) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_testimonials (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    role VARCHAR(128) NOT NULL,
    quote TEXT NOT NULL,
    rating TINYINT NOT NULL DEFAULT 5,
    sort_order INT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_site_cards (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    kind ENUM('why_us', 'services', 'process', 'audience') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    href VARCHAR(255) NULL,
    step VARCHAR(16) NULL,
    points JSON NULL,
    sort_order INT NOT NULL DEFAULT 0,
    INDEX idx_cms_cards_kind (kind, sort_order)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_faqs (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    page ENUM('home', 'tokat') NOT NULL,
    question VARCHAR(512) NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    INDEX idx_cms_faqs_page (page, sort_order)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

type CountRow = RowDataPacket & { n: number | string };
type ProductRow = RowDataPacket & {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  unit: string;
  image: string;
  featured: number;
  use_cases: unknown;
  specs: unknown;
  catalog_pdf: string | null;
};
type BrandRow = RowDataPacket & {
  id: string;
  name: string;
  blurb: string;
};
type ShowcaseRow = RowDataPacket & {
  id: string;
  category_key: string;
  label: string;
  description: string;
  image: string;
};
type ExteriorRow = RowDataPacket & {
  id: string;
  title: string;
  items: unknown;
};
type BlogRow = RowDataPacket & {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: unknown;
  cover_image: string;
  author: string;
  published_at: string;
  reading_time: number;
};
type ProjectRow = RowDataPacket & {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  location: string;
  year: number;
  images: unknown;
  before_image: string | null;
  after_image: string | null;
  featured: number;
  instagram_url: string | null;
};
type OrmanRow = RowDataPacket & {
  slug: string;
  href: string;
  title: string;
  nav_label: string;
  eyebrow: string;
  description: string;
  meta_title: string;
  meta_description: string;
  keywords: unknown;
  image: string;
  highlights: unknown;
  body: unknown;
  related_slugs: unknown;
  related_categories: unknown;
};
type StatRow = RowDataPacket & {
  id: string;
  value: number;
  suffix: string;
  label: string;
};
type TestimonialRow = RowDataPacket & {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};
type CardRow = RowDataPacket & {
  id: string;
  kind: SiteCardKind;
  title: string;
  description: string;
  href: string | null;
  step: string | null;
  points: unknown;
};
type FaqRow = RowDataPacket & {
  id: string;
  page: FaqPage;
  question: string;
  answer: string;
};

let schemaPromise: Promise<void> | null = null;

export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function toJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function asCategory(value: string): ProductCategory | null {
  return PRODUCT_CATEGORIES.has(value as ProductCategory)
    ? (value as ProductCategory)
    : null;
}

function asUseCases(value: unknown): ProductUseCase[] {
  const items = parseJson<unknown[]>(value, []);
  return items.filter((item): item is ProductUseCase =>
    typeof item === "string" && USE_CASES.has(item as ProductUseCase),
  );
}

function asSpecs(value: unknown): Product["specs"] {
  const items = parseJson<unknown[]>(value, []);
  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { label?: unknown; value?: unknown };
      if (typeof record.label !== "string" || typeof record.value !== "string") {
        return null;
      }
      return { label: record.label, value: record.value };
    })
    .filter((item): item is Product["specs"][number] => item !== null);
}

function asProjectCategory(value: string): ProjectCategory | null {
  return PROJECT_CATEGORIES.has(value as ProjectCategory)
    ? (value as ProjectCategory)
    : null;
}

function asStringArray(value: unknown): string[] {
  const items = parseJson<unknown[]>(value, []);
  return items.filter((item): item is string => typeof item === "string");
}

function mapProduct(row: ProductRow): Product | null {
  const category = asCategory(row.category);
  if (!category) return null;
  const product: Product = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category,
    brand: row.brand,
    unit: row.unit,
    image: row.image,
    useCases: asUseCases(row.use_cases),
    specs: asSpecs(row.specs),
  };
  if (row.featured) product.featured = true;
  if (row.catalog_pdf) product.catalogPdf = row.catalog_pdf;
  return product;
}

function mapOrman(row: OrmanRow): OrmanUrunleriPage {
  const relatedCategories = asStringArray(row.related_categories).filter(
    (item): item is ProductCategory => Boolean(asCategory(item)),
  );
  return {
    slug: row.slug,
    href: row.href,
    title: row.title,
    navLabel: row.nav_label,
    eyebrow: row.eyebrow,
    description: row.description,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: asStringArray(row.keywords),
    image: row.image,
    highlights: parseJson<{ title: string; text: string }[]>(row.highlights, []),
    body: asStringArray(row.body),
    relatedSlugs: asStringArray(row.related_slugs),
    relatedCategories: relatedCategories.length > 0 ? relatedCategories : undefined,
  };
}

export async function ensureCmsSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const pool = getPool();
      for (const statement of SCHEMA_STATEMENTS) {
        await pool.query(statement);
      }
      await pool.query(
        `UPDATE cms_faqs
         SET question = ?
         WHERE id = 'home-faq-1'
           AND question LIKE ?`,
        [
          "Tokat yapı malzemeleri nereden alınır?",
          "%yapı malzemesi nereden alınır%",
        ],
      );
    })();
  }
  await schemaPromise;
}

export async function getCmsTableCounts(): Promise<Record<string, number>> {
  const pool = getPool();
  const tables = [
    "cms_products",
    "cms_brands",
    "cms_category_showcase",
    "cms_exterior_package",
    "cms_blog_posts",
    "cms_projects",
    "cms_orman_pages",
    "cms_stats",
    "cms_testimonials",
    "cms_site_cards",
    "cms_faqs",
  ] as const;
  const counts: Record<string, number> = {};
  for (const table of tables) {
    const [rows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) AS n FROM ${table}`,
    );
    counts[table] = Number(rows[0]?.n ?? 0);
  }
  return counts;
}

export async function readCmsSnapshotFromMysql(): Promise<CmsSnapshot> {
  const pool = getPool();
  const [
    productRows,
    brandRows,
    showcaseRows,
    exteriorRows,
    blogRows,
    projectRows,
    ormanRows,
    statRows,
    testimonialRows,
    cardRows,
    faqRows,
  ] = await Promise.all([
    pool.query<ProductRow[]>(
      "SELECT * FROM cms_products ORDER BY sort_order ASC, title ASC",
    ),
    pool.query<BrandRow[]>(
      "SELECT * FROM cms_brands ORDER BY sort_order ASC, name ASC",
    ),
    pool.query<ShowcaseRow[]>(
      "SELECT * FROM cms_category_showcase ORDER BY sort_order ASC, label ASC",
    ),
    pool.query<ExteriorRow[]>(
      "SELECT * FROM cms_exterior_package ORDER BY sort_order ASC, title ASC",
    ),
    pool.query<BlogRow[]>(
      "SELECT * FROM cms_blog_posts ORDER BY published_at DESC, title ASC",
    ),
    pool.query<ProjectRow[]>(
      "SELECT * FROM cms_projects ORDER BY sort_order ASC, year DESC, title ASC",
    ),
    pool.query<OrmanRow[]>(
      "SELECT * FROM cms_orman_pages ORDER BY sort_order ASC, title ASC",
    ),
    pool.query<StatRow[]>(
      "SELECT * FROM cms_stats ORDER BY sort_order ASC, label ASC",
    ),
    pool.query<TestimonialRow[]>(
      "SELECT * FROM cms_testimonials ORDER BY sort_order ASC, name ASC",
    ),
    pool.query<CardRow[]>(
      "SELECT * FROM cms_site_cards ORDER BY kind ASC, sort_order ASC, title ASC",
    ),
    pool.query<FaqRow[]>(
      "SELECT * FROM cms_faqs ORDER BY page ASC, sort_order ASC",
    ),
  ]);

  return {
    products: productRows[0].map(mapProduct).filter((item): item is Product => item !== null),
    brands: brandRows[0].map((row) => ({
      id: row.id,
      name: row.name,
      blurb: row.blurb,
    })),
    showcase: showcaseRows[0]
      .map((row) => {
        const key = asCategory(row.category_key);
        if (!key) return null;
        return {
          id: row.id,
          key,
          label: row.label,
          description: row.description,
          image: row.image,
        } satisfies CmsCategoryShowcase;
      })
      .filter((item): item is CmsCategoryShowcase => item !== null),
    exterior: exteriorRows[0].map((row) => ({
      id: row.id,
      title: row.title,
      items: asStringArray(row.items),
    })),
    posts: blogRows[0].map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category,
      tags: asStringArray(row.tags),
      coverImage: row.cover_image,
      author: row.author,
      publishedAt: String(row.published_at).slice(0, 10),
      readingTime: Number(row.reading_time) || 1,
    })),
    projects: projectRows[0]
      .map((row) => {
        const category = asProjectCategory(row.category);
        if (!category) return null;
        const project: Project = {
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          category,
          location: row.location,
          year: Number(row.year),
          images: asStringArray(row.images),
        };
        if (row.before_image) project.beforeImage = row.before_image;
        if (row.after_image) project.afterImage = row.after_image;
        if (row.featured) project.featured = true;
        if (row.instagram_url) project.instagramUrl = row.instagram_url;
        return project;
      })
      .filter((item): item is Project => item !== null),
    ormanPages: ormanRows[0].map(mapOrman),
    stats: statRows[0].map((row) => ({
      id: row.id,
      value: Number(row.value),
      suffix: row.suffix,
      label: row.label,
    })),
    testimonials: testimonialRows[0].map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      quote: row.quote,
      rating: Number(row.rating) || 5,
    })),
    cards: cardRows[0].map((row) => {
      const card: CmsSiteCard = {
        id: row.id,
        kind: row.kind,
        title: row.title,
        description: row.description,
      };
      if (row.href) card.href = row.href;
      if (row.step) card.step = row.step;
      const points = asStringArray(row.points);
      if (points.length > 0) card.points = points;
      return card;
    }),
    faqs: faqRows[0].map((row) => ({
      id: row.id,
      page: row.page,
      question: row.question,
      answer: row.answer,
    })),
  };
}

export async function replaceCmsSnapshot(snapshot: CmsSnapshot): Promise<void> {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM cms_faqs");
    await conn.query("DELETE FROM cms_site_cards");
    await conn.query("DELETE FROM cms_testimonials");
    await conn.query("DELETE FROM cms_stats");
    await conn.query("DELETE FROM cms_orman_pages");
    await conn.query("DELETE FROM cms_projects");
    await conn.query("DELETE FROM cms_blog_posts");
    await conn.query("DELETE FROM cms_exterior_package");
    await conn.query("DELETE FROM cms_category_showcase");
    await conn.query("DELETE FROM cms_brands");
    await conn.query("DELETE FROM cms_products");

    for (const [index, product] of snapshot.products.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_products
          (id, slug, title, description, category, brand, unit, image, featured, use_cases, specs, catalog_pdf, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.slug,
          product.title,
          product.description,
          product.category,
          product.brand,
          product.unit,
          product.image,
          product.featured ? 1 : 0,
          toJson(product.useCases),
          toJson(product.specs),
          product.catalogPdf ?? null,
          index,
        ],
      );
    }

    for (const [index, brand] of snapshot.brands.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_brands (id, name, blurb, sort_order) VALUES (?, ?, ?, ?)`,
        [brand.id, brand.name, brand.blurb, index],
      );
    }

    for (const [index, item] of snapshot.showcase.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_category_showcase
          (id, category_key, label, description, image, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [item.id, item.key, item.label, item.description, item.image, index],
      );
    }

    for (const [index, item] of snapshot.exterior.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_exterior_package (id, title, items, sort_order) VALUES (?, ?, ?, ?)`,
        [item.id, item.title, toJson(item.items), index],
      );
    }

    for (const post of snapshot.posts) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_blog_posts
          (id, slug, title, excerpt, content, category, tags, cover_image, author, published_at, reading_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.id,
          post.slug,
          post.title,
          post.excerpt,
          post.content,
          post.category,
          toJson(post.tags),
          post.coverImage,
          post.author,
          post.publishedAt,
          post.readingTime,
        ],
      );
    }

    for (const [index, project] of snapshot.projects.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_projects
          (id, slug, title, description, category, location, year, images, before_image, after_image, featured, instagram_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.id,
          project.slug,
          project.title,
          project.description,
          project.category,
          project.location,
          project.year,
          toJson(project.images),
          project.beforeImage ?? null,
          project.afterImage ?? null,
          project.featured ? 1 : 0,
          project.instagramUrl ?? null,
          index,
        ],
      );
    }

    for (const [index, page] of snapshot.ormanPages.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_orman_pages
          (slug, href, title, nav_label, eyebrow, description, meta_title, meta_description, keywords, image, highlights, body, related_slugs, related_categories, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          page.slug,
          page.href,
          page.title,
          page.navLabel,
          page.eyebrow,
          page.description,
          page.metaTitle,
          page.metaDescription,
          toJson(page.keywords),
          page.image,
          toJson(page.highlights),
          toJson(page.body),
          toJson(page.relatedSlugs),
          toJson(page.relatedCategories ?? []),
          index,
        ],
      );
    }

    for (const [index, stat] of snapshot.stats.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_stats (id, value, suffix, label, sort_order) VALUES (?, ?, ?, ?, ?)`,
        [stat.id, stat.value, stat.suffix, stat.label, index],
      );
    }

    for (const [index, item] of snapshot.testimonials.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_testimonials (id, name, role, quote, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [item.id, item.name, item.role, item.quote, item.rating, index],
      );
    }

    for (const [index, card] of snapshot.cards.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_site_cards
          (id, kind, title, description, href, step, points, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          card.id,
          card.kind,
          card.title,
          card.description,
          card.href ?? null,
          card.step ?? null,
          toJson(card.points ?? []),
          index,
        ],
      );
    }

    for (const [index, faq] of snapshot.faqs.entries()) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO cms_faqs (id, page, question, answer, sort_order) VALUES (?, ?, ?, ?, ?)`,
        [faq.id, faq.page, faq.question, faq.answer, index],
      );
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function nextSortOrder(table: string): Promise<number> {
  const pool = getPool();
  const [rows] = await pool.query<CountRow[]>(
    `SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM ${table}`,
  );
  return Number(rows[0]?.n ?? 0);
}

export async function upsertProductRow(product: Product): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_products");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_products
      (id, slug, title, description, category, brand, unit, image, featured, use_cases, specs, catalog_pdf, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      slug = VALUES(slug),
      title = VALUES(title),
      description = VALUES(description),
      category = VALUES(category),
      brand = VALUES(brand),
      unit = VALUES(unit),
      image = VALUES(image),
      featured = VALUES(featured),
      use_cases = VALUES(use_cases),
      specs = VALUES(specs),
      catalog_pdf = VALUES(catalog_pdf)`,
    [
      product.id,
      product.slug,
      product.title,
      product.description,
      product.category,
      product.brand,
      product.unit,
      product.image,
      product.featured ? 1 : 0,
      toJson(product.useCases),
      toJson(product.specs),
      product.catalogPdf ?? null,
      sort,
    ],
  );
}

export async function deleteProductRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_products WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertBrandRow(brand: CmsBrand): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_brands");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_brands (id, name, blurb, sort_order)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), blurb = VALUES(blurb)`,
    [brand.id, brand.name, brand.blurb, sort],
  );
}

export async function deleteBrandRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_brands WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertShowcaseRow(item: CmsCategoryShowcase): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_category_showcase");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_category_showcase
      (id, category_key, label, description, image, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      category_key = VALUES(category_key),
      label = VALUES(label),
      description = VALUES(description),
      image = VALUES(image)`,
    [item.id, item.key, item.label, item.description, item.image, sort],
  );
}

export async function deleteShowcaseRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_category_showcase WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertExteriorRow(item: CmsExteriorPackage): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_exterior_package");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_exterior_package (id, title, items, sort_order)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), items = VALUES(items)`,
    [item.id, item.title, toJson(item.items), sort],
  );
}

export async function deleteExteriorRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_exterior_package WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertBlogRow(post: BlogPost): Promise<void> {
  const pool = getPool();
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_blog_posts
      (id, slug, title, excerpt, content, category, tags, cover_image, author, published_at, reading_time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      slug = VALUES(slug),
      title = VALUES(title),
      excerpt = VALUES(excerpt),
      content = VALUES(content),
      category = VALUES(category),
      tags = VALUES(tags),
      cover_image = VALUES(cover_image),
      author = VALUES(author),
      published_at = VALUES(published_at),
      reading_time = VALUES(reading_time)`,
    [
      post.id,
      post.slug,
      post.title,
      post.excerpt,
      post.content,
      post.category,
      toJson(post.tags),
      post.coverImage,
      post.author,
      post.publishedAt,
      post.readingTime,
    ],
  );
}

export async function deleteBlogRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_blog_posts WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertProjectRow(project: Project): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_projects");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_projects
      (id, slug, title, description, category, location, year, images, before_image, after_image, featured, instagram_url, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      slug = VALUES(slug),
      title = VALUES(title),
      description = VALUES(description),
      category = VALUES(category),
      location = VALUES(location),
      year = VALUES(year),
      images = VALUES(images),
      before_image = VALUES(before_image),
      after_image = VALUES(after_image),
      featured = VALUES(featured),
      instagram_url = VALUES(instagram_url)`,
    [
      project.id,
      project.slug,
      project.title,
      project.description,
      project.category,
      project.location,
      project.year,
      toJson(project.images),
      project.beforeImage ?? null,
      project.afterImage ?? null,
      project.featured ? 1 : 0,
      project.instagramUrl ?? null,
      sort,
    ],
  );
}

export async function deleteProjectRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_projects WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertOrmanRow(page: OrmanUrunleriPage): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_orman_pages");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_orman_pages
      (slug, href, title, nav_label, eyebrow, description, meta_title, meta_description, keywords, image, highlights, body, related_slugs, related_categories, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      href = VALUES(href),
      title = VALUES(title),
      nav_label = VALUES(nav_label),
      eyebrow = VALUES(eyebrow),
      description = VALUES(description),
      meta_title = VALUES(meta_title),
      meta_description = VALUES(meta_description),
      keywords = VALUES(keywords),
      image = VALUES(image),
      highlights = VALUES(highlights),
      body = VALUES(body),
      related_slugs = VALUES(related_slugs),
      related_categories = VALUES(related_categories)`,
    [
      page.slug,
      page.href,
      page.title,
      page.navLabel,
      page.eyebrow,
      page.description,
      page.metaTitle,
      page.metaDescription,
      toJson(page.keywords),
      page.image,
      toJson(page.highlights),
      toJson(page.body),
      toJson(page.relatedSlugs),
      toJson(page.relatedCategories ?? []),
      sort,
    ],
  );
}

export async function deleteOrmanRow(slug: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_orman_pages WHERE slug = ?",
    [slug],
  );
  return result.affectedRows > 0;
}

export async function upsertStatRow(stat: StatItem): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_stats");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_stats (id, value, suffix, label, sort_order)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value), suffix = VALUES(suffix), label = VALUES(label)`,
    [stat.id, stat.value, stat.suffix, stat.label, sort],
  );
}

export async function deleteStatRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_stats WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertTestimonialRow(item: Testimonial): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_testimonials");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_testimonials (id, name, role, quote, rating, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), quote = VALUES(quote), rating = VALUES(rating)`,
    [item.id, item.name, item.role, item.quote, item.rating, sort],
  );
}

export async function deleteTestimonialRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_testimonials WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertCardRow(card: CmsSiteCard): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_site_cards");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_site_cards
      (id, kind, title, description, href, step, points, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      kind = VALUES(kind),
      title = VALUES(title),
      description = VALUES(description),
      href = VALUES(href),
      step = VALUES(step),
      points = VALUES(points)`,
    [
      card.id,
      card.kind,
      card.title,
      card.description,
      card.href ?? null,
      card.step ?? null,
      toJson(card.points ?? []),
      sort,
    ],
  );
}

export async function deleteCardRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_site_cards WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function upsertFaqRow(faq: CmsFaq): Promise<void> {
  const pool = getPool();
  const sort = await nextSortOrder("cms_faqs");
  await pool.query<ResultSetHeader>(
    `INSERT INTO cms_faqs (id, page, question, answer, sort_order)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE page = VALUES(page), question = VALUES(question), answer = VALUES(answer)`,
    [faq.id, faq.page, faq.question, faq.answer, sort],
  );
}

export async function deleteFaqRow(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cms_faqs WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}
