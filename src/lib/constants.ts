export const SITE = {
  name: "Cevizoğulları Yapı Market & İnşaat",
  shortName: "Cevizoğulları",
  tagline: "Tokat & Turhal’da yapı malzemeleri ve inşaat tedariki",
  description:
    "Tokat / Turhal’da yapı market, mantolama, boya, yalıtım, orman ürünleri, OSB ve yapı-inşaat. Deprem koşullarına uygun ürün seçimi, hızlı tedarik — Zile, Erbaa, Niksar, Pazar ve yakın illere hizmet.",
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
    "Tokat orman ürünleri",
    "Tokat OSB",
    "Tokat yapı inşaat",
    "Turhal inşaat",
    "Erbaa yapı malzemeleri",
    "Niksar mantolama",
    "Zile inşaat malzemesi",
    "Pazar Tokat yapı",
    "Amasya yapı market",
    "Cevizoğulları",
  ],
} as const;

/** Anasayfa SSS — FAQPage şeması ile birlikte kullanılır (Google People Also Ask uyumlu) */
export const HOME_FAQS = [
  {
    question: "Tokat’ta yapı malzemesi nereden alınır?",
    answer:
      "Tokat yapı malzemeleri için Cevizoğulları Yapı Market, Turhal’da boya, mantolama, yalıtım, çatı, çimento, OSB ve nalbur ürünlerini stoklu satar. Tokat merkez ile Zile, Erbaa, Niksar ve Pazar’a hızlı tedarik sunar.",
  },
  {
    question: "Turhal’da mantolama ve ısı yalıtım malzemesi satılıyor mu?",
    answer:
      "Evet. Turhal mağazamızda EPS/XPS strafor, karbonlu EPS, file, dübel, yapıştırıcı, dış cephe sıvası ve İzocam ürünleri bulunur. Tokat mantolama projelerinizde kalınlık ve sistem seçiminde yönlendirme yapıyoruz.",
  },
  {
    question: "Tokat’ta orman ürünleri, OSB ve plywood nereden alınır?",
    answer:
      "Cevizoğulları, Tokat / Turhal’da orman ürünleri, kereste, OSB, plywood (odek) ve laminat levha tedarik eder. Ölçü ve adet bilginizle şantiye veya tadilat ihtiyacınıza göre stok ve teslimat planlanır.",
  },
  {
    question: "Deprem yönetmeliğine uygun yapı malzemesi seçimi yapıyor musunuz?",
    answer:
      "Evet. TBDY bilinciyle yalıtım, bağlayıcı, cephe ve çatı ürünlerinde güvenli yapı yaklaşımını destekleriz. Tokat’taki konut ve bina işleriniz için deprem koşullarına uygun malzeme yönlendirmesi sağlarız.",
  },
  {
    question: "Cevizoğulları hangi bölgelere hizmet veriyor?",
    answer:
      "Merkezimiz Turhal / Tokat’tadır. Tokat (Merkez, Zile, Erbaa, Niksar, Pazar), Amasya, Yozgat, Sivas, Çorum ve Samsun’daki şantiye ile tadilat projelerine yapı market, orman ürünleri ve inşaat tedariki sunuyoruz.",
  },
  {
    question: "Tokat yapı market’ten teklif nasıl alınır?",
    answer:
      "Teklif Al formundan veya WhatsApp (+90 535 573 01 15) hattımızdan ürün listesi ve miktarı iletin. Turhal mağazamız Pzt–Cmt 08:00–19:00 açıktır; hızlı fiyat ve stok dönüşü yapılır.",
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
      { href: "/tokat", label: "Tokat" },
      { href: "/blog", label: "Blog" },
      { href: "/kvkk", label: "KVKK" },
    ],
  },
  { href: "/yapi-malzemeleri", label: "Yapı Market" },
  {
    href: "/orman-urunleri",
    label: "Orman Ürünleri",
    children: [
      { href: "/orman-urunleri/kerestecilik", label: "Kerestecilik" },
      { href: "/orman-urunleri/plywood", label: "Plywood" },
      { href: "/orman-urunleri/osb", label: "OSB" },
      { href: "/orman-urunleri/turler", label: "Türler" },
    ],
  },
  { href: "/yapi-insaat", label: "Yapı - İnşaat" },
  { href: "/projelerimiz", label: "Projeler" },
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
    href: "/orman-urunleri",
    label: "Orman Ürünleri",
    title: "Orman Ürünleri",
    description:
      "Kereste, OSB, plywood ve lambri — şantiye ve tadilat için doğru levha.",
    image: "/products/kereste-yigin.jpg",
  },
  {
    href: "/yapi-insaat",
    label: "Yapı - İnşaat",
    title: "Yapı - İnşaat",
    description:
      "Konut ve bina inşaatı, dış cephe ve şantiye uygulamaları — Turhal / Tokat.",
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
