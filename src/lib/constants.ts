export const SITE = {
  name: "Cevizoğulları Yapı Market & İnşaat",
  shortName: "Cevizoğulları",
  tagline: "Tokat & Turhal’da yapı malzemeleri ve inşaat tedariki",
  description:
    "Tokat / Turhal’da yapı market, mantolama, boya, yalıtım, kereste, OSB ve gayrimenkul. Deprem koşullarına uygun ürün seçimi, hızlı tedarik — Zile, Erbaa, Niksar, Pazar ve yakın illere hizmet.",
  url: "https://cevizogullari.com",
  locale: "tr_TR",
  phone: "+90 535 573 01 15",
  phoneHref: "tel:+905355730115",
  /** WhatsApp (ülke kodu ile, + ve boşluksuz) */
  whatsapp: "905355730115",
  email: "info@cevizogullari.com",
  address: "Pazar Mahallesi, Yeşilırmak Sk. No: 99, 60300 Turhal/Tokat",
  city: "Turhal",
  district: "Tokat",
  mapEmbed:
    "https://www.google.com/maps?q=Pazar+Mahallesi+Ye%C5%9Fil%C4%B1rmak+Sk+No+99+Turhal+Tokat&output=embed",
  social: {
    instagram: "https://www.instagram.com/cevizogullari/",
    instagramHandle: "@cevizogullari",
  },
  media: {
    label: "Media",
    name: "Barış Can Yönel",
    url: "https://bariscanyonel.com",
  },
  hours: "Pzt–Cmt: 08:00–19:00",
  seoKeywords: [
    "Tokat yapı malzemeleri",
    "Turhal yapı market",
    "Tokat inşaat",
    "Tokat mantolama",
    "Turhal boya",
    "Tokat yalıtım",
    "Tokat kereste",
    "Tokat OSB",
    "Tokat gayrimenkul",
    "Turhal satılık",
    "Erbaa yapı malzemeleri",
    "Niksar mantolama",
    "Zile inşaat malzemesi",
    "Pazar Tokat yapı",
    "Amasya yapı market",
    "Cevizoğulları",
  ],
} as const;

/** Anasayfa SSS — FAQPage şeması ile birlikte kullanılır */
export const HOME_FAQS = [
  {
    question: "Tokat’ta yapı malzemesi nereden alınır?",
    answer:
      "Cevizoğulları Yapı Market, Turhal / Tokat’ta boya, mantolama, yalıtım, çatı, OSB, çimento ve nalbur ürünlerini stoklu sunar. Tokat merkez ve ilçelere hızlı tedarik sağlar.",
  },
  {
    question: "Deprem yönetmeliğine uygun malzeme seçimi yapıyor musunuz?",
    answer:
      "Evet. TBDY bilinciyle; yalıtım, bağlayıcı malzemeler ve cephe sistemlerinde güvenli yapı yaklaşımını destekler, 2026 deprem koşullarına uygun ürün yönlendirmesi yaparız.",
  },
  {
    question: "Hangi bölgelere hizmet veriyorsunuz?",
    answer:
      "Merkezimiz Turhal’dadır. Tokat (Merkez, Zile, Erbaa, Niksar, Pazar), Amasya, Yozgat, Sivas, Çorum ve Samsun’daki şantiye ile tadilat projelerine bölgesel tedarik ve danışmanlık sunuyoruz.",
  },
  {
    question: "Teklif nasıl alabilirim?",
    answer:
      "Teklif Al formundan veya WhatsApp hattımızdan ihtiyacınızı iletebilirsiniz. Ürün listesi ve miktara göre hızlı fiyat dönüşü yapılır.",
  },
] as const;

export type NavChild = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  label: string;
  children?: readonly NavChild[];
};

export const NAV_LINKS: readonly NavItem[] = [
  { href: "/", label: "Ana Sayfa" },
  {
    href: "/kurumsal",
    label: "Kurumsal",
    children: [
      { href: "/kurumsal", label: "Hakkımızda" },
      { href: "/blog", label: "Blog" },
      { href: "/kvkk", label: "KVKK" },
    ],
  },
  { href: "/yapi-malzemeleri", label: "Yapı Market" },
  {
    href: "/kereste",
    label: "Kereste",
    children: [
      { href: "/kereste/kerestecilik", label: "Kerestecilik" },
      { href: "/kereste/plywood", label: "Plywood" },
      { href: "/kereste/osb", label: "OSB" },
      { href: "/kereste/orman-urunleri", label: "Orman Ürünleri Türleri" },
    ],
  },
  { href: "/gayrimenkul", label: "Gayrimenkul" },
  { href: "/projelerimiz", label: "Projeler" },
  { href: "/tokat", label: "Tokat" },
  { href: "/iletisim", label: "İletişim" },
];

export const BUSINESS_AREAS = [
  {
    href: "/yapi-malzemeleri",
    label: "Yapı Market",
    title: "Yapı Malzemeleri",
    description:
      "Boya, yalıtım, çimento, çatı ve nalbur ürünleri — stoklu, hızlı tedarik.",
    image: "/products/boya-rulo.jpg",
  },
  {
    href: "/kereste",
    label: "Kereste",
    title: "Kereste & Orman Ürünleri",
    description:
      "Kereste, OSB, plywood ve lambri — şantiye ve tadilat için doğru levha.",
    image: "/products/kereste-yigin.jpg",
  },
  {
    href: "/gayrimenkul",
    label: "Gayrimenkul",
    title: "Gayrimenkul",
    description:
      "Satılık ve kiralık konut, arsa ve işyeri — Turhal / Tokat odaklı portföy.",
    image: "/projects/modern-konut-cephe.jpg",
  },
] as const;

/** Footer / düz listeler için alt başlıkları açılmış menü */
export function flattenNavLinks(links: readonly NavItem[] = NAV_LINKS) {
  return links.flatMap((link) =>
    link.children?.length ? [...link.children] : [link],
  );
}

/** WhatsApp sohbet URL’si oluşturur. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
