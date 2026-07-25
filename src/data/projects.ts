import type { Project } from "@/types";
import { SITE } from "@/lib/constants";

const IG = SITE.social.instagram;

/**
 * Proje görselleri — yerel `public/` altında (WordPress upload bağımlılığı yok).
 * Instagram: https://www.instagram.com/cevizogullari/
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
      "/products/dis-cephe-ev.jpg",
      "/products/cephe-boyali.jpg",
      "/products/mantolama-saha.jpg",
      "/products/dekoratif-cephe.jpg",
    ],
    beforeImage: "/products/eps-levha.jpg",
    afterImage: "/products/dis-cephe-ev.jpg",
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
      "/products/cimento-torbalar.jpg",
      "/products/tugla-duvar.jpg",
      "/products/asmolen-kopuk.jpg",
      "/products/formwork.jpg",
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
      "/products/kiremit-kirmizi.jpg",
      "/products/membran-cati.jpg",
      "/products/xps-board.jpg",
      "/products/izocam-yun.jpg",
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
      "/products/ic-boya-uygulama.jpg",
      "/products/boya-rulo.jpg",
      "/products/siva-macun.jpg",
      "/projects/modern-konut-bahce.jpg",
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
      "/products/kereste-yigin.jpg",
      "/products/osb-panel.jpg",
      "/products/nalbur-civata.jpg",
      "/products/pvc-borular.jpg",
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
