"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/molecules/ProductCard";
import {
  PRODUCT_CATEGORY_LABELS,
  USE_CASE_LABELS,
} from "@/data/products";
import type { Product, ProductCategory, ProductUseCase } from "@/types";

type FiltersProps = {
  items: Product[];
  initialCategory?: "" | ProductCategory;
  initialUseCase?: "" | ProductUseCase;
};

export function ProductFilters({
  items,
  initialCategory = "",
  initialUseCase = "",
}: FiltersProps) {
  const [category, setCategory] = useState<"" | ProductCategory>(initialCategory);
  const [useCase, setUseCase] = useState<"" | ProductUseCase>(initialUseCase);
  const [brand, setBrand] = useState("");
  const [query, setQuery] = useState("");

  const brands = useMemo(
    () => [...new Set(items.map((i) => i.brand))].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = !category || item.category === category;
      const matchesUse =
        !useCase || item.useCases.includes(useCase);
      const matchesBrand = !brand || item.brand === brand;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesUse && matchesBrand && matchesQuery;
    });
  }, [items, category, useCase, brand, query]);

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-forest-800 text-white"
        : "bg-white text-ink-700 shadow-sm hover:bg-forest-50"
    }`;

  return (
    <div id="urunler">
      <div className="mb-6 space-y-4 rounded-3xl bg-white p-4 shadow-premium md:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-xl font-bold text-ink-900 md:text-2xl">
            Ürünler
          </h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün veya marka ara (örn. Polisan)..."
            aria-label="Ürün ara"
            className="h-11 w-full rounded-full border border-earth-400/20 bg-ivory-50 px-5 text-sm lg:w-80"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
            Kullanım
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chip(useCase === "")}
              onClick={() => setUseCase("")}
            >
              Tümü
            </button>
            {(Object.keys(USE_CASE_LABELS) as ProductUseCase[]).map((key) => (
              <button
                key={key}
                type="button"
                className={chip(useCase === key)}
                onClick={() => setUseCase(key)}
              >
                {USE_CASE_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
            Kategori
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chip(category === "")}
              onClick={() => setCategory("")}
            >
              Tümü
            </button>
            {(Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[]).map(
              (key) => (
                <button
                  key={key}
                  type="button"
                  className={chip(category === key)}
                  onClick={() => setCategory(key)}
                >
                  {PRODUCT_CATEGORY_LABELS[key]}
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
            Marka
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chip(brand === "")}
              onClick={() => setBrand("")}
            >
              Tüm Markalar
            </button>
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                className={chip(brand === b)}
                onClick={() => setBrand(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-ink-500">
        {filtered.length} ürün listeleniyor
        {useCase === "dis-cephe" && " · Dış cephe paketinde önerilenler"}
        {brand && ` · ${brand}`}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-3xl bg-white p-10 text-center text-ink-500 shadow-premium">
          Bu filtrelere uygun ürün bulunamadı. Filtreleri temizleyip tekrar
          deneyin.
        </p>
      )}
    </div>
  );
}
