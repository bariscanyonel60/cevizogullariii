import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  FileText,
  Hammer,
  Images,
  Newspaper,
  TreePine,
} from "lucide-react";

const LINKS = [
  {
    href: "/yapi-malzemeleri",
    label: "Yapı Malzemeleri",
    text: "Boya, mantolama, çatı ve nalbur",
    icon: Hammer,
  },
  {
    href: "/orman-urunleri",
    label: "Orman Ürünleri",
    text: "Kereste, OSB ve plywood",
    icon: TreePine,
  },
  {
    href: "/yapi-insaat",
    label: "Yapı - İnşaat",
    text: "Konut, cephe ve tadilat",
    icon: Building2,
  },
  {
    href: "/projelerimiz",
    label: "Projelerimiz",
    text: "Tamamlanan uygulamalar",
    icon: Images,
  },
  {
    href: "/blog",
    label: "Blog",
    text: "Malzeme seçim rehberleri",
    icon: Newspaper,
  },
  {
    href: "/teklif-al",
    label: "Teklif Al",
    text: "Ücretsiz fiyat ve stok bilgisi",
    icon: FileText,
  },
] as const;

export function HelpfulLinks({ title = "Size yardımcı olabilecek sayfalar" }: { title?: string }) {
  return (
    <nav aria-label={title} className="w-full">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
        {title}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex h-full items-start gap-3 rounded-2xl border border-earth-400/15 bg-white p-4 text-left shadow-sm transition hover:border-forest-700/25 hover:shadow-premium"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-800">
                <link.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-display font-semibold text-ink-900 group-hover:text-forest-800">
                  {link.label}
                  <ArrowUpRight className="size-3.5 opacity-60" aria-hidden />
                </span>
                <span className="mt-0.5 block text-sm text-ink-500">{link.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
