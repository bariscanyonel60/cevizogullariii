export const SITE = {
  name: "Cevizoğulları Yapı Market & İnşaat",
  shortName: "Cevizoğulları",
  tagline: "Profesyonel yapı malzemeleri & inşaat tedariki",
  description:
    "Turhal’da orman ürünleri, yalıtım ve inşaat malzemeleri tedarikinde güvenilir çözüm ortağınız. Kaliteli ürün, uygun fiyat ve hızlı teslimat.",
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
  hours: "Pzt–Cmt: 08:00–19:00",
} as const;

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
  { href: "/projelerimiz", label: "Yapı-İnşaat" },
  { href: "/iletisim", label: "İletişim" },
];

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
