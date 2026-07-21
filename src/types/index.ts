export type PropertyStatus = "satilik" | "kiralik" | "rezerve";
export type PropertyCategory = "konut" | "villa" | "arsa" | "isyeri" | "ofis";

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  city: string;
  district: string;
  category: PropertyCategory;
  status: PropertyStatus;
  area: number;
  rooms: string;
  bathrooms: number;
  features: string[];
  images: string[];
  featured?: boolean;
  lat?: number;
  lng?: number;
}

/** Ürün kategori kodları — dış cephe ve genel yapı market. */
export type ProductCategory =
  | "boya"
  | "izolasyon"
  | "cati"
  | "cephe"
  | "orman"
  | "cimento"
  | "siva"
  | "demir"
  | "ahsap"
  | "boru"
  | "nalbur";

export type ProductUseCase = "dis-cephe" | "ic-mekan" | "cati" | "genel";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProductCategory;
  brand: string;
  unit: string;
  image: string;
  featured?: boolean;
  /** Evin dışı / çatı vb. kullanım alanları */
  useCases: ProductUseCase[];
  specs: { label: string; value: string }[];
  catalogPdf?: string;
}

export type ProjectCategory =
  | "konut"
  | "ticari"
  | "restorasyon"
  | "peyzaj"
  | "dis-cephe"
  | "yapi";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  location: string;
  year: number;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  featured?: boolean;
  /** Instagram profil veya gönderi linki */
  instagramUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  publishedAt: string;
  readingTime: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}
