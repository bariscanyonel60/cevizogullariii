import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import {
  brandHref,
  brandPages,
  CATEGORY_INDEX_MIN_PRODUCTS,
  CATEGORY_LANDINGS,
  categoryHref,
} from "@/lib/catalog";
import {
  getBlogPosts,
  getBrands,
  getOrmanPages,
  getProducts,
  getProjects,
} from "@/lib/cms-store";

/** Sitemap yenileme tarihi — IA / içerik güncellemeleri sonrası güncelleyin */
const SITE_LAST_MODIFIED = new Date("2026-09-05");

type StaticRoute = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

/**
 * Indexlenebilir public rotalar.
 * Redirect’ler (/urunler, /kereste, /gayrimenkul) ve noIndex sayfalar (/tesekkurler) dahil edilmez.
 */
const STATIC_ROUTES: StaticRoute[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/yapi-malzemeleri", priority: 0.95, changeFrequency: "weekly" },
  { path: "/tokat", priority: 0.95, changeFrequency: "weekly" },
  { path: "/orman-urunleri", priority: 0.9, changeFrequency: "weekly" },
  { path: "/yapi-insaat", priority: 0.9, changeFrequency: "weekly" },
  { path: "/projelerimiz", priority: 0.85, changeFrequency: "weekly" },
  { path: "/galeri", priority: 0.8, changeFrequency: "weekly" },
  { path: "/teklif-al", priority: 0.85, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.75, changeFrequency: "weekly" },
  { path: "/markalar", priority: 0.6, changeFrequency: "monthly" },
  { path: "/kurumsal", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gizlilik-politikasi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/kvkk", priority: 0.3, changeFrequency: "yearly" },
];

function entry(
  path: string,
  options: {
    priority: number;
    changeFrequency: NonNullable<
      MetadataRoute.Sitemap[number]["changeFrequency"]
    >;
    lastModified?: Date;
  },
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE.url}${path}`,
    lastModified: options.lastModified ?? SITE_LAST_MODIFIED,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ormanPages, products, projects, blogPosts, brands] = await Promise.all([
    getOrmanPages(),
    getProducts(),
    getProjects(),
    getBlogPosts(),
    getBrands(),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) =>
    entry(route.path, {
      priority: route.priority,
      changeFrequency: route.changeFrequency,
    }),
  );

  const ormanEntries = ormanPages
    .filter((p) => p.slug !== "index")
    .map((page) =>
      entry(page.href, {
        priority: 0.82,
        changeFrequency: "weekly",
      }),
  );

  const categoryEntries = Object.values(CATEGORY_LANDINGS)
    .filter(
      (landing) =>
        products.filter((product) => product.category === landing.key).length >=
        CATEGORY_INDEX_MIN_PRODUCTS,
    )
    .map((landing) =>
      entry(categoryHref(landing.key), {
        priority: 0.85,
        changeFrequency: "weekly",
      }),
    );

  const brandEntries = brandPages(brands, products)
    .filter((page) => page.products.length >= 2)
    .map((page) =>
      entry(brandHref(page.slug), {
        priority: 0.6,
        changeFrequency: "monthly",
      }),
    );

  const productEntries = products.map((product) =>
    entry(`/yapi-malzemeleri/${product.slug}`, {
      priority: 0.72,
      changeFrequency: "weekly",
    }),
  );

  const projectEntries = projects.map((project) =>
    entry(`/projelerimiz/${project.slug}`, {
      priority: 0.65,
      changeFrequency: "monthly",
    }),
  );

  const blogEntries = blogPosts.map((post) =>
    entry(`/blog/${post.slug}`, {
      priority: 0.65,
      changeFrequency: "monthly",
      lastModified: new Date(post.publishedAt),
    }),
  );

  return [
    ...staticEntries,
    ...ormanEntries,
    ...categoryEntries,
    ...brandEntries,
    ...productEntries,
    ...projectEntries,
    ...blogEntries,
  ];
}
