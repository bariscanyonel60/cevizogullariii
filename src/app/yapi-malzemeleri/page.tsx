import type { Metadata } from "next";
import Link from "next/link";
import { FileText, PaintBucket, Shield, Home } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ProductFilters } from "@/components/organisms/shared/ProductFilters";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import {
  BRANDS,
  EXTERIOR_PACKAGE,
  getCategoryCounts,
  products,
} from "@/data/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ürünler · Yapı Malzemeleri",
  description:
    "Polisan dış cephe boyası, mantolama, yalıtım, çatı ve evin dışı için gereken tüm yapı malzemeleri. Turhal / Tokat.",
  path: "/yapi-malzemeleri",
});

export default function ProductsPage() {
  const categories = getCategoryCounts().filter((c) => c.count > 0);

  return (
    <>
      <PageHero
        title="Yapı Malzemeleri & Ürünler"
        description="Evinizin dışı için boyadan mantolamaya, çatıdan sıvaya kadar her şey. Polisan ve diğer büyük markalar stoklarımızda."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı Market" },
        ]}
      />

      {/* Dış cephe paketi */}
      <section className="container-wide py-12 md:py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-900 via-forest-800 to-earth-700 px-6 py-10 text-white md:px-10 md:py-12">
            <div className="pointer-events-none absolute -right-16 top-0 size-64 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  <Home className="size-4" aria-hidden />
                  Evin dışı için komple çözüm
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-balance">
                  Duvar boyasından mantolamaya — dış cephe paketiniz hazır
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                  Astar, Polisan dış cephe boyası, EPS/XPS, file, sıva, membran ve
                  oluk… Tadilat veya yeni yapıda ihtiyacınız olan malzemeleri tek
                  noktadan temin edin.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="gold">
                    <a href="#urunler">Ürünlere Git</a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/teklif-al">Dış Cephe Teklifi Al</Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {EXTERIOR_PACKAGE.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="font-display text-sm font-semibold text-gold-300">
                      {step.title}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-white/70">
                      {step.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Markalar */}
      <section className="container-wide pb-8">
        <Reveal>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Markalar
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink-900">
                Büyük firmaların ürünlerini kullanıyoruz
              </h2>
            </div>
            <PaintBucket className="hidden size-8 text-forest-700 sm:block" aria-hidden />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BRANDS.map((brand) => (
              <a
                key={brand.name}
                href={`#urunler`}
                className="flex items-start gap-3 rounded-2xl border border-earth-400/10 bg-white p-5 shadow-sm transition hover:border-forest-700/20 hover:shadow-premium"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-800 font-display text-sm font-bold text-gold-300">
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
                <span>
                  <span className="block font-display font-semibold text-ink-900">
                    {brand.name}
                  </span>
                  <span className="mt-1 block text-sm text-ink-500">
                    {brand.blurb}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Kategori özeti */}
      <section className="container-wide py-10">
        <Reveal>
          <div className="mb-6 flex items-center gap-2">
            <Shield className="size-5 text-forest-700" aria-hidden />
            <h2 className="font-display text-xl font-bold text-ink-900">
              Kategoriler
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <a
                key={cat.key}
                href="#urunler"
                className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium"
              >
                <p className="font-display text-sm font-semibold text-forest-800">
                  {cat.label}
                </p>
                <p className="mt-1 text-xs text-ink-400">{cat.count} ürün</p>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Katalog + teklif */}
      <section className="container-wide pb-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-forest-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Katalog & toplu teklif
              </h2>
              <p className="mt-1 text-sm text-white/65">
                Polisan boya, mantolama seti veya şantiye listesi için hemen
                teklif alın.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/iletisim">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ürün listesi */}
      <section className="container-wide pb-16 md:pb-24">
        <ProductFilters items={products} />
      </section>
    </>
  );
}
