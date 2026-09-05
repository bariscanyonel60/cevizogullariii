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
  nalbur: "Nalbur · Çivi & Civata",
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
    name: "Permolit",
    blurb: "İç ve dış cephe boyaları, astar ve kaplamalar",
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
    items: ["Permolit dış cephe boyası", "Astar + 2 kat uygulama", "Renk danışmanlığı"],
  },
  {
    title: "4. Çatı & detay",
    items: ["Membran / kiremit", "Yağmur oluğu", "PVC / sızdırmazlık"],
  },
] as const;

export const products: Product[] = [
  // ——— BOYA (Permolit & diğer) ———
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
  {
    id: "p29",
    slug: "permolit-dis-cephe-boyasi",
    title: "Permolit Dış Cephe Boyası",
    description:
      "Permolit dış cephe boyası. Hava koşullarına dayanıklı, yüksek örtücülü cephe koruması — Turhal / Tokat Yapı Market stokunda.",
    category: "boya",
    brand: "Permolit",
    unit: "15 L / 2.5 L",
    image: "/products/cephe-boyali.jpg",
    featured: true,
    useCases: ["dis-cephe"],
    specs: [
      { label: "Marka", value: "Permolit" },
      { label: "Uygulama", value: "Dış cephe" },
      { label: "Özellik", value: "UV & yağmur dayanımı" },
      { label: "Tip", value: "Su bazlı / akrilik" },
    ],
  },
  {
    id: "p30",
    slug: "permolit-ic-cephe-boyasi",
    title: "Permolit İç Cephe Boyası",
    description:
      "Permolit iç cephe boyası. Düşük kokulu, silinebilir yüzey — oturma alanları ve tadilat için Tokat / Turhal’da stoklu.",
    category: "boya",
    brand: "Permolit",
    unit: "15 L / 2.5 L",
    image: "/products/ic-boya-uygulama.jpg",
    useCases: ["ic-mekan"],
    specs: [
      { label: "Marka", value: "Permolit" },
      { label: "Uygulama", value: "İç cephe" },
      { label: "Özellik", value: "Silinebilir" },
    ],
  },
  {
    id: "p31",
    slug: "permolit-astar",
    title: "Permolit Astar",
    description:
      "Permolit boya astarı. İç ve dış yüzeylerde emiciliği dengeler, boyanın tutunmasını güçlendirir.",
    category: "boya",
    brand: "Permolit",
    unit: "15 L / 10 L",
    image: "/products/boya-rulo.jpg",
    useCases: ["dis-cephe", "ic-mekan"],
    specs: [
      { label: "Marka", value: "Permolit" },
      { label: "Amaç", value: "Astar / primer" },
      { label: "Uyum", value: "Permolit boyalar" },
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
    brand: "Filli Boya / Permolit",
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
    title: "Kavcim Çimento",
    description:
      "Kavcim torba çimento. Temel, şap, harç — palet stok Turhal’da.",
    category: "cimento",
    brand: "Kavcim",
    unit: "50 kg",
    image: "/products/kavcim-cimento.jpg",
    useCases: ["genel", "dis-cephe"],
    specs: [
      { label: "Ambalaj", value: "50 kg" },
      { label: "Marka", value: "Kavcim" },
      { label: "Kullanım", value: "Temel / şap / harç" },
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
    id: "p32",
    slug: "saten-perdah-alcisi",
    title: "BMT Saten Perdah Alçısı",
    description:
      "BMT 25 kg saten perdah alçısı. İç duvar perdahı, boya öncesi düzgün yüzey.",
    category: "siva",
    brand: "BMT",
    unit: "25 kg",
    image: "/products/saten-perdah-alcisi.jpg",
    useCases: ["ic-mekan"],
    specs: [
      { label: "Marka", value: "BMT" },
      { label: "Ambalaj", value: "25 kg" },
      { label: "Alan", value: "İç mekân perdah" },
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
  // ——— NALBUR (çivi, civata, vida…) ———
  {
    id: "p23",
    slug: "civi",
    title: "Çivi",
    description:
      "Tel çivi, beton çivi ve galvaniz çivi çeşitleri. Ahşap, kalıp ve genel şantiye bağlantı işleri için — Turhal Yapı Market stokunda.",
    category: "nalbur",
    brand: "Nalbur",
    unit: "kg / kutu",
    image: "/products/nalbur-civi.jpg",
    featured: true,
    useCases: ["genel", "dis-cephe"],
    specs: [
      { label: "Türler", value: "Tel / beton / galvaniz" },
      { label: "Kullanım", value: "Ahşap & şantiye" },
      { label: "Satış", value: "kg veya kutu" },
    ],
  },
  {
    id: "p24",
    slug: "civata",
    title: "Civata",
    description:
      "Altıgen civata, flanşlı ve metrik civata seçenekleri. Somun uyumlu, çeşitli çap ve boylarda — Tokat / Turhal nalbur reyonu.",
    category: "nalbur",
    brand: "Nalbur",
    unit: "adet / kutu",
    image: "/products/nalbur-civata.jpg",
    featured: true,
    useCases: ["genel"],
    specs: [
      { label: "Standart", value: "Metrik" },
      { label: "Malzeme", value: "Çelik / galvaniz" },
      { label: "Uyum", value: "Somun & pul" },
    ],
  },
  {
    id: "p25",
    slug: "vida",
    title: "Vida",
    description:
      "Ahşap vidası, sunta vidası, sac vidası ve alçıpan vidası. Ölçüye göre kutu satışı — şantiye ve tadilat için stoklu.",
    category: "nalbur",
    brand: "Nalbur",
    unit: "kutu / adet",
    image: "/products/nalbur-vida.jpg",
    useCases: ["genel", "ic-mekan"],
    specs: [
      { label: "Türler", value: "Ahşap / sunta / sac / alçıpan" },
      { label: "Baş", value: "Havşa / pan" },
    ],
  },
  {
    id: "p26",
    slug: "somun-pul",
    title: "Somun & Pul",
    description:
      "Altıgen somun, flanş somun ve düz / yaylı pul. Civata bağlantılarında eksiksiz set — Turhal nalbur.",
    category: "nalbur",
    brand: "Nalbur",
    unit: "adet / kutu",
    image: "/products/nalbur-civata.jpg",
    useCases: ["genel"],
    specs: [
      { label: "Türler", value: "Somun + düz/yaylı pul" },
      { label: "Uyum", value: "Metrik civata" },
    ],
  },
  {
    id: "p27",
    slug: "dubel",
    title: "Dübel",
    description:
      "Plastik dübel, çelik dübel ve mantolama dübeli. Duvar, beton ve cephe tespit uygulamaları için.",
    category: "nalbur",
    brand: "Nalbur",
    unit: "adet / kutu",
    image: "/products/nalbur-vida.jpg",
    useCases: ["dis-cephe", "genel", "ic-mekan"],
    specs: [
      { label: "Türler", value: "Plastik / çelik / mantolama" },
      { label: "Uygulama", value: "Duvar & beton" },
    ],
  },
  {
    id: "p28",
    slug: "mentese-kilit",
    title: "Menteşe & Kilit Aksesuarı",
    description:
      "Kapı menteşesi, pencere aksesuarı ve kilit setleri. Tadilat ve montaj işleri için nalbur reyonunda.",
    category: "nalbur",
    brand: "Nalbur",
    unit: "adet / takım",
    image: "/products/nalbur-civata.jpg",
    useCases: ["ic-mekan", "genel"],
    specs: [
      { label: "Ürün", value: "Menteşe / kilit aksesuar" },
      { label: "Alan", value: "Kapı & pencere" },
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

/** Kategori vitrin görselleri — yapı market premium grid */
export const CATEGORY_SHOWCASE: {
  key: ProductCategory;
  label: string;
  description: string;
  image: string;
}[] = [
  {
    key: "cimento",
    label: "Çimento",
    description: "Torba çimento. Temel, şap, harç.",
    image: "/products/kavcim-cimento.jpg",
  },
  {
    key: "demir",
    label: "Demir",
    description: "İnşaat demiri ve bağlama teli. Kaba inşaat listesine göre.",
    image: "/products/tugla-duvar.jpg",
  },
  {
    key: "cephe",
    label: "Tuğla & Cephe",
    description: "Tuğla, cephe sıvası ve dış duvar kalemleri.",
    image: "/products/dis-cephe-ev.jpg",
  },
  {
    key: "cati",
    label: "Çatı Sistemleri",
    description: "Kiremit, membran, oluk. Yağmur detayı için.",
    image: "/products/kiremit-kirmizi.jpg",
  },
  {
    key: "boya",
    label: "Boya",
    description: "Permolit, Filli, Marshall — iç-dış boya ve astar.",
    image: "/products/boya-rulo.jpg",
  },
  {
    key: "izolasyon",
    label: "Yalıtım",
    description: "EPS, XPS, İzocam, file ve dübel. Mantolama seti.",
    image: "/products/eps-levha.jpg",
  },
  {
    key: "boru",
    label: "Tesisat / PVC",
    description: "Boru, PVC ve tesisat malzemeleri.",
    image: "/products/pvc-borular.jpg",
  },
  {
    key: "siva",
    label: "Sıva & Alçı",
    description: "Saten perdah alçısı, sıva ve iç yüzey.",
    image: "/products/saten-perdah-alcisi.jpg",
  },
  {
    key: "orman",
    label: "OSB & Levha",
    description: "Çatı, kalıp ve zemin için OSB ve plywood.",
    image: "/products/osb-panel.jpg",
  },
  {
    key: "ahsap",
    label: "Orman Ürünleri",
    description: "Çam, kavak kereste ve lambri. Kuruluk ve kesit seçimi.",
    image: "/products/kereste-yigin.jpg",
  },
  {
    key: "nalbur",
    label: "Nalbur",
    description: "Çivi, civata, vida, dübel ve bağlantı elemanları.",
    image: "/products/nalbur-civi.jpg",
  },
];

