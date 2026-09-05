import type { Project } from "@/types";
import { SITE } from "@/lib/constants";

const IG = SITE.social.instagram;

/**
 * Proje görselleri — yerel `public/media/yapi-insaat` (CVZ saha kareleri).
 * Instagram: https://www.instagram.com/cevizogullari/
 */
export const projects: Project[] = [
  {
    id: "6",
    slug: "ova-apartmani-3",
    title: "Ova Apartmanı 3",
    description:
      "CVZ Yapı İnşaat Ova Apt. 3: teslim edilmiş konut. Beyaz cephe, antrasit balkon ve ahşap görünümlü düşey panel — Turhal’da biten iş.",
    category: "konut",
    location: "Turhal, Tokat",
    year: 2026,
    images: ["/media/yapi-insaat/ova-apt-3.jpg"],
    beforeImage: "/media/yapi-insaat/santiye-iskele-ova.jpg",
    afterImage: "/media/yapi-insaat/ova-apt-3.jpg",
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "0",
    slug: "ova-apartmani-2",
    title: "Ova Apartmanı 2",
    description:
      "CVZ Yapı İnşaat Ova Apt. 2: çok katlı konut, dış cephe giydirme ve bitiş. Turhal sahasında, malzeme reyonundan duvara.",
    category: "konut",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      "/media/yapi-insaat/ova-apt-2-saha.jpg",
      "/media/yapi-insaat/ova-apt-2-cephe.jpg",
      "/media/yapi-insaat/ova-apt-2-cephe-yakin.jpg",
      "/media/yapi-insaat/ova-apt-2-cephe-2.jpg",
    ],
    beforeImage: "/media/yapi-insaat/santiye-iskele-ova.jpg",
    afterImage: "/media/yapi-insaat/ova-apt-2-saha.jpg",
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "1",
    slug: "ova-apt-dis-cephe",
    title: "Ova Apt dış cephe",
    description:
      "Ova Apartmanı cephesi: beyaz sıva, antrasit çerçeve ve ahşap görünümlü panel. CVZ tabela, Tokat/Turhal uygulaması.",
    category: "dis-cephe",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      "/media/yapi-insaat/ova-apt-tabela.jpg",
      "/media/yapi-insaat/ova-apt-alt-aci.jpg",
      "/media/yapi-insaat/ova-apt-giris.jpg",
      "/media/yapi-insaat/ova-apt-kose.jpg",
      "/media/yapi-insaat/dis-cephe-ahsap-detay.jpg",
      "/media/yapi-insaat/villa-dis-cephe.jpg",
    ],
    beforeImage: "/media/yapi-insaat/kaba-insaat-iskelet.jpg",
    afterImage: "/media/yapi-insaat/ova-apt-tabela.jpg",
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "2",
    slug: "kaba-insaat-santiye",
    title: "Kaba inşaat & şantiye",
    description:
      "İskele, tuğla, sıva ve temel beton dökümü. CVZ şantiye tabelalı kaba iş — malzeme listesi Turhal stokundan.",
    category: "yapi",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      "/media/yapi-insaat/santiye-luks-daireler.jpg",
      "/media/yapi-insaat/santiye-iskele-ova.jpg",
      "/media/yapi-insaat/kaba-insaat-iskelet.jpg",
      "/media/yapi-insaat/temel-beton-dokumu.jpg",
      "/media/yapi-insaat/kalip-ahsap.jpg",
    ],
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "3",
    slug: "gece-cephe-aydinlatma",
    title: "Gece cephe aydınlatma",
    description:
      "Müstakil konutta dış cephe sıva ve mimari aydınlatma. CVZ Yapı İnşaat tabelalı gece çekimi — Tokat sahası.",
    category: "konut",
    location: "Tokat",
    year: 2026,
    images: [
      "/media/yapi-insaat/gece-cephe-cvz-1.jpg",
      "/media/yapi-insaat/gece-cephe-cvz-2.jpg",
    ],
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "4",
    slug: "ic-kapi-ince-is",
    title: "İç kapı ve ince iş",
    description:
      "Lake iç oda kapısı, kasa ve koridor aydınlatması. Tadilat bitişinde kapı ve boyayı birlikte seçeriz.",
    category: "konut",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      "/media/yapi-insaat/ic-kapi-koridor.jpg",
      "/media/yapi-insaat/ic-kapi-lake.jpg",
    ],
    featured: true,
    instagramUrl: IG,
  },
  {
    id: "5",
    slug: "satilik-daire-projesi",
    title: "Satılık daire projesi",
    description:
      "CVZ konut stoğu: modern cepheli apartmanda satılık daire. Dış cephe bitmiş, zemin işi saha temposunda.",
    category: "konut",
    location: "Turhal, Tokat",
    year: 2026,
    images: [
      "/media/yapi-insaat/satilik-daire-cephe.jpg",
      "/media/yapi-insaat/satilik-apartman.jpg",
      "/media/yapi-insaat/ova-apt-cephe-3.jpg",
      "/media/yapi-insaat/ova-apt-cephe-4.jpg",
      "/media/yapi-insaat/ova-apt-cephe-5.jpg",
    ],
    featured: true,
    instagramUrl: IG,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}
