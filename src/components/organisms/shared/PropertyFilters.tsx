"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PropertyCard } from "@/components/molecules/PropertyCard";
import { Input } from "@/components/atoms/Input";
import type { Property, PropertyCategory, PropertyStatus } from "@/types";

const categories: { value: "" | PropertyCategory; label: string }[] = [
  { value: "", label: "Tüm Kategoriler" },
  { value: "konut", label: "Konut" },
  { value: "villa", label: "Villa" },
  { value: "arsa", label: "Arsa" },
  { value: "isyeri", label: "İşyeri" },
  { value: "ofis", label: "Ofis" },
];

const statuses: { value: "" | PropertyStatus; label: string }[] = [
  { value: "", label: "Tüm Durumlar" },
  { value: "satilik", label: "Satılık" },
  { value: "kiralik", label: "Kiralık" },
  { value: "rezerve", label: "Rezerve" },
];

export function PropertyFilters({ items }: { items: Property[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"" | PropertyCategory>("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState<"" | PropertyStatus>("");
  const [maxPrice, setMaxPrice] = useState("");

  const cities = useMemo(
    () => [...new Set(items.map((i) => i.city))],
    [items],
  );
  const districts = useMemo(
    () =>
      [...new Set(items.filter((i) => !city || i.city === city).map((i) => i.district))],
    [items, city],
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q);
      const matchesCategory = !category || item.category === category;
      const matchesCity = !city || item.city === city;
      const matchesDistrict = !district || item.district === district;
      const matchesStatus = !status || item.status === status;
      const matchesPrice = !maxPrice || item.price <= Number(maxPrice);
      return (
        matchesQuery &&
        matchesCategory &&
        matchesCity &&
        matchesDistrict &&
        matchesStatus &&
        matchesPrice
      );
    });
  }, [items, query, category, city, district, status, maxPrice]);

  const selectClass =
    "h-12 w-full rounded-xl border border-earth-400/20 bg-white px-4 text-sm";

  return (
    <div>
      <div className="mb-8 grid gap-3 rounded-3xl bg-white p-4 shadow-premium md:grid-cols-3 lg:grid-cols-6 md:p-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <Input
            className="pl-10"
            placeholder="Ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="İlan ara"
          />
        </div>
        <select
          className={selectClass}
          value={category}
          onChange={(e) => setCategory(e.target.value as "" | PropertyCategory)}
          aria-label="Kategori"
        >
          {categories.map((c) => (
            <option key={c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setDistrict("");
          }}
          aria-label="Şehir"
        >
          <option value="">Tüm Şehirler</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          aria-label="İlçe"
        >
          <option value="">Tüm İlçeler</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as "" | PropertyStatus)}
          aria-label="Durum"
        >
          {statuses.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Max fiyat"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Maksimum fiyat"
          className="md:col-span-3 lg:col-span-6"
        />
      </div>

      <p className="mb-6 text-sm text-ink-500">
        {filtered.length} ilan listeleniyor
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-3xl bg-white p-10 text-center text-ink-500 shadow-premium">
          Filtrelerinize uygun ilan bulunamadı.
        </p>
      )}
    </div>
  );
}
