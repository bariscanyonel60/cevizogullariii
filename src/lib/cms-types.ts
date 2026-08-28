import type {
  BlogPost,
  Product,
  ProductCategory,
  Project,
  StatItem,
  Testimonial,
} from "@/types";
import type { OrmanUrunleriPage } from "@/data/orman-urunleri";

export type FaqPage = "home" | "tokat";
export type SiteCardKind = "why_us" | "services" | "process" | "audience";

export type CmsBrand = {
  id: string;
  name: string;
  blurb: string;
};

export type CmsFaq = {
  id: string;
  page: FaqPage;
  question: string;
  answer: string;
};

export type CmsSiteCard = {
  id: string;
  kind: SiteCardKind;
  title: string;
  description: string;
  href?: string;
  step?: string;
  points?: string[];
};

export type CmsCategoryShowcase = {
  id: string;
  key: ProductCategory;
  label: string;
  description: string;
  image: string;
};

export type CmsExteriorPackage = {
  id: string;
  title: string;
  items: string[];
};

export type NavCms = {
  categories: CmsCategoryShowcase[];
  ormanPages: OrmanUrunleriPage[];
};

export type CmsSnapshot = {
  products: Product[];
  brands: CmsBrand[];
  showcase: CmsCategoryShowcase[];
  exterior: CmsExteriorPackage[];
  posts: BlogPost[];
  projects: Project[];
  ormanPages: OrmanUrunleriPage[];
  stats: StatItem[];
  testimonials: Testimonial[];
  cards: CmsSiteCard[];
  faqs: CmsFaq[];
};

export type CmsEntity =
  | "product"
  | "brand"
  | "showcase"
  | "exterior"
  | "blog"
  | "project"
  | "orman"
  | "stat"
  | "testimonial"
  | "card"
  | "faq";

export const CMS_ENTITIES: CmsEntity[] = [
  "product",
  "brand",
  "showcase",
  "exterior",
  "blog",
  "project",
  "orman",
  "stat",
  "testimonial",
  "card",
  "faq",
];

export function isCmsEntity(value: string): value is CmsEntity {
  return (CMS_ENTITIES as string[]).includes(value);
}

export function isFaqPage(value: string): value is FaqPage {
  return value === "home" || value === "tokat";
}

export function isSiteCardKind(value: string): value is SiteCardKind {
  return (
    value === "why_us" ||
    value === "services" ||
    value === "process" ||
    value === "audience"
  );
}
