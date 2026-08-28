import { blogPosts } from "@/data/blog";
import {
  audienceSegments,
  processSteps,
  services,
  stats,
  testimonials,
  whyUs,
} from "@/data/content";
import { ORMAN_URUNLERI_PAGES } from "@/data/orman-urunleri";
import {
  BRANDS,
  CATEGORY_SHOWCASE,
  EXTERIOR_PACKAGE,
  products,
} from "@/data/products";
import { projects } from "@/data/projects";
import { HOME_FAQS, TOKAT_FAQS } from "@/lib/constants";
import type { CmsSnapshot } from "@/lib/cms-types";

export function fallbackCmsSnapshot(): CmsSnapshot {
  return {
    products: products.map((item) => ({ ...item })),
    brands: BRANDS.map((brand, index) => ({
      id: `brand-${index + 1}`,
      name: brand.name,
      blurb: brand.blurb,
    })),
    showcase: CATEGORY_SHOWCASE.map((item) => ({
      id: `show-${item.key}`,
      key: item.key,
      label: item.label,
      description: item.description,
      image: item.image,
    })),
    exterior: EXTERIOR_PACKAGE.map((item, index) => ({
      id: `ext-${index + 1}`,
      title: item.title,
      items: [...item.items],
    })),
    posts: blogPosts.map((item) => ({ ...item, tags: [...item.tags] })),
    projects: projects.map((item) => ({
      ...item,
      images: [...item.images],
    })),
    ormanPages: ORMAN_URUNLERI_PAGES.map((page) => ({
      ...page,
      keywords: [...page.keywords],
      highlights: page.highlights.map((item) => ({ ...item })),
      body: [...page.body],
      relatedSlugs: [...page.relatedSlugs],
      relatedCategories: page.relatedCategories
        ? [...page.relatedCategories]
        : undefined,
    })),
    stats: stats.map((item) => ({ ...item })),
    testimonials: testimonials.map((item) => ({ ...item })),
    cards: [
      ...whyUs.map((item, index) => ({
        id: `why-${index + 1}`,
        kind: "why_us" as const,
        title: item.title,
        description: item.description,
      })),
      ...services.map((item, index) => ({
        id: `svc-${index + 1}`,
        kind: "services" as const,
        title: item.title,
        description: item.description,
        href: item.href,
      })),
      ...processSteps.map((item, index) => ({
        id: `proc-${index + 1}`,
        kind: "process" as const,
        title: item.title,
        description: item.description,
        step: item.step,
      })),
      ...audienceSegments.map((item, index) => ({
        id: `aud-${index + 1}`,
        kind: "audience" as const,
        title: item.title,
        description: item.description,
        points: [...item.points],
      })),
    ],
    faqs: [
      ...HOME_FAQS.map((item, index) => ({
        id: `home-faq-${index + 1}`,
        page: "home" as const,
        question: item.question,
        answer: item.answer,
      })),
      ...TOKAT_FAQS.map((item, index) => ({
        id: `tokat-faq-${index + 1}`,
        page: "tokat" as const,
        question: item.question,
        answer: item.answer,
      })),
    ],
  };
}
