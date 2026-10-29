"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  FolderKanban,
  HelpCircle,
  LayoutGrid,
  Package,
  Plus,
  Save,
  Trash2,
  Trees,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { CdnImage } from "@/components/atoms/CdnImage";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { CmsImageField } from "@/components/organisms/admin/CmsImageField";
import type { CmsEntity, CmsSnapshot } from "@/lib/cms-types";
import { PRODUCT_CATEGORY_LABELS } from "@/data/products";

type Tab = {
  id: CmsEntity;
  label: string;
  icon: typeof Package;
};

const TABS: Tab[] = [
  { id: "product", label: "Ürünler", icon: Package },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "project", label: "Projeler", icon: FolderKanban },
  { id: "orman", label: "Orman", icon: Trees },
  { id: "faq", label: "SSS", icon: HelpCircle },
  { id: "card", label: "Anasayfa", icon: LayoutGrid },
];

const EMPTY: CmsSnapshot = {
  products: [],
  brands: [],
  showcase: [],
  exterior: [],
  posts: [],
  projects: [],
  ormanPages: [],
  stats: [],
  testimonials: [],
  cards: [],
  faqs: [],
};

type Draft = Record<string, string>;

function line(items: string[] | undefined): string {
  return (items ?? []).join("\n");
}

function recordTitle(entity: CmsEntity, item: Record<string, unknown>): string {
  if (entity === "faq") return String(item.question ?? "");
  if (entity === "brand" || entity === "testimonial") return String(item.name ?? "");
  if (entity === "stat") return String(item.label ?? "");
  return String(item.title ?? item.navLabel ?? item.slug ?? item.id ?? "");
}

function recordId(entity: CmsEntity, item: Record<string, unknown>): string {
  if (entity === "orman") return String(item.slug ?? "");
  return String(item.id ?? item.slug ?? "");
}

function recordThumb(entity: CmsEntity, item: Record<string, unknown>): string {
  switch (entity) {
    case "product":
    case "orman":
    case "showcase":
      return String(item.image ?? "").trim();
    case "blog":
      return String(item.coverImage ?? "").trim();
    case "project": {
      const images = item.images;
      if (Array.isArray(images) && images.length > 0) {
        return String(images[0] ?? "").trim();
      }
      return String(item.beforeImage ?? "").trim();
    }
    case "faq":
    case "card":
    case "stat":
    case "testimonial":
    case "brand":
    case "exterior":
      return "";
    default: {
      const neverEntity: never = entity;
      return String(neverEntity);
    }
  }
}

function toDraft(entity: CmsEntity, item: Record<string, unknown> | null): Draft {
  if (!item) {
    if (entity === "card") return { kind: "why_us", title: "", description: "" };
    if (entity === "faq") return { page: "home", question: "", answer: "" };
    if (entity === "product") {
      return {
        title: "",
        slug: "",
        description: "",
        category: "boya",
        brand: "",
        unit: "",
        image: "",
        useCases: "genel",
        specs: "",
        featured: "",
      };
    }
    if (entity === "blog") {
      return {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Yapı",
        tags: "",
        coverImage: "",
        author: "Cevizoğulları Editör",
        publishedAt: new Date().toISOString().slice(0, 10),
        readingTime: "5",
      };
    }
    if (entity === "project") {
      return {
        title: "",
        slug: "",
        description: "",
        category: "yapi",
        location: "Turhal, Tokat",
        year: String(new Date().getFullYear()),
        images: "",
        featured: "",
      };
    }
    if (entity === "orman") {
      return {
        slug: "",
        title: "",
        navLabel: "",
        eyebrow: "Orman Ürünleri",
        description: "",
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        image: "",
        highlightsText: "",
        body: "",
        relatedSlugs: "",
        relatedCategories: "orman",
      };
    }
    return {};
  }

  switch (entity) {
    case "product":
      return {
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        slug: String(item.slug ?? ""),
        description: String(item.description ?? ""),
        category: String(item.category ?? "boya"),
        brand: String(item.brand ?? ""),
        unit: String(item.unit ?? ""),
        image: String(item.image ?? ""),
        useCases: line(item.useCases as string[]),
        specs: Array.isArray(item.specs)
          ? (item.specs as { label: string; value: string }[])
              .map((spec) => `${spec.label}: ${spec.value}`)
              .join("\n")
          : "",
        featured: item.featured ? "1" : "",
        catalogPdf: String(item.catalogPdf ?? ""),
      };
    case "blog":
      return {
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        slug: String(item.slug ?? ""),
        excerpt: String(item.excerpt ?? ""),
        content: String(item.content ?? ""),
        category: String(item.category ?? ""),
        tags: line(item.tags as string[]),
        coverImage: String(item.coverImage ?? ""),
        author: String(item.author ?? ""),
        publishedAt: String(item.publishedAt ?? ""),
        readingTime: String(item.readingTime ?? "5"),
      };
    case "project":
      return {
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        slug: String(item.slug ?? ""),
        description: String(item.description ?? ""),
        category: String(item.category ?? "yapi"),
        location: String(item.location ?? ""),
        year: String(item.year ?? ""),
        images: line(item.images as string[]),
        beforeImage: String(item.beforeImage ?? ""),
        afterImage: String(item.afterImage ?? ""),
        instagramUrl: String(item.instagramUrl ?? ""),
        featured: item.featured ? "1" : "",
      };
    case "orman":
      return {
        slug: String(item.slug ?? ""),
        href: String(item.href ?? ""),
        title: String(item.title ?? ""),
        navLabel: String(item.navLabel ?? ""),
        eyebrow: String(item.eyebrow ?? ""),
        description: String(item.description ?? ""),
        metaTitle: String(item.metaTitle ?? ""),
        metaDescription: String(item.metaDescription ?? ""),
        keywords: line(item.keywords as string[]),
        image: String(item.image ?? ""),
        highlightsText: Array.isArray(item.highlights)
          ? (item.highlights as { title: string; text: string }[])
              .map((row) => `${row.title} | ${row.text}`)
              .join("\n")
          : "",
        body: line(item.body as string[]),
        relatedSlugs: line(item.relatedSlugs as string[]),
        relatedCategories: line(item.relatedCategories as string[]),
      };
    case "faq":
      return {
        id: String(item.id ?? ""),
        page: String(item.page ?? "home"),
        question: String(item.question ?? ""),
        answer: String(item.answer ?? ""),
      };
    case "card":
      return {
        id: String(item.id ?? ""),
        kind: String(item.kind ?? "why_us"),
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        href: String(item.href ?? ""),
        step: String(item.step ?? ""),
        points: line(item.points as string[]),
      };
    case "stat":
      return {
        id: String(item.id ?? ""),
        value: String(item.value ?? ""),
        suffix: String(item.suffix ?? "+"),
        label: String(item.label ?? ""),
      };
    case "testimonial":
      return {
        id: String(item.id ?? ""),
        name: String(item.name ?? ""),
        role: String(item.role ?? ""),
        quote: String(item.quote ?? ""),
        rating: String(item.rating ?? "5"),
      };
    case "brand":
      return {
        id: String(item.id ?? ""),
        name: String(item.name ?? ""),
        blurb: String(item.blurb ?? ""),
      };
    case "showcase":
      return {
        id: String(item.id ?? ""),
        key: String(item.key ?? "boya"),
        label: String(item.label ?? ""),
        description: String(item.description ?? ""),
        image: String(item.image ?? ""),
      };
    case "exterior":
      return {
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        items: line(item.items as string[]),
      };
    default: {
      const neverEntity: never = entity;
      return { id: String(neverEntity) };
    }
  }
}

function itemsFor(snapshot: CmsSnapshot, entity: CmsEntity): Record<string, unknown>[] {
  switch (entity) {
    case "product":
      return snapshot.products as unknown as Record<string, unknown>[];
    case "blog":
      return snapshot.posts as unknown as Record<string, unknown>[];
    case "project":
      return snapshot.projects as unknown as Record<string, unknown>[];
    case "orman":
      return snapshot.ormanPages as unknown as Record<string, unknown>[];
    case "faq":
      return snapshot.faqs as unknown as Record<string, unknown>[];
    case "card":
      return snapshot.cards as unknown as Record<string, unknown>[];
    case "stat":
      return snapshot.stats as unknown as Record<string, unknown>[];
    case "testimonial":
      return snapshot.testimonials as unknown as Record<string, unknown>[];
    case "brand":
      return snapshot.brands as unknown as Record<string, unknown>[];
    case "showcase":
      return snapshot.showcase as unknown as Record<string, unknown>[];
    case "exterior":
      return snapshot.exterior as unknown as Record<string, unknown>[];
    default: {
      const neverEntity: never = entity;
      void neverEntity;
      return [];
    }
  }
}

export function CmsDashboard() {
  const [tab, setTab] = useState<CmsEntity>("product");
  const [homeKind, setHomeKind] = useState<"card" | "stat" | "testimonial" | "brand" | "showcase" | "exterior">("card");
  const [snapshot, setSnapshot] = useState<CmsSnapshot>(EMPTY);
  const [draft, setDraft] = useState<Draft>(() => toDraft("product", null));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const activeEntity: CmsEntity = tab === "card" ? homeKind : tab;

  const rows = useMemo(
    () => itemsFor(snapshot, activeEntity),
    [snapshot, activeEntity],
  );

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    setSelectedId(null);
    setDraft(toDraft(activeEntity, null));
    setError(null);
  }, [activeEntity]);

  async function load() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cms");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "İçerik yüklenemedi");
      setSnapshot(data.snapshot as CmsSnapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İçerik yüklenemedi");
    } finally {
      setBusy(false);
    }
  }

  function selectRow(item: Record<string, unknown>) {
    const id = recordId(activeEntity, item);
    setSelectedId(id);
    setDraft(toDraft(activeEntity, item));
    setNotice(null);
  }

  function newRecord() {
    setSelectedId(null);
    setDraft(toDraft(activeEntity, null));
    setNotice(null);
  }

  async function save() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const method = selectedId ? "PATCH" : "POST";
      const payload: Record<string, unknown> = {
        ...draft,
        entity: activeEntity,
        featured: draft.featured === "1",
      };
      if (selectedId) payload.id = selectedId;
      const res = await fetch("/api/admin/cms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Kayıt başarısız");
      setSnapshot(data.snapshot as CmsSnapshot);
      setNotice("Kaydedildi. Site içeriği veritabanından güncellenir.");
      const nextId =
        activeEntity === "orman"
          ? String(draft.slug ?? selectedId ?? "")
          : String(draft.id || selectedId || "");
      setSelectedId(nextId || selectedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu kaydı silmek istiyor musunuz?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/cms?entity=${encodeURIComponent(activeEntity)}&id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Silinemedi");
      setSnapshot(data.snapshot as CmsSnapshot);
      newRecord();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silinemedi");
    } finally {
      setBusy(false);
    }
  }

  function field(key: string, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 rounded-3xl border border-earth-400/15 bg-white p-4 shadow-sm md:p-5">
        <p className="text-sm text-ink-500">
          Ürün, blog, proje ve anasayfa metinleri MySQL’de tutulur. Galeri
          görselleri soldaki Medya sekmesindedir.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((item) => {
            const Icon = item.icon;
            const current = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  current
                    ? "bg-forest-800 text-white"
                    : "bg-mist-100 text-ink-600 hover:bg-forest-50"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
        {tab === "card" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["card", "Kartlar"],
                ["stat", "İstatistik"],
                ["testimonial", "Yorumlar"],
                ["brand", "Markalar"],
                ["showcase", "Kategori vitrin"],
                ["exterior", "Dış cephe paketi"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setHomeKind(id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  homeKind === id
                    ? "bg-gold-500 text-ink-950"
                    : "bg-ivory-50 text-ink-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-earth-400/15 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              {rows.length} kayıt
            </p>
            <Button type="button" variant="secondary" onClick={newRecord}>
              <Plus className="size-4" />
              Yeni
            </Button>
          </div>
          <div className="max-h-[70vh] space-y-1 overflow-auto">
            {rows.map((item) => {
              const id = recordId(activeEntity, item);
              const thumb = recordThumb(activeEntity, item);
              const selected = selectedId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectRow(item)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-sm transition ${
                    selected
                      ? "bg-forest-800 text-white"
                      : "text-ink-700 hover:bg-mist-100"
                  }`}
                >
                  {thumb ? (
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-mist-50">
                      <CdnImage
                        src={thumb}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">
                    {recordTitle(activeEntity, item) || id}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-3xl border border-earth-400/15 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-ink-900">
              {selectedId ? "Kaydı düzenle" : "Yeni kayıt"}
            </h2>
            <div className="flex gap-2">
              {selectedId ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => void remove(selectedId)}
                >
                  <Trash2 className="size-4" />
                  Sil
                </Button>
              ) : null}
              <Button type="button" disabled={busy} onClick={() => void save()}>
                <Save className="size-4" />
                {busy ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>

          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
          {notice ? <p className="mb-4 text-sm text-forest-800">{notice}</p> : null}

          <div className="grid gap-4">
            {activeEntity === "product" ? (
              <>
                <Field label="Başlık" value={draft.title} onChange={(v) => field("title", v)} />
                <Field label="Slug" value={draft.slug} onChange={(v) => field("slug", v)} />
                <Area label="Açıklama" value={draft.description} onChange={(v) => field("description", v)} />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Kategori</Label>
                    <select
                      className="mt-1 h-11 w-full rounded-xl border border-earth-400/20 bg-white px-3 text-sm"
                      value={draft.category}
                      onChange={(e) => field("category", e.target.value)}
                    >
                      {Object.entries(PRODUCT_CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field label="Marka" value={draft.brand} onChange={(v) => field("brand", v)} />
                  <Field label="Birim" value={draft.unit} onChange={(v) => field("unit", v)} />
                </div>
                <CmsImageField
                  label="Görsel"
                  value={draft.image}
                  onChange={(v) => field("image", v)}
                  folder="products"
                  stem={draft.slug}
                />
                <Area
                  label="Kullanım alanları (satır satır: dis-cephe, ic-mekan, cati, genel)"
                  value={draft.useCases}
                  onChange={(v) => field("useCases", v)}
                />
                <Area
                  label="Özellikler (satır satır: Etiket: Değer)"
                  value={draft.specs}
                  onChange={(v) => field("specs", v)}
                />
                <label className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
                  <input
                    type="checkbox"
                    checked={draft.featured === "1"}
                    onChange={(e) => field("featured", e.target.checked ? "1" : "")}
                  />
                  Anasayfada öne çıkar
                </label>
              </>
            ) : null}

            {activeEntity === "blog" ? (
              <>
                <Field label="Başlık" value={draft.title} onChange={(v) => field("title", v)} />
                <Field label="Slug" value={draft.slug} onChange={(v) => field("slug", v)} />
                <Area label="Özet" value={draft.excerpt} onChange={(v) => field("excerpt", v)} />
                <Area label="İçerik (Markdown)" value={draft.content} onChange={(v) => field("content", v)} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Kategori" value={draft.category} onChange={(v) => field("category", v)} />
                  <div className="md:col-span-2">
                    <CmsImageField
                      label="Kapak görseli"
                      value={draft.coverImage}
                      onChange={(v) => field("coverImage", v)}
                      folder="blog"
                      stem={draft.slug}
                    />
                  </div>
                  <Field label="Yazar" value={draft.author} onChange={(v) => field("author", v)} />
                  <Field label="Yayın tarihi" value={draft.publishedAt} onChange={(v) => field("publishedAt", v)} />
                  <Field label="Okuma süresi (dk)" value={draft.readingTime} onChange={(v) => field("readingTime", v)} />
                </div>
                <Area label="Etiketler (satır veya virgül)" value={draft.tags} onChange={(v) => field("tags", v)} />
              </>
            ) : null}

            {activeEntity === "project" ? (
              <>
                <Field label="Başlık" value={draft.title} onChange={(v) => field("title", v)} />
                <Field label="Slug" value={draft.slug} onChange={(v) => field("slug", v)} />
                <Area label="Açıklama" value={draft.description} onChange={(v) => field("description", v)} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Kategori" value={draft.category} onChange={(v) => field("category", v)} />
                  <Field label="Konum" value={draft.location} onChange={(v) => field("location", v)} />
                  <Field label="Yıl" value={draft.year} onChange={(v) => field("year", v)} />
                  <Field label="Instagram" value={draft.instagramUrl} onChange={(v) => field("instagramUrl", v)} />
                </div>
                <CmsImageField
                  label="Proje görselleri"
                  value={draft.images}
                  onChange={(v) => field("images", v)}
                  folder="projects"
                  stem={draft.slug}
                  multiple
                />
                <CmsImageField
                  label="Önce görseli"
                  value={draft.beforeImage}
                  onChange={(v) => field("beforeImage", v)}
                  folder="projects"
                  stem={draft.slug ? `${draft.slug}-once` : "once"}
                />
                <CmsImageField
                  label="Sonra görseli"
                  value={draft.afterImage}
                  onChange={(v) => field("afterImage", v)}
                  folder="projects"
                  stem={draft.slug ? `${draft.slug}-sonra` : "sonra"}
                />
                <label className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
                  <input
                    type="checkbox"
                    checked={draft.featured === "1"}
                    onChange={(e) => field("featured", e.target.checked ? "1" : "")}
                  />
                  Öne çıkan proje
                </label>
              </>
            ) : null}

            {activeEntity === "orman" ? (
              <>
                <Field label="Slug" value={draft.slug} onChange={(v) => field("slug", v)} />
                <Field label="Başlık" value={draft.title} onChange={(v) => field("title", v)} />
                <Field label="Menü etiketi" value={draft.navLabel} onChange={(v) => field("navLabel", v)} />
                <Area label="Açıklama" value={draft.description} onChange={(v) => field("description", v)} />
                <Field label="SEO başlığı" value={draft.metaTitle} onChange={(v) => field("metaTitle", v)} />
                <Area label="SEO açıklaması" value={draft.metaDescription} onChange={(v) => field("metaDescription", v)} />
                <CmsImageField
                  label="Görsel"
                  value={draft.image}
                  onChange={(v) => field("image", v)}
                  folder="orman"
                  stem={draft.slug}
                />
                <Area label="Anahtar kelimeler" value={draft.keywords} onChange={(v) => field("keywords", v)} />
                <Area
                  label="Öne çıkanlar (Başlık | Metin)"
                  value={draft.highlightsText}
                  onChange={(v) => field("highlightsText", v)}
                />
                <Area label="Gövde paragrafları" value={draft.body} onChange={(v) => field("body", v)} />
                <Area label="İlgili ürün slug’ları" value={draft.relatedSlugs} onChange={(v) => field("relatedSlugs", v)} />
              </>
            ) : null}

            {activeEntity === "faq" ? (
              <>
                <div>
                  <Label>Sayfa</Label>
                  <select
                    className="mt-1 h-11 w-full rounded-xl border border-earth-400/20 bg-white px-3 text-sm"
                    value={draft.page}
                    onChange={(e) => field("page", e.target.value)}
                  >
                    <option value="home">Anasayfa</option>
                    <option value="tokat">Tokat</option>
                  </select>
                </div>
                <Field label="Soru" value={draft.question} onChange={(v) => field("question", v)} />
                <Area label="Cevap" value={draft.answer} onChange={(v) => field("answer", v)} />
              </>
            ) : null}

            {activeEntity === "card" ? (
              <>
                <div>
                  <Label>Tür</Label>
                  <select
                    className="mt-1 h-11 w-full rounded-xl border border-earth-400/20 bg-white px-3 text-sm"
                    value={draft.kind}
                    onChange={(e) => field("kind", e.target.value)}
                  >
                    <option value="why_us">Neden biz</option>
                    <option value="services">Hizmetler</option>
                    <option value="process">Süreç</option>
                    <option value="audience">Hedef kitle</option>
                  </select>
                </div>
                <Field label="Başlık" value={draft.title} onChange={(v) => field("title", v)} />
                <Area label="Açıklama" value={draft.description} onChange={(v) => field("description", v)} />
                <Field label="Link (hizmetler)" value={draft.href} onChange={(v) => field("href", v)} />
                <Field label="Adım no (süreç)" value={draft.step} onChange={(v) => field("step", v)} />
                <Area label="Maddeler (hedef kitle)" value={draft.points} onChange={(v) => field("points", v)} />
              </>
            ) : null}

            {activeEntity === "stat" ? (
              <>
                <Field label="Değer" value={draft.value} onChange={(v) => field("value", v)} />
                <Field label="Sonek" value={draft.suffix} onChange={(v) => field("suffix", v)} />
                <Field label="Etiket" value={draft.label} onChange={(v) => field("label", v)} />
              </>
            ) : null}

            {activeEntity === "testimonial" ? (
              <>
                <Field label="İsim" value={draft.name} onChange={(v) => field("name", v)} />
                <Field label="Rol" value={draft.role} onChange={(v) => field("role", v)} />
                <Area label="Yorum" value={draft.quote} onChange={(v) => field("quote", v)} />
                <Field label="Puan (1-5)" value={draft.rating} onChange={(v) => field("rating", v)} />
              </>
            ) : null}

            {activeEntity === "brand" ? (
              <>
                <Field label="Marka" value={draft.name} onChange={(v) => field("name", v)} />
                <Area label="Kısa açıklama" value={draft.blurb} onChange={(v) => field("blurb", v)} />
              </>
            ) : null}

            {activeEntity === "showcase" ? (
              <>
                <Field label="Kategori anahtarı" value={draft.key} onChange={(v) => field("key", v)} />
                <Field label="Etiket" value={draft.label} onChange={(v) => field("label", v)} />
                <Area label="Açıklama" value={draft.description} onChange={(v) => field("description", v)} />
                <CmsImageField
                  label="Görsel"
                  value={draft.image}
                  onChange={(v) => field("image", v)}
                  folder="products"
                  stem={draft.key}
                />
              </>
            ) : null}

            {activeEntity === "exterior" ? (
              <>
                <Field label="Başlık" value={draft.title} onChange={(v) => field("title", v)} />
                <Area label="Maddeler" value={draft.items} onChange={(v) => field("items", v)} />
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea className="mt-1" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
