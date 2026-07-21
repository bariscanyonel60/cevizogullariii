import type { Property } from "@/types";

export const properties: Property[] = [
  {
    id: "1",
    slug: "cankaya-premium-villa",
    title: "Çankaya Premium Villa",
    description:
      "Şehrin prestijli noktasında, geniş bahçeli ve yüksek tavanlı modern villa. Doğal ışık alan yaşam alanları, akıllı ev altyapısı ve özel peyzaj düzenlemesi ile aile yaşamına özel tasarlandı.",
    price: 28500000,
    city: "Ankara",
    district: "Çankaya",
    category: "villa",
    status: "satilik",
    area: 420,
    rooms: "5+2",
    bathrooms: 4,
    features: [
      "Akıllı ev sistemi",
      "Özel havuz",
      "Bahçe",
      "Kapalı otopark",
      "Şömine",
      "Güvenlik",
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "yenimahalle-modern-daire",
    title: "Yenimahalle Modern Daire",
    description:
      "Yeni nesil yaşam kompleksinde, ferah planlı 3+1 daire. Metroya yakın konum, site içi sosyal olanaklar ve premium malzeme kalitesi.",
    price: 6850000,
    city: "Ankara",
    district: "Yenimahalle",
    category: "konut",
    status: "satilik",
    area: 145,
    rooms: "3+1",
    bathrooms: 2,
    features: ["Site içi", "Asansör", "Balkon", "Ankastre", "Otopark"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3bea5?w=1600&q=80",
    ],
    featured: true,
  },
  {
    id: "3",
    slug: "kecioren-yatirimlik-arsa",
    title: "Keçiören Yatırımlık Arsa",
    description:
      "İmar durumu net, gelişen bölgede yüksek potansiyelli arsa. Konut projeleri için uygun konum ve erişim avantajı.",
    price: 4200000,
    city: "Ankara",
    district: "Keçiören",
    category: "arsa",
    status: "satilik",
    area: 850,
    rooms: "-",
    bathrooms: 0,
    features: ["İmarlı", "Ana yola yakın", "Elektrik", "Su"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    ],
    featured: true,
  },
  {
    id: "4",
    slug: "cankaya-plaza-ofis",
    title: "Çankaya Plaza Ofis",
    description:
      "Kurumsal firmalar için temsil kalitesinde ofis katı. Açık ofis planı, toplantı odaları ve 7/24 güvenlik.",
    price: 95000,
    city: "Ankara",
    district: "Çankaya",
    category: "ofis",
    status: "kiralik",
    area: 210,
    rooms: "Açık plan",
    bathrooms: 2,
    features: ["Toplantı odası", "Resepsiyon", "Jeneratör", "Fiber internet"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80",
    ],
  },
  {
    id: "5",
    slug: "etimesgut-aile-villasi",
    title: "Etimesgut Aile Villası",
    description:
      "Sakin bir mahallede, bahçeli müstakil villa. Geniş yaşam alanları ve çocuk dostu çevre.",
    price: 12400000,
    city: "Ankara",
    district: "Etimesgut",
    category: "villa",
    status: "satilik",
    area: 280,
    rooms: "4+1",
    bathrooms: 3,
    features: ["Bahçe", "Garaj", "Teras", "Isı yalıtımı"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    ],
  },
  {
    id: "6",
    slug: "mamak-ticari-isyeri",
    title: "Mamak Ticari İşyeri",
    description:
      "Yoğun cadde üzerinde, vitrinli ticari alan. Perakende ve hizmet sektörü için ideal.",
    price: 45000,
    city: "Ankara",
    district: "Mamak",
    category: "isyeri",
    status: "kiralik",
    area: 95,
    rooms: "Dükkan",
    bathrooms: 1,
    features: ["Vitrin", "Depo", "Klima", "Cadde üzeri"],
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    ],
  },
];

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function getFeaturedProperties() {
  return properties.filter((p) => p.featured);
}

export function getRelatedProperties(slug: string, limit = 3) {
  const current = getPropertyBySlug(slug);
  if (!current) return properties.slice(0, limit);
  return properties
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}
