import type { Product, ProductCategory, ProductUseCase } from "@/types";

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  boya: "Boya & Astar",
  izolasyon: "Isı Yalıtımı",
  cati: "Çatı Malzemeleri",
  cephe: "Dış Cephe",
  orman: "Orman Ürünleri",
  cimento: "Çimento & Harç",
  siva: "Sıva & Alçı",
  demir: "Demir",
  ahsap: "Ahşap / Kereste",
  boru: "Boru & PVC",
  nalbur: "Nalbur",
};

export const USE_CASE_LABELS: Record<ProductUseCase, string> = {
  "dis-cephe": "Dış Cephe",
  "ic-mekan": "İç Mekân",
  cati: "Çatı",
  genel: "Genel",
};

/** Çalıştığımız büyük markalar */
export const BRANDS = [
  {
    name: "Polisan",
    blurb: "Dış cephe ve iç cephe boyaları, astarlar",
  },
  {
    name: "Filli Boya",
    blurb: "Cephe boyası ve dekoratif kaplamalar",
  },
  {
    name: "Marshall",
    blurb: "İç-dış cephe boya sistemleri",
  },
  {
    name: "İzocam",
    blurb: "Isı ve ses yalıtım çözümleri",
  },
  {
    name: "Knauf",
    blurb: "Alçı, sıva ve cephe sistemleri",
  },
  {
    name: "Weber",
    blurb: "Mantolama ve yapıştırıcı sistemleri",
  },
] as const;

/** Evin dışı için paket önerisi */
export const EXTERIOR_PACKAGE = [
  {
    title: "1. Yüzey hazırlığı",
    items: ["Dış cephe astarı", "Tamir macunu / sıva", "Temizlik ve zımpara"],
  },
  {
    title: "2. Isı yalıtımı",
    items: ["EPS / XPS mantolama", "File + yapıştırıcı", "Dübel ve profil"],
  },
  {
    title: "3. Cephe boyası",
    items: ["Polisan dış cephe boyası", "Astar + 2 kat uygulama", "Renk danışmanlığı"],
  },
  {
    title: "4. Çatı & detay",
    items: ["Membran / kiremit", "Yağmur oluğu", "PVC / sızdırmazlık"],
  },
] as const;

export const products: Product[] = [
  // ——— BOYA (Polisan & diğer) ———
  {
    id: "p1",
    slug: "polisan-dis-cephe-boyasi",
    title: "Polisan Dış Cephe Boyası",
    description:
      "Hava koşullarına dayanıklı, nefes alan dış cephe boyası. Polisan kalitesiyle evinizin dış yüzeyini uzun ömürlü korur; renk seçenekleri ve uzman yönlendirme ile birlikte sunulur.",
    category: "boya",
    brand: "Polisan",
    unit: "15 L / 2.5 L",
    image: "/products/boya-rulo.jpg",
    featured: true,
    useCases: ["dis-cephe"],
    specs: [
      { label: "Marka", value: "Polisan" },
      { label: "Uygulama", value: "Dış cephe" },
      { label: "Özellik", value: "UV & yağmur dayanımı" },
      { label: "Kaplama", value: "Yüksek örtücülük" },
    ],
    catalogPdf: "/kataloglar/polisan.pdf",
  },
  {
    id: "p2",
    slug: "polisan-dis-cephe-astari",
    title: "Polisan Dış Cephe Astarı",
    description:
      "Boya öncesi yüzey hazırlığı için Polisan dış cephe astarı. Emiciliği dengeler, boyanın tutunmasını ve ömrünü artırır.",
    category: "boya",
    brand: "Polisan",
    unit: "15 L / 10 L",
    image: "/products/siva-macun.jpg",
    featured: true,
    useCases: ["dis-cephe"],
    specs: [
      { label: "Marka", value: "Polisan" },
      { label: "Amaç", value: "Astar / primer" },
      { label: "Uyum", value: "Dış cephe boyaları" },
    ],
  },
  {
    id: "p3",
    slug: "polisan-ic-cephe-boyasi",
    title: "Polisan İç Cephe Boyası",
    description:
      "Silinebilir, düşük kokulu iç cephe boyası. Oturma alanları ve ofisler için Polisan iç cephe serisi.",
    category: "boya",
    brand: "Polisan",
    unit: "15 L / 2.5 L",
    image: "/products/ic-boya-uygulama.jpg",
    useCases: ["ic-mekan"],
    specs: [
      { label: "Marka", value: "Polisan" },
      { label: "Uygulama", value: "İç cephe" },
      { label: "Özellik", value: "Silinebilir" },
    ],
  },
  {
    id: "p4",
    slug: "filli-boya-cephe",
    title: "Filli Boya Dış Cephe",
    description:
      "Filli Boya dış cephe ürünleri. Dekoratif ve koruyucu cephe kaplamaları için stoklu tedarik.",
    category: "boya",
    brand: "Filli Boya",
    unit: "15 L",
    image: "/products/cephe-boyali.jpg",
    useCases: ["dis-cephe"],
    specs: [
      { label: "Marka", value: "Filli Boya" },
      { label: "Alan", value: "Dış cephe" },
      { label: "Tip", value: "Su bazlı / akrilik" },
    ],
  },
  {
    id: "p5",
    slug: "marshall-dis-cephe",
    title: "Marshall Dış Cephe Boyası",
    description:
      "Marshall marka dış cephe boyaları. Dayanıklı film tabakası ve geniş renk skalası.",
    category: "boya",
    brand: "Marshall",
    unit: "15 L",
    image: "/products/dis-cephe-ev.jpg",
    useCases: ["dis-cephe"],
    specs: [
      { label: "Marka", value: "Marshall" },
      { label: "Uygulama", value: "Dış cephe" },
    ],
  },

  // ——— İZOLASYON / MANTO ———
  {
    id: "p6",
    slug: "eps-mantolama-kopuk",
    title: "EPS Mantolama Köpük",
    description:
      "Dış cephe mantolama sistemlerinde kullanılan EPS levhalar. Isı kaybını azaltır, enerji faturasını düşürür.",
    category: "izolasyon",
    brand: "Yalıtım",
    unit: "paket / m²",
    image: "/products/eps-levha.jpg",
    featured: true,
    useCases: ["dis-cephe"],
    specs: [
      { label: "Tür", value: "EPS" },
      { label: "Kalınlık", value: "3–10 cm" },
      { label: "Kullanım", value: "Mantolama" },
    ],
  },
  {
    id: "p7",
    slug: "xps-yalitim-levhasi",
    title: "XPS Isı Yalıtım Levhası",
    description:
      "Yüksek basınç dayanımlı XPS. Temel, teras ve cephe detaylarında nem direnci yüksek yalıtım.",
    category: "izolasyon",
    brand: "Yalıtım",
    unit: "paket",
    image: "/products/xps-board.jpg",
    useCases: ["dis-cephe", "cati"],
    specs: [
      { label: "Tür", value: "XPS" },
      { label: "Avantaj", value: "Nem direnci" },
    ],
  },
  {
    id: "p8",
    slug: "izocam-yalitim",
    title: "İzocam Taşyünü / Camyünü",
    description:
      "İzocam ısı ve ses yalıtım ürünleri. Çatı, duvar ve mantolama detaylarında güvenilir marka.",
    category: "izolasyon",
    brand: "İzocam",
    unit: "paket",
    image: "/products/izocam-yun.jpg",
    featured: true,
    useCases: ["dis-cephe", "cati", "ic-mekan"],
    specs: [
      { label: "Marka", value: "İzocam" },
      { label: "Alan", value: "Isı / ses yalıtımı" },
    ],
  },
  {
    id: "p9",
    slug: "weber-mantolama-yapistirici",
    title: "Weber Mantolama Yapıştırıcı",
    description:
      "EPS/XPS yapıştırma ve sıva için Weber sistem ürünleri. Mantolama setinin temel bileşeni.",
    category: "izolasyon",
    brand: "Weber",
    unit: "25 kg torba",
    image: "/products/cimento-torbalar.jpg",
    useCases: ["dis-cephe"],
    specs: [
      { label: "Marka", value: "Weber" },
      { label: "Kullanım", value: "Yapıştırma / sıva" },
    ],
  },
  {
    id: "p10",
    slug: "mantolama-filesi-duibel",
    title: "Mantolama Filesi & Dübel",
    description:
      "Cam elyaf file, dübel ve köşe profilleri. Mantolama sisteminin doğru montajı için gerekli aksesuarlar.",
    category: "izolasyon",
    brand: "Sistem",
    unit: "rulo / kutu",
    image: "/products/mantolama-saha.jpg",
    useCases: ["dis-cephe"],
    specs: [
      { label: "Ürün", value: "File + dübel + profil" },
      { label: "Sistem", value: "Mantolama" },
    ],
  },

  // ——— CEPHE / SIVA ———
  {
    id: "p11",
    slug: "dis-cephe-siva",
    title: "Dış Cephe Sıvası",
    description:
      "Mineral ve akrilik dış cephe sıvaları. Düzgün yüzey ve boya öncesi hazırlık için.",
    category: "siva",
    brand: "Knauf / Weber",
    unit: "25 kg",
    image: "/products/siva-macun.jpg",
    featured: true,
    useCases: ["dis-cephe"],
    specs: [
      { label: "Tip", value: "Dış cephe sıvası" },
      { label: "Uygulama", value: "Elle / makine" },
    ],
  },
  {
    id: "p12",
    slug: "dekoratif-cephe-kaplama",
    title: "Dekoratif Cephe Kaplama",
    description:
      "Grenli ve dokulu dekoratif cephe kaplamaları. Estetik dış görünüm + koruma.",
    category: "cephe",
    brand: "Filli Boya / Polisan",
    unit: "kg / kova",
    image: "/products/dekoratif-cephe.jpg",
    useCases: ["dis-cephe"],
    specs: [
      { label: "Görünüm", value: "Dokulu / grenli" },
      { label: "Alan", value: "Dış cephe" },
    ],
  },

  // ——— ÇATI ———
  {
    id: "p13",
    slug: "su-yalitim-membran",
    title: "Su Yalıtım Membranı",
    description:
      "Çatı ve teras su yalıtımı için bitümlü membran. Sızıntıya karşı uzun ömürlü koruma.",
    category: "cati",
    brand: "Yalıtım",
    unit: "rulo",
    image: "/products/membran-cati.jpg",
    featured: true,
    useCases: ["cati", "dis-cephe"],
    specs: [
      { label: "Tür", value: "Bitümlü membran" },
      { label: "Kullanım", value: "Çatı / teras" },
    ],
  },
  {
    id: "p14",
    slug: "kiremit",
    title: "Kiremit",
    description:
      "Çatı örtüsü kiremit çeşitleri. Konut ve tadilat projeleri için stoklu tedarik.",
    category: "cati",
    brand: "İnşaat",
    unit: "adet",
    image: "/products/kiremit-kirmizi.jpg",
    useCases: ["cati"],
    specs: [
      { label: "Kullanım", value: "Çatı örtüsü" },
      { label: "Tedarik", value: "Stoklu" },
    ],
  },
  {
    id: "p15",
    slug: "yagmur-olugu-pvc",
    title: "Yağmur Oluğu & PVC",
    description:
      "Yağmur oluğu, iniş borusu ve PVC bağlantı elemanları. Çatı su tahliyesi için.",
    category: "boru",
    brand: "PVC",
    unit: "mt / adet",
    image: "/products/pvc-borular.jpg",
    useCases: ["cati", "dis-cephe"],
    specs: [
      { label: "Malzeme", value: "PVC / metal" },
      { label: "Sistem", value: "Oluk + iniş" },
    ],
  },

  // ——— ORMAN / AHŞAP ———
  {
    id: "p16",
    slug: "osb-levha",
    title: "OSB Levha",
    description:
      "Çatı, duvar ve zemin uygulamalarında dayanıklı OSB levhalar.",
    category: "orman",
    brand: "Orman Ürünleri",
    unit: "adet",
    image: "/products/osb-panel.jpg",
    useCases: ["cati", "genel"],
    specs: [
      { label: "Kullanım", value: "Çatı / duvar" },
      { label: "Özellik", value: "Yüksek dayanım" },
    ],
  },
  {
    id: "p17",
    slug: "plywood-odek",
    title: "Plywood (Odek)",
    description:
      "Kaliteli plywood / odek. Yapı ve kalıp uygulamaları için.",
    category: "orman",
    brand: "Orman Ürünleri",
    unit: "adet",
    image: "/products/formwork.jpg",
    useCases: ["genel"],
    specs: [
      { label: "Tür", value: "Plywood / Odek" },
    ],
  },
  {
    id: "p18",
    slug: "cam-kereste-lambri",
    title: "Çam Kereste & Lambri",
    description:
      "Çam kereste, lambri ve kavak kereste seçenekleri.",
    category: "ahsap",
    brand: "Orman Ürünleri",
    unit: "m³ / m²",
    image: "/products/kereste-yigin.jpg",
    useCases: ["genel", "ic-mekan"],
    specs: [
      { label: "Tür", value: "Çam / kavak / lambri" },
    ],
  },

  // ——— ÇİMENTO / TEMEL ———
  {
    id: "p19",
    slug: "portland-cimento",
    title: "Portland Çimento",
    description:
      "Temel inşaat çimentosu. Konut, tadilat ve altyapı için güvenilir tedarik.",
    category: "cimento",
    brand: "İnşaat",
    unit: "50 kg",
    image: "/products/cimento-torbalar.jpg",
    useCases: ["genel", "dis-cephe"],
    specs: [
      { label: "Ambalaj", value: "50 kg" },
      { label: "Kullanım", value: "Genel inşaat" },
    ],
  },
  {
    id: "p20",
    slug: "tugla-blok",
    title: "Tuğla & Blok",
    description:
      "Duvar örgüsü için tuğla ve blok çeşitleri. Dış duvar ve bölme uygulamaları.",
    category: "cimento",
    brand: "İnşaat",
    unit: "adet / palet",
    image: "/products/tugla-duvar.jpg",
    useCases: ["dis-cephe", "genel"],
    specs: [
      { label: "Tür", value: "Tuğla / blok" },
    ],
  },
  {
    id: "p21",
    slug: "alcipan-alci",
    title: "Alçıpan & Alçı",
    description:
      "Knauf uyumlu alçıpan ve alçı ürünleri. İç mekân bölme ve tavan sistemleri.",
    category: "siva",
    brand: "Knauf",
    unit: "adet / torba",
    image: "/products/siva-macun.jpg",
    useCases: ["ic-mekan"],
    specs: [
      { label: "Marka", value: "Knauf" },
      { label: "Alan", value: "İç mekân" },
    ],
  },
  {
    id: "p22",
    slug: "asmolen",
    title: "Asmolen",
    description:
      "Asmolen dolgu malzemeleri. Döşeme ve yalıtım detaylarında kullanılır.",
    category: "izolasyon",
    brand: "Yalıtım",
    unit: "adet",
    image: "/products/asmolen-kopuk.jpg",
    useCases: ["genel"],
    specs: [
      { label: "Kullanım", value: "Döşeme dolgusu" },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getExteriorProducts() {
  return products.filter((p) => p.useCases.includes("dis-cephe"));
}

export function getProductsByBrand(brand: string) {
  return products.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase(),
  );
}

export function getCategoryCounts() {
  return (Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[]).map(
    (key) => ({
      key,
      label: PRODUCT_CATEGORY_LABELS[key],
      count: products.filter((p) => p.category === key).length,
    }),
  );
}
