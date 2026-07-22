import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { products } from "@/data/products";
import { projects } from "@/data/projects";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/kurumsal",
    "/kvkk",
    "/yapi-malzemeleri",
    "/urunler",
    "/projelerimiz",
    "/tokat",
    "/blog",
    "/iletisim",
    "/teklif-al",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const dynamicRoutes = [
    ...products.map((p) => ({
      url: `${SITE.url}/yapi-malzemeleri/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: `${SITE.url}/projelerimiz/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...blogPosts.map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
