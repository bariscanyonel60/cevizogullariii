import { YAPI_INSAAT_MEDIA } from "@/data/yapi-insaat-media";

export type MediaCollection = "gallery" | "yapi-insaat";

export type MediaItem = {
  id: string;
  url: string;
  publicId: string;
  title?: string;
  alt: string;
  visible?: boolean;
  createdAt: string;
};

export const MEDIA_COLLECTIONS: MediaCollection[] = ["gallery", "yapi-insaat"];

export function isMediaCollection(value: string): value is MediaCollection {
  return MEDIA_COLLECTIONS.includes(value as MediaCollection);
}

/** Blobs boşken public sayfalarda gösterilecek yerel seed görseller */
export const MEDIA_FALLBACKS: Record<MediaCollection, MediaItem[]> = {
  gallery: [
    {
      id: "seed-gallery-1",
      url: "/projects/modern-konut-cephe.jpg",
      publicId: "cevizogullari/projects/modern-konut-cephe",
      title: "Modern konut cephe",
      alt: "Modern konut cephe uygulaması — Turhal",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "seed-gallery-2",
      url: "/projects/modern-konut-bahce.jpg",
      publicId: "cevizogullari/projects/modern-konut-bahce",
      title: "Konut bahçe",
      alt: "Konut bahçe ve cephe detayı — Tokat",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "seed-gallery-3",
      url: "/products/dis-cephe-ev.jpg",
      publicId: "cevizogullari/products/dis-cephe-ev",
      title: "Dış cephe boya",
      alt: "Dış cephe boya uygulaması",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "seed-gallery-4",
      url: "/products/mantolama-saha.jpg",
      publicId: "cevizogullari/products/mantolama-saha",
      title: "Mantolama sahası",
      alt: "Mantolama saha çalışması",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "seed-gallery-5",
      url: "/products/cephe-boyali.jpg",
      publicId: "cevizogullari/products/cephe-boyali",
      title: "Boyalı cephe",
      alt: "Boyalı dış cephe örneği",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "seed-gallery-6",
      url: "/about-project.jpg",
      publicId: "cevizogullari/about-project",
      title: "Proje sahası",
      alt: "Cevizoğulları proje sahası",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  "yapi-insaat": YAPI_INSAAT_MEDIA.map((item) => ({ ...item })),
};
