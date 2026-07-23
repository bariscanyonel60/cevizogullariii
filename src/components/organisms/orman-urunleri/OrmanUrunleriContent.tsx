import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Truck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHero } from "@/components/organisms/shared/PageHero";
import type { OrmanUrunleriPage } from "@/data/orman-urunleri";
import { ORMAN_URUNLERI_PAGES } from "@/data/orman-urunleri";
import { getProductBySlug, products } from "@/data/products";

const applications = [
  "Çatı altı kaplama",
  "Kalıp ve şantiye",
  "İç mekân lambri",
  "Duvar / zemin levha",
];

const advantages = [
  "Stoklu orman ürünleri ve levha",
  "Doğru tür / kalınlık danışmanlığı",
  "Şantiye temposuna uygun tedarik",
  "Tokat / Turhal hızlı sevkiyat",
];

const deliverySteps = [
  { step: "01", title: "İhtiyaç", text: "Ölçü, adet ve kullanım alanını iletin." },
  { step: "02", title: "Öneri", text: "OSB, plywood veya kereste yönlendirmesi." },
  { step: "03", title: "Teklif", text: "Stok bilgisi ve teklif." },
  { step: "04", title: "Teslimat", text: "Depodan çıkış veya sevkiyat planı." },
];

type OrmanUrunleriContentProps = {
  page: OrmanUrunleriPage;
};

export function OrmanUrunleriContent({ page }: OrmanUrunleriContentProps) {
  const related = page.relatedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean);

  const categoryProducts = page.relatedCategories
    ? products
        .filter((product) => page.relatedCategories?.includes(product.category))
        .filter((product) => !page.relatedSlugs.includes(product.slug))
        .slice(0, 3)
    : [];

  const showcase = [...related, ...categoryProducts].slice(0, 3);
  const subLinks = ORMAN_URUNLERI_PAGES.filter((item) => item.slug !== "index");
  const gallery = [
    page.image,
    "/products/osb-panel.jpg",
    "/products/formwork.jpg",
    "/products/kereste-yigin.jpg",
  ];

  return (
    <>
      <PageHero
        title={page.title}
        description={page.description}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Orman Ürünleri", href: "/orman-urunleri" },
          ...(page.slug === "index" ? [] : [{ label: page.navLabel }]),
        ]}
      />

      <section className="container-wide py-8 md:py-10">
        <div className="flex flex-wrap gap-2">
          {subLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                item.href === page.href
                  ? "bg-forest-800 text-white"
                  : "border border-forest-700/15 bg-white text-forest-800 hover:bg-forest-50"
              }`}
            >
              {item.navLabel}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-wide pb-16 md:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src={page.image}
                alt={page.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              {page.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold text-ink-900 text-balance">
              {page.title}
            </h2>
            {page.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-4 leading-relaxed text-ink-500"
              >
                {paragraph}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/teklif-al">Teklif Al</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/yapi-malzemeleri">Yapı Market</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-earth-400/15 bg-white/80 p-5 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-forest-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest-950 py-16 text-white md:py-20">
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Ahşap Galeri
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Orman ürünleri & levha stokundan kareler
            </h2>
          </Reveal>
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-4">
            {gallery.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={src}
                    alt={`${page.title} galeri ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide section-padding">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Uygulama alanları
            </h2>
            <ul className="mt-6 space-y-3">
              {applications.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
                >
                  <CheckCircle2 className="size-5 text-forest-700" />
                  <span className="text-sm font-medium text-ink-700">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Avantajlar
            </h2>
            <ul className="mt-6 space-y-3">
              {advantages.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
                >
                  <Truck className="size-5 text-gold-600" />
                  <span className="text-sm font-medium text-ink-700">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Teslimat süreci
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {deliverySteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.06}>
                <div className="h-full rounded-3xl border border-earth-400/10 bg-white p-5 shadow-premium">
                  <p className="font-display text-sm font-bold tracking-[0.2em] text-gold-600">
                    {item.step}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {showcase.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
                İlgili ürünler
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Stoktan seçilmiş orman ürünleri.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {showcase.map((product, index) =>
                product ? (
                  <Reveal key={product.id} delay={index * 0.06}>
                    <ProductCard product={product} />
                  </Reveal>
                ) : null,
              )}
            </div>
          </div>
        )}

        <Reveal>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-forest-800 px-6 py-10 text-white md:flex-row md:items-center md:px-10">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Orman ürünleri teklifi alın
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Ölçü ve adet bilginizle WhatsApp veya form üzerinden hızlı dönüş.
              </p>
            </div>
            <Button asChild variant="gold" size="lg">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
