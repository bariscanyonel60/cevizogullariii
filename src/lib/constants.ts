export const SITE = {
  name: "Cevizoğulları Yapı Market & İnşaat",
  shortName: "Cevizoğulları",
  tagline: "Turhal’da yapı market, orman ürünleri ve inşaat tedariki",
  description:
    "Cevizoğulları: Turhal / Tokat’ta boya, mantolama, çimento, OSB, kereste ve yapı-inşaat. Stoklu reyon, usta yönlendirmesi, talep olunca kendi aracımızla teslimat — Zile, Erbaa, Niksar, Pazar ve yakın illere.",
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
    question: "Tokat yapı malzemeleri nereden alınır?",
    answer:
      "Tokat yapı malzemeleri için Cevizoğulları Yapı Market, Turhal Pazar Mahallesi’nde boya, mantolama, çatı, çimento, OSB ve nalbur satar. Listeyi getirin veya yazın; stoktaysa yükler, talep olursa kendi aracımızla götürürüz.",
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

export const TOKAT_FAQS = [
  {
    question: "Tokat’ta mantolama malzemesi nereden alınır?",
    answer:
      "Cevizoğulları Yapı Market, Turhal’da EPS/XPS, file, dübel, yapıştırıcı ve dış cephe sıvasını stoklu sunar. Tokat mantolama projeleriniz için ürün seçimi ve tedarik desteği sağlarız.",
  },
  {
    question: "Turhal’da dış cephe boyası satıyor musunuz?",
    answer:
      "Evet. Permolit, Filli Boya ve Marshall dış cephe boyası ile astarları Turhal mağazamızda bulabilirsiniz. Renk ve yüzey tipine göre yönlendirme yapıyoruz.",
  },
  {
    question: "Tokat strafor / ısı yalıtım ürünleri var mı?",
    answer:
      "Tokat ısı yalıtım ihtiyacı için strafor (EPS), karbonlu EPS, XPS ve İzocam ürünlerini tedarik ediyoruz. Kalınlık ve kullanım alanına göre öneri veriyoruz.",
  },
  {
    question: "Erbaa, Niksar, Zile ve Pazar’a malzeme götürüyor musunuz?",
    answer:
      "Turhal merkezliyiz; Tokat merkez, Erbaa, Niksar, Zile, Pazar ve Amasya, Yozgat, Sivas, Çorum, Samsun’daki şantiye / tadilat işlerine ürün tedariki sunuyoruz. Detay için teklif alın.",
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
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];

export const BUSINESS_AREAS = [
  {
    href: "/yapi-malzemeleri",
    label: "Yapı Market",
    title: "Yapı Malzemeleri",
    description:
      "Permolit boya, mantolama, çimento, çatı ve nalbur — Turhal reyonundan şantiye listesine.",
    image: "/products/boya-rulo.jpg",
  },
  {
    href: "/orman-urunleri",
    label: "Orman Ürünleri",
    title: "Orman Ürünleri",
    description:
      "OSB, plywood, çam-kavak kereste ve lambri. Çatı, kalıp ve tadilat için stoklu levha.",
    image: "/products/kereste-yigin.jpg",
  },
  {
    href: "/yapi-insaat",
    label: "Yapı - İnşaat",
    title: "Yapı - İnşaat",
    description:
      "Konut ve bina, dış cephe mantolama ve tadilat. Malzeme ile uygulamayı aynı ekipten yürütün.",
    image: "/media/yapi-insaat/ova-apt-2-saha.jpg",
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
