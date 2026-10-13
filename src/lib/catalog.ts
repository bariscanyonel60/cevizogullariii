import type { CmsBrand } from "@/lib/cms-types";
import type { BlogPost, Product, ProductCategory } from "@/types";

/** Orman ürünleri ayrı bölümde yaşar; bu kategoriler için landing üretilmez. */
type ExternalCategory = Extract<ProductCategory, "orman" | "ahsap">;
type LandingCategory = Exclude<ProductCategory, ExternalCategory>;

const EXTERNAL_CATEGORY_HREF: Record<ExternalCategory, string> = {
  orman: "/orman-urunleri",
  ahsap: "/orman-urunleri/kerestecilik",
};

export type CategoryLanding = {
  key: LandingCategory;
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  uses: string[];
  faqs: { question: string; answer: string }[];
};

/** Kategori sayfası ancak bu kadar ürün varsa indekslenir; altı noindex,follow. */
export const CATEGORY_INDEX_MIN_PRODUCTS = 2;

export const CATEGORY_LANDINGS: Record<LandingCategory, CategoryLanding> = {
  boya: {
    key: "boya",
    slug: "boya",
    name: "Boya & Astar",
    title: "Boya ve Astar · İç ve Dış Cephe Boyaları",
    description:
      "Permolit, Filli Boya ve Marshall iç-dış cephe boyaları ile astarlar. Turhal reyonundan stok bilgisi ve teklif.",
    intro:
      "İç mekân, dış cephe ve ahşap-metal yüzeyler için boya ve astar çeşitleri. Yüzeyin durumuna göre doğru astar ve kat sayısını birlikte planlıyoruz.",
    uses: [
      "Dış cephe yenileme ve mantolama sonrası son kat",
      "İç mekân duvar ve tavan boyası",
      "Yüzey hazırlığı için astar ve tamir ürünleri",
    ],
    faqs: [
      {
        question: "Dış cephe için kaç kat boya gerekir?",
        answer:
          "Genellikle astar üzerine iki kat uygulanır. Kesin miktar yüzeyin emiciliğine ve üretici kılavuzuna göre değişir; metrekare bilgisiyle birlikte hesaplıyoruz.",
      },
      {
        question: "Renk seçiminde yardımcı oluyor musunuz?",
        answer:
          "Evet. Mağazada renk kartelalarını inceleyebilir, cephe veya iç mekân için uygun ürün grubunu birlikte seçebiliriz.",
      },
    ],
  },
  izolasyon: {
    key: "izolasyon",
    slug: "isi-yalitimi",
    name: "Isı Yalıtımı",
    title: "Isı Yalıtımı · EPS, XPS ve Mantolama Malzemeleri",
    description:
      "EPS ve XPS levha, taşyünü, mantolama yapıştırıcısı, file ve dübel. Turhal'dan mantolama seti ve teklif.",
    intro:
      "Mantolama ve çatı-zemin yalıtımı için levha, yapıştırıcı ve aksesuarlar. Levha tipi ve kalınlığı projeye ve uygulama alanına göre seçilir.",
    uses: [
      "Dış cephe mantolama sistemi",
      "Zemin ve temel perdesinde XPS uygulaması",
      "Çatı arası ve ara bölme yalıtımı",
    ],
    faqs: [
      {
        question: "Mantolama için hangi levha kalınlığını seçmeliyim?",
        answer:
          "Kalınlık; binanın konumu, duvar yapısı ve projedeki ısı yalıtım hesabına göre belirlenir. Projeniz varsa onu esas alır, yoksa ustanızla birlikte değerlendiririz.",
      },
      {
        question: "Mantolama setinde neler bulunur?",
        answer:
          "Levha, yapıştırıcı, sıva filesi, dübel, köşe profili ve son kat sıva ile boya. Eksik kalem kalmaması için listeyi birlikte çıkarıyoruz.",
      },
    ],
  },
  cati: {
    key: "cati",
    slug: "cati",
    name: "Çatı Malzemeleri",
    title: "Çatı Malzemeleri · Kiremit, Membran ve Oluk",
    description:
      "Kiremit, su yalıtım membranı ve çatı aksesuarları. Turhal ve Tokat çevresi için stok ve teslimat bilgisi.",
    intro:
      "Kiremit, su yalıtım örtüsü ve yağmur suyu detayları için çatı kalemleri. Çatı eğimi ve alt yapıya uygun ürünleri birlikte belirliyoruz.",
    uses: [
      "Yeni çatı ve kiremit aktarma",
      "Membran ile su yalıtımı",
      "Oluk ve yağmur suyu detayları",
    ],
    faqs: [
      {
        question: "Kiremit aktarma için hangi malzemeler gerekir?",
        answer:
          "Genellikle kiremit, su yalıtım örtüsü, çıta ve mahya elemanları gerekir. Çatı ölçüsünü paylaşırsanız listeyi birlikte çıkarırız.",
      },
    ],
  },
  cephe: {
    key: "cephe",
    slug: "dis-cephe",
    name: "Dış Cephe",
    title: "Dış Cephe Malzemeleri · Sıva ve Kaplama",
    description:
      "Dış cephe sıvası, kaplama ve cephe tamamlama kalemleri. Turhal reyonundan stok bilgisi ve teklif.",
    intro:
      "Dış duvar ve cephe tamamlama işleri için sıva, kaplama ve yardımcı ürünler. Cephe boyası ve mantolama kalemleriyle birlikte planlanabilir.",
    uses: [
      "Cephe sıvası ve tamir işleri",
      "Mantolama sonrası son kat kaplama",
      "Dış duvar tamamlama",
    ],
    faqs: [
      {
        question: "Cephe işleri için hangi ürünleri birlikte almalıyım?",
        answer:
          "Yüzey hazırlığı, sıva, astar ve son kat boya genellikle birlikte planlanır. Cephe ölçüsüyle tek listede teklif hazırlıyoruz.",
      },
    ],
  },
  cimento: {
    key: "cimento",
    slug: "cimento-harc",
    name: "Çimento & Harç",
    title: "Çimento ve Harç · Torba Çimento",
    description:
      "Temel, şap ve harç işleri için torba çimento. Turhal'dan şantiyeye teslimat ve toplu teklif.",
    intro:
      "Kaba inşaat, şap ve harç işlerinde kullanılan torba çimento ve bağlayıcılar. Şantiye listesine göre toplu teslimat planlanabilir.",
    uses: ["Temel ve kaba inşaat", "Şap ve tesviye", "Duvar ve sıva harcı"],
    faqs: [
      {
        question: "Şantiyeye toplu çimento teslimatı yapıyor musunuz?",
        answer:
          "Evet. Adet ve adres bilgisiyle teslimat günü planlanır. Güncel fiyat ve stok için bize ulaşabilirsiniz.",
      },
    ],
  },
  siva: {
    key: "siva",
    slug: "siva-alci",
    name: "Sıva & Alçı",
    title: "Sıva ve Alçı · İç Mekân ve Cephe Sıvaları",
    description:
      "Alçı, saten perdah, hazır sıva ve mantolama sıvaları. Turhal reyonundan stok bilgisi ve teklif.",
    intro:
      "İç mekân alçı ve perdah işleri ile cephe ve mantolama sıvaları. Yüzeye ve uygulama tekniğine uygun ürün seçimi için destek sağlıyoruz.",
    uses: [
      "İç duvar alçı ve saten perdah",
      "Mantolama yapıştırma ve sıva",
      "Tamir ve rötuş işleri",
    ],
    faqs: [
      {
        question: "Saten alçı ile hazır sıva arasındaki fark nedir?",
        answer:
          "Saten alçı boya öncesi pürüzsüz yüzey için ince katta uygulanır; sıvalar daha kalın katta düzeltme ve koruma sağlar. Ürün seçimi yüzeyin durumuna göre yapılır.",
      },
    ],
  },
  demir: {
    key: "demir",
    slug: "demir",
    name: "Demir",
    title: "İnşaat Demiri ve Bağlama Teli",
    description:
      "İnşaat demiri ve bağlama teli için kaba inşaat listesine göre teklif. Güncel fiyat ve stok için Cevizoğulları'nı arayın.",
    intro:
      "İnşaat demiri ve bağlama teli, kaba inşaat listesine göre teklifle tedarik edilir. Çap ve tonaj bilgisini paylaşmanız yeterli.",
    uses: ["Temel ve kolon donatısı", "Döşeme ve perde donatısı"],
    faqs: [
      {
        question: "Demir fiyatı neden sitede yazmıyor?",
        answer:
          "Demir fiyatları sık değiştiği için güncel fiyat ve stok bilgisini telefon veya WhatsApp üzerinden paylaşıyoruz.",
      },
    ],
  },
  boru: {
    key: "boru",
    slug: "boru-pvc",
    name: "Boru & PVC",
    title: "Boru ve PVC · Tesisat Malzemeleri",
    description:
      "PVC boru ve tesisat ek parçaları. Turhal reyonundan stok bilgisi ve teklif.",
    intro:
      "Atık su ve tesisat işleri için PVC boru ve ek parçalar. Çap ve metraj bilgisiyle listenizi hazırlıyoruz.",
    uses: ["Atık su tesisatı", "Yağmur suyu iniş boruları"],
    faqs: [
      {
        question: "Boru ek parçalarını da temin ediyor musunuz?",
        answer:
          "Evet. Dirsek, te ve manşon gibi ek parçaları boru çapına göre listeye ekleyebiliriz.",
      },
    ],
  },
  nalbur: {
    key: "nalbur",
    slug: "nalbur",
    name: "Nalbur",
    title: "Nalbur Ürünleri · Çivi, Vida ve Bağlantı Elemanları",
    description:
      "Çivi, vida, dübel, civata ve bağlantı elemanları. Turhal reyonundan stok bilgisi ve teklif.",
    intro:
      "Şantiye ve tadilat işlerinde ihtiyaç duyulan çivi, vida, dübel ve bağlantı elemanları. Küçük kalemleri ana malzeme listenizle birlikte hazırlıyoruz.",
    uses: [
      "Ahşap ve kalıp işleri",
      "Mantolama ve cephe dübelleri",
      "Genel montaj ve tadilat",
    ],
    faqs: [
      {
        question: "Küçük nalbur kalemlerini toplu alabilir miyim?",
        answer:
          "Evet. Paket veya kilogram bazında toplu alım için ihtiyaç listenizi paylaşmanız yeterli.",
      },
    ],
  },
};

const LANDING_BY_SLUG = new Map(
  Object.values(CATEGORY_LANDINGS).map((landing) => [landing.slug, landing]),
);

export const CATEGORY_LANDING_SLUGS: readonly string[] = [
  ...LANDING_BY_SLUG.keys(),
];

export function getCategoryLandingBySlug(slug: string) {
  return LANDING_BY_SLUG.get(slug);
}

export function categoryHref(category: ProductCategory): string {
  switch (category) {
    case "orman":
    case "ahsap":
      return EXTERNAL_CATEGORY_HREF[category];
    case "boya":
    case "izolasyon":
    case "cati":
    case "cephe":
    case "cimento":
    case "siva":
    case "demir":
    case "boru":
    case "nalbur":
      return `/yapi-malzemeleri/${CATEGORY_LANDINGS[category].slug}`;
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
}

export function isProductCategory(value: string): value is ProductCategory {
  return value in CATEGORY_LANDINGS || value in EXTERNAL_CATEGORY_HREF;
}

const TR_CHAR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

function slugifyTr(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıiöşü]/g, (ch) => TR_CHAR_MAP[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function productBrandNames(product: Product) {
  return product.brand
    .split("/")
    .map((part) => part.trim().toLocaleLowerCase("tr-TR"))
    .filter(Boolean);
}

function productsForBrand(brandName: string, products: Product[]) {
  const needle = brandName.trim().toLocaleLowerCase("tr-TR");
  return products.filter((product) => productBrandNames(product).includes(needle));
}

export type BrandPage = CmsBrand & { slug: string; products: Product[] };

/** Yalnızca CMS'te kayıtlı ve en az bir ürünle eşleşen markalar sayfa alır. */
export function brandPages(brands: CmsBrand[], products: Product[]): BrandPage[] {
  return brands
    .map((brand) => ({
      ...brand,
      slug: slugifyTr(brand.name),
      products: productsForBrand(brand.name, products),
    }))
    .filter((brand) => brand.slug && brand.products.length > 0);
}

export function brandHref(slug: string) {
  return `/markalar/${slug}`;
}

/** Ürün markası CMS marka sayfalarından biriyle eşleşiyorsa linkleri döner. */
export function brandLinksForProduct(product: Product, pages: BrandPage[]) {
  const names = productBrandNames(product);
  return pages.filter((page) =>
    names.includes(page.name.trim().toLocaleLowerCase("tr-TR")),
  );
}

/** Ürünle ilişkili blog yazıları: başlık, etiket ve kategori metninde basit eşleşme. */
export function relatedPostsForProduct(
  product: Product,
  posts: BlogPost[],
  limit = 2,
) {
  const landing =
    product.category in CATEGORY_LANDINGS
      ? CATEGORY_LANDINGS[product.category as LandingCategory]
      : undefined;
  const terms = [
    ...productBrandNames(product),
    ...(landing ? [landing.name.toLocaleLowerCase("tr-TR")] : []),
    ...product.title
      .toLocaleLowerCase("tr-TR")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  ];
  return posts
    .map((post) => {
      const haystack = [post.title, post.excerpt, post.category, ...post.tags]
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      const score = terms.filter((term) => haystack.includes(term)).length;
      return { post, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}
