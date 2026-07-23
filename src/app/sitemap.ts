import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { ORMAN_URUNLERI_PAGES } from "@/data/orman-urunleri";
import { products } from "@/data/products";
import { projects } from "@/data/projects";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/yapi-malzemeleri", priority: 0.95, changeFrequency: "weekly" },
    { path: "/tokat", priority: 0.95, changeFrequency: "weekly" },
    { path: "/orman-urunleri", priority: 0.9, changeFrequency: "weekly" },
    { path: "/yapi-insaat", priority: 0.9, changeFrequency: "weekly" },
    { path: "/projelerimiz", priority: 0.8, changeFrequency: "weekly" },
    { path: "/kurumsal", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.75, changeFrequency: "weekly" },
    { path: "/iletisim", priority: 0.8, changeFrequency: "monthly" },
    { path: "/teklif-al", priority: 0.85, changeFrequency: "monthly" },
    { path: "/kvkk", priority: 0.3, changeFrequency: "monthly" },
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const ormanRoutes = ORMAN_URUNLERI_PAGES.filter((p) => p.slug !== "index").map(
    (page) => ({
      url: `${SITE.url}${page.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  const dynamicRoutes = [
    ...products.map((p) => ({
      url: `${SITE.url}/yapi-malzemeleri/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.72,
    })),
    ...projects.map((p) => ({
      url: `${SITE.url}/projelerimiz/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...blogPosts.map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  return [...staticEntries, ...ormanRoutes, ...dynamicRoutes];
}
