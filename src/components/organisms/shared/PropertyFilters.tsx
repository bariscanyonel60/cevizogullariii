"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Heart, Map, Search } from "lucide-react";
import { PropertyCard } from "@/components/molecules/PropertyCard";
import { Input } from "@/components/atoms/Input";
import type { Property, PropertyCategory, PropertyStatus } from "@/types";
import { cn } from "@/lib/utils";

const FAVORITES_KEY = "cvz-property-favorites";
const FAVORITES_EVENT = "cvz-favorites";

function subscribeFavorites(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(FAVORITES_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(FAVORITES_EVENT, onStoreChange);
  };
}

function getFavoritesSnapshot() {
  return localStorage.getItem(FAVORITES_KEY) ?? "[]";
}

function getFavoritesServerSnapshot() {
  return "[]";
}

function writeFavorites(next: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

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

const roomOptions = ["", "2+1", "3+1", "4+1", "5+1"];

export function PropertyFilters({ items }: { items: Property[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"" | PropertyCategory>("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState<"" | PropertyStatus>("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const favoritesRaw = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );
  const favorites = useMemo(() => {
    try {
      return JSON.parse(favoritesRaw) as string[];
    } catch {
      return [];
    }
  }, [favoritesRaw]);

  function toggleFavorite(slug: string) {
    const next = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];
    writeFavorites(next);
  }

  const cities = useMemo(
    () => [...new Set(items.map((i) => i.city))],
    [items],
  );
  const districts = useMemo(
    () =>
      [
        ...new Set(
          items.filter((i) => !city || i.city === city).map((i) => i.district),
        ),
      ],
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
      const matchesArea = !minArea || item.area >= Number(minArea);
      const matchesRooms = !rooms || item.rooms.includes(rooms);
      const matchesFav = !favoritesOnly || favorites.includes(item.slug);
      return (
        matchesQuery &&
        matchesCategory &&
        matchesCity &&
        matchesDistrict &&
        matchesStatus &&
        matchesPrice &&
        matchesArea &&
        matchesRooms &&
        matchesFav
      );
    });
  }, [
    items,
    query,
    category,
    city,
    district,
    status,
    maxPrice,
    minArea,
    rooms,
    favoritesOnly,
    favorites,
  ]);

  const selectClass =
    "h-12 w-full rounded-xl border border-earth-400/20 bg-white px-4 text-sm";

  return (
    <div>
      <div className="mb-6 grid gap-3 rounded-3xl bg-white p-4 shadow-premium md:grid-cols-3 lg:grid-cols-4 md:p-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <Input
            className="pl-10"
            placeholder="Ara (başlık, ilçe)..."
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
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          aria-label="Oda sayısı"
        >
          <option value="">Oda</option>
          {roomOptions.filter(Boolean).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Min m²"
          value={minArea}
          onChange={(e) => setMinArea(e.target.value)}
          aria-label="Minimum metrekare"
        />
        <Input
          type="number"
          placeholder="Max fiyat"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Maksimum fiyat"
          className="lg:col-span-2"
        />
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          <button
            type="button"
            onClick={() => setFavoritesOnly((v) => !v)}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-medium transition",
              favoritesOnly
                ? "bg-forest-800 text-white"
                : "border border-earth-400/20 bg-white text-ink-700 hover:bg-forest-50",
            )}
          >
            <Heart
              className={cn("size-4", favoritesOnly && "fill-current")}
            />
            Favoriler ({favorites.length})
          </button>
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-medium transition",
              showMap
                ? "bg-forest-800 text-white"
                : "border border-earth-400/20 bg-white text-ink-700 hover:bg-forest-50",
            )}
          >
            <Map className="size-4" />
            Harita
          </button>
        </div>
      </div>

      {showMap && (
        <div className="mb-8 overflow-hidden rounded-3xl border border-dashed border-earth-400/30 bg-mist-100">
          <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-8 text-center">
            <Map className="size-8 text-forest-700" aria-hidden />
            <p className="font-display text-lg font-semibold text-ink-900">
              Harita görünümü yakında
            </p>
            <p className="max-w-md text-sm text-ink-500">
              Tokat / Turhal odaklı ilan haritası entegrasyonu için yer tutucu.
              Şimdilik listeden konum bilgisini inceleyebilirsiniz.
            </p>
          </div>
        </div>
      )}

      <p className="mb-6 text-sm text-ink-500">
        {filtered.length} ilan listeleniyor
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((property) => (
          <div key={property.id} className="relative">
            <PropertyCard property={property} />
            <button
              type="button"
              aria-label={
                favorites.includes(property.slug)
                  ? "Favorilerden çıkar"
                  : "Favorilere ekle"
              }
              onClick={() => toggleFavorite(property.slug)}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-forest-800 shadow-sm backdrop-blur transition hover:scale-105"
            >
              <Heart
                className={cn(
                  "size-4",
                  favorites.includes(property.slug) &&
                    "fill-orange-500 text-orange-500",
                )}
              />
            </button>
          </div>
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
