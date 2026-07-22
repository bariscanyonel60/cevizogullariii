import type { Property } from "@/types";

export const properties: Property[] = [
  {
    id: "1",
    slug: "turhal-premium-villa",
    title: "Turhal Premium Villa",
    description:
      "Turhal’da geniş bahçeli, yüksek tavanlı modern villa. Doğal ışık alan yaşam alanları ve özel peyzaj ile aile yaşamına uygun.",
    price: 12500000,
    city: "Tokat",
    district: "Turhal",
    category: "villa",
    status: "satilik",
    area: 320,
    rooms: "5+1",
    bathrooms: 3,
    features: ["Bahçe", "Otopark", "Isı yalıtımı", "Teras", "Güvenlik"],
    images: [
      "/projects/modern-konut-cephe.jpg",
      "/projects/modern-konut-bahce.jpg",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "tokat-merkez-modern-daire",
    title: "Tokat Merkez Modern Daire",
    description:
      "Tokat merkezde ferah planlı 3+1 daire. Ulaşıma yakın konum ve bakımlı yapı.",
    price: 3850000,
    city: "Tokat",
    district: "Merkez",
    category: "konut",
    status: "satilik",
    area: 135,
    rooms: "3+1",
    bathrooms: 2,
    features: ["Asansör", "Balkon", "Ankastre", "Otopark"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3bea5?w=1600&q=80",
    ],
    featured: true,
  },
  {
    id: "3",
    slug: "zile-yatirimlik-arsa",
    title: "Zile Yatırımlık Arsa",
    description:
      "Zile’de imar durumu net, gelişen bölgede yüksek potansiyelli arsa. Konut projeleri için uygun konum.",
    price: 2100000,
    city: "Tokat",
    district: "Zile",
    category: "arsa",
    status: "satilik",
    area: 650,
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
    slug: "erbaa-plaza-ofis",
    title: "Erbaa Plaza Ofis",
    description:
      "Erbaa’da kurumsal firmalar için ofis alanı. Açık plan, toplantı odası ve merkezi konum.",
    price: 35000,
    city: "Tokat",
    district: "Erbaa",
    category: "ofis",
    status: "kiralik",
    area: 160,
    rooms: "Açık plan",
    bathrooms: 2,
    features: ["Toplantı odası", "Fiber internet", "Jeneratör"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    ],
  },
  {
    id: "5",
    slug: "niksar-aile-villasi",
    title: "Niksar Aile Villası",
    description:
      "Niksar’da sakin mahallede bahçeli müstakil villa. Geniş yaşam alanları ve çocuk dostu çevre.",
    price: 7800000,
    city: "Tokat",
    district: "Niksar",
    category: "villa",
    status: "satilik",
    area: 240,
    rooms: "4+1",
    bathrooms: 3,
    features: ["Bahçe", "Garaj", "Teras", "Isı yalıtımı"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
      "/projects/modern-konut-bahce.jpg",
    ],
  },
  {
    id: "6",
    slug: "turhal-ticari-isyeri",
    title: "Turhal Ticari İşyeri",
    description:
      "Turhal cadde üzerinde vitrinli ticari alan. Perakende ve hizmet sektörü için ideal.",
    price: 28000,
    city: "Tokat",
    district: "Turhal",
    category: "isyeri",
    status: "kiralik",
    area: 90,
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
