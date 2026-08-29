import type { ProductCategory } from "@/types";

export type OrmanUrunleriPage = {
  slug: string;
  href: string;
  title: string;
  navLabel: string;
  eyebrow: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  image: string;
  highlights: { title: string; text: string }[];
  body: string[];
  relatedSlugs: string[];
  relatedCategories?: ProductCategory[];
};

export const ORMAN_URUNLERI_PAGES: OrmanUrunleriPage[] = [
  {
    slug: "index",
    href: "/orman-urunleri",
    title: "Orman Ürünleri",
    navLabel: "Orman Ürünleri",
    eyebrow: "Orman Ürünleri",
    description:
      "Turhal / Tokat’ta kereste, plywood (odek), OSB ve orman ürünleri. Şantiye, çatı ve tadilat için stoklu tedarik.",
    metaTitle: "Orman Ürünleri · OSB Plywood Kereste · Tokat",
    metaDescription:
      "Tokat ve Turhal’da kereste, plywood, OSB ve orman ürünleri. Cevizoğulları Yapı Market — kaliteli levha ve kereste tedariki.",
    keywords: [
      "Tokat kereste",
      "Turhal OSB",
      "Tokat plywood",
      "orman ürünleri Tokat",
    ],
    image: "/products/kereste-yigin.jpg",
    highlights: [
      {
        title: "Kerestecilik",
        text: "Çam, kavak ve lambri seçenekleriyle yapı ve tadilat ihtiyaçları.",
      },
      {
        title: "Plywood",
        text: "Odek / plywood levhalar — kalıp ve yapı uygulamaları.",
      },
      {
        title: "OSB",
        text: "Çatı, duvar ve zemin için dayanıklı OSB levhalar.",
      },
      {
        title: "Orman ürünleri",
        text: "Levha ve kereste çeşitleriyle tek noktadan tedarik.",
      },
    ],
    body: [
      "Cevizoğulları Yapı Market, Turhal’da kereste ve levhayı şantiye temposuna göre stoklar. Çatı kaplaması, kalıp veya lambri — kesiti ve kuruluğu birlikte seçeriz.",
      "Aşağıdaki başlıklardan grubu açın; ölçü ve adedi teklif formundan veya WhatsApp’tan yazın. Palet hazırsa yükleriz.",
    ],
    relatedSlugs: ["osb-levha", "plywood-odek", "cam-kereste-lambri"],
    relatedCategories: ["orman", "ahsap"],
  },
  {
    slug: "kerestecilik",
    href: "/orman-urunleri/kerestecilik",
    title: "Kerestecilik",
    navLabel: "Kerestecilik",
    eyebrow: "Orman Ürünleri",
    description:
      "Çam kereste, kavak kereste ve lambri. Yapı, çatı detayı ve tadilat için kereste tedariki — Turhal / Tokat.",
    metaTitle: "Kerestecilik · Çam ve Kavak Kereste · Tokat",
    metaDescription:
      "Tokat kereste ve Turhal kerestecilik: çam, kavak, lambri. Cevizoğulları’ndan kaliteli kereste tedariki.",
    keywords: [
      "Tokat kereste",
      "Turhal kerestecilik",
      "çam kereste",
      "kavak kereste",
      "lambri Tokat",
    ],
    image: "/products/kereste-yigin.jpg",
    highlights: [
      {
        title: "Çam kereste",
        text: "Yapı ve çatı işlerinde sık kullanılan dayanıklı çam seçenekleri.",
      },
      {
        title: "Kavak kereste",
        text: "Hafif ve işlenmesi kolay kavak kereste çeşitleri.",
      },
      {
        title: "Lambri",
        text: "İç mekân ve kaplama uygulamaları için lambri seçenekleri.",
      },
      {
        title: "Ölçüye göre",
        text: "Proje ihtiyacına göre ölçü ve adet danışmanlığı.",
      },
    ],
    body: [
      "Kerestecilik; doğru tür, doğru kesit ve doğru kurulukla başlar. Tokat ve Turhal’daki şantiye ile tadilat işlerinde çam ve kavak keresteyi stoklu sunuyoruz.",
      "İç mekân panellerinde lambri; çatı ve kaba işlerde kereste tercih edilir. İhtiyacınızı anlatın — kullanım alanına göre yönlendirelim.",
    ],
    relatedSlugs: ["cam-kereste-lambri"],
    relatedCategories: ["ahsap"],
  },
  {
    slug: "plywood",
    href: "/orman-urunleri/plywood",
    title: "Plywood (Odek)",
    navLabel: "Plywood",
    eyebrow: "Plywood",
    description:
      "Plywood / odek levhalar. Kalıp, yapı ve genel inşaat uygulamaları için kaliteli plywood — Turhal Yapı Market.",
    metaTitle: "Plywood Odek Levha · Tokat Kalıp ve Yapı",
    metaDescription:
      "Tokat plywood ve Turhal odek levha satışı. Kalıp ve yapı için plywood tedariki — Cevizoğulları.",
    keywords: [
      "Tokat plywood",
      "Turhal odek",
      "plywood levha",
      "odek satışı Tokat",
    ],
    image: "/products/formwork.jpg",
    highlights: [
      {
        title: "Kalıp uygulamaları",
        text: "Beton kalıbı ve şantiye işlerinde plywood / odek kullanımı.",
      },
      {
        title: "Yapı levhası",
        text: "Dayanımlı katmanlı yapı için plywood seçenekleri.",
      },
      {
        title: "Stoklu tedarik",
        text: "Proje temposuna uygun hızlı temin.",
      },
      {
        title: "Doğru kalınlık",
        text: "İşin türüne göre kalınlık ve kalite önerisi.",
      },
    ],
    body: [
      "Plywood (odek); katmanlı yapısıyla kalıp ve birçok yapı detayında tercih edilir. Turhal’daki yapı marketimizden plywood / odek levha tedarik edebilirsiniz.",
      "Kalıp mı, genel yapı mı — kullanım amacını söyleyin; uygun plywood seçiminde yardımcı olalım.",
    ],
    relatedSlugs: ["plywood-odek", "osb-levha"],
    relatedCategories: ["orman"],
  },
  {
    slug: "osb",
    href: "/orman-urunleri/osb",
    title: "OSB Levha",
    navLabel: "OSB",
    eyebrow: "OSB",
    description:
      "OSB levha: çatı, duvar ve zemin uygulamalarında yüksek dayanım. Tokat / Turhal OSB tedariki.",
    metaTitle: "OSB Levha Satışı · Tokat Turhal Çatı ve Duvar",
    metaDescription:
      "Tokat OSB ve Turhal OSB levha satışı. Çatı, duvar, zemin için dayanıklı OSB — Cevizoğulları Yapı Market.",
    keywords: [
      "Tokat OSB",
      "Turhal OSB levha",
      "OSB satışı",
      "çatı OSB Tokat",
    ],
    image: "/products/osb-panel.jpg",
    highlights: [
      {
        title: "Çatı uygulamaları",
        text: "Çatı kaplaması altında sık kullanılan OSB çözümleri.",
      },
      {
        title: "Duvar & zemin",
        text: "Duvar ve zemin detaylarında dayanımlı OSB levha.",
      },
      {
        title: "Yüksek mukavemet",
        text: "Oriented strand board yapısıyla sağlam performans.",
      },
      {
        title: "Hızlı tedarik",
        text: "Şantiye ihtiyacına göre stoktan hızlı çıkış.",
      },
    ],
    body: [
      "OSB (Oriented Strand Board), çatı ve kaba yapı işlerinde en çok aranan levhalardan biridir. Tokat OSB ihtiyacınızda Turhal merkezli stokumuzla yanınızdayız.",
      "Kalınlık ve kullanım yeri (çatı / duvar / zemin) netleştikten sonra doğru OSB’yi önerir, teklif sürecini hızlandırırız.",
    ],
    relatedSlugs: ["osb-levha", "plywood-odek"],
    relatedCategories: ["orman"],
  },
  {
    slug: "turler",
    href: "/orman-urunleri/turler",
    title: "Orman Ürünleri Türleri",
    navLabel: "Orman Ürünleri Türleri",
    eyebrow: "Orman Ürünleri",
    description:
      "Orman ürünleri türleri: kereste, OSB, plywood, lambri ve daha fazlası. Tokat’ta orman ürünleri tedariki.",
    metaTitle: "Orman Ürünleri Türleri · Kereste OSB Plywood",
    metaDescription:
      "Orman ürünleri türleri: kereste, OSB, plywood (odek), lambri. Turhal Yapı Market — Cevizoğulları.",
    keywords: [
      "orman ürünleri türleri",
      "Tokat orman ürünleri",
      "Turhal kereste OSB",
      "levha çeşitleri",
    ],
    image: "/products/kereste-yigin.jpg",
    highlights: [
      {
        title: "Kereste grubu",
        text: "Çam, kavak ve lambri gibi masif / işlenmiş ahşap ürünler.",
      },
      {
        title: "Levha grubu",
        text: "OSB ve plywood ile yapı ve kalıp levhaları.",
      },
      {
        title: "Kullanım alanları",
        text: "Çatı, duvar, zemin, kalıp ve iç mekân uygulamaları.",
      },
      {
        title: "Tek noktadan",
        text: "Orman ürünlerini yapı marketimizden birlikte temin edin.",
      },
    ],
    body: [
      "Orman ürünleri; keresteden levhaya kadar geniş bir aileyi kapsar. En sık kullanılan türler: çam / kavak kereste, lambri, OSB ve plywood (odek).",
      "Hangi iş için hangi tür gerekir? Çatı altı için OSB, kalıp için plywood, kaplama için lambri gibi net eşleştirmelerle yönlendiriyoruz. Katalogdan ilgili ürünleri inceleyebilirsiniz.",
    ],
    relatedSlugs: ["osb-levha", "plywood-odek", "cam-kereste-lambri"],
    relatedCategories: ["orman", "ahsap"],
  },
];

export function getOrmanUrunleriPage(slug: string) {
  return ORMAN_URUNLERI_PAGES.find((page) => page.slug === slug);
}

export const KERESTE_NAV = ORMAN_URUNLERI_PAGES.filter((p) => p.slug !== "index").map(
  (page) => ({
    href: page.href,
    label: page.navLabel,
  }),
);
