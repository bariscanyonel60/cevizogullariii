import type { Project } from "@/types";
import { SITE } from "@/lib/constants";

const IG = SITE.social.instagram;
const UPLOAD = "https://cevizogullari.com/wp-content/uploads";

/**
 * Gerçek proje görselleri — mevcut sitedeki galeri (Instagram / saha fotoğrafları).
 * Instagram API kapalı olduğu için görseller cevizogullari.com üzerinden alındı;
 * her proje Instagram profiline bağlandı: https://www.instagram.com/cevizogullari/
 */
export const projects: Project[] = [
  {
    id: "0",
    slug: "modern-konut-kompleksi",
    title: "Modern Konut Kompleksi",
    description:
      "Çağdaş cephe kaplaması, ahşap dokulu detaylar ve peyzaj aydınlatmasıyla tamamlanan çok katlı konut uygulaması. Dış cephe boya, mantolama ve bitiş malzemelerinde uçtan uca tedarik ve uygulama desteği.",
    category: "konut",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      "/projects/modern-konut-cephe.jpg",
      "/projects/modern-konut-bahce.jpg",
    ],
    beforeImage: "/projects/modern-konut-bahce.jpg",
    afterImage: "/projects/modern-konut-cephe.jpg",
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "1",
    slug: "dis-cephe-uygulama-turhal",
    title: "Dış Cephe Uygulama",
    description:
      "Turhal’da dış cephe boya ve mantolama uygulamalarımızdan örnekler. Permolit ve yalıtım ürünleriyle uzun ömürlü cephe çözümleri.",
    category: "dis-cephe",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.47.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.47-1.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.47-2.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.47-3.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.47-4.jpeg`,
    ],
    beforeImage: `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.45.jpeg`,
    afterImage: `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.47.jpeg`,
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "2",
    slug: "santiye-malzeme-tedarik",
    title: "Şantiye Malzeme Tedariki",
    description:
      "Şantiye ve usta ihtiyaçlarına yönelik hızlı tedarik. Orman ürünleri, yalıtım ve inşaat malzemeleriyle proje temposuna uyum.",
    category: "yapi",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.35-2.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.35.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.35-1.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.35-3.jpeg`,
    ],
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "3",
    slug: "cati-ve-yalitim",
    title: "Çatı & Yalıtım İşleri",
    description:
      "Çatı örtüsü, membran ve ısı yalıtımı uygulamalarından saha örnekleri. Detaylara dikkat eden güvenilir uygulama desteği.",
    category: "yapi",
    location: "Tokat",
    year: 2026,
    images: [
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.48.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.48-1.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.48-2.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.46.jpeg`,
    ],
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "4",
    slug: "konut-tadilat-destegi",
    title: "Konut Tadilat Desteği",
    description:
      "Ev tadilatı ve yenileme süreçlerinde malzeme seçimi ve tedarik. Doğru ürün, doğru zamanlama.",
    category: "konut",
    location: "Turhal, Tokat",
    year: 2025,
    images: [
      `${UPLOAD}/2026/02/WhatsApp-Image-2025-08-30-at-13.17.58.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.34.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.34-1.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.33.jpeg`,
    ],
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "5",
    slug: "depo-ve-saha-calismalari",
    title: "Depo & Saha Çalışmaları",
    description:
      "Geniş ürün yelpazesi ve saha organizasyonu. Instagram’da güncel işlerimizi takip edebilirsiniz.",
    category: "ticari",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.32.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.32-1.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.53.45-1.jpeg`,
      `${UPLOAD}/2026/03/WhatsApp-Image-2026-02-09-at-19.31.33-2.jpeg`,
    ],
    instagramUrl: IG,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}
