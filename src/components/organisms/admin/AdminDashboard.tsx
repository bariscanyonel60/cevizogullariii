"use client";

import { CdnImage } from "@/components/atoms/CdnImage";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Images,
  Save,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import type { MediaCollection, MediaItem } from "@/lib/media-types";

const TABS: { id: MediaCollection; label: string }[] = [
  { id: "gallery", label: "Galeri" },
  { id: "yapi-insaat", label: "Yapı - İnşaat" },
];

type MediaDraft = {
  title: string;
  alt: string;
  visible: boolean;
};

type MediaCardProps = {
  item: MediaItem;
  index: number;
  total: number;
  busy: boolean;
  onDelete: (id: string) => Promise<void>;
  onMove: (id: string, direction: "up" | "down") => Promise<void>;
  onUpdate: (id: string, draft: MediaDraft) => Promise<boolean>;
};

function MediaCard({
  item,
  index,
  total,
  busy,
  onDelete,
  onMove,
  onUpdate,
}: MediaCardProps) {
  const [draft, setDraft] = useState<MediaDraft>({
    title: item.title ?? "",
    alt: item.alt,
    visible: item.visible !== false,
  });

  useEffect(() => {
    setDraft({
      title: item.title ?? "",
      alt: item.alt,
      visible: item.visible !== false,
    });
  }, [item.alt, item.id, item.title, item.visible]);

  const captionDirty =
    draft.title !== (item.title ?? "") || draft.alt !== item.alt;

  async function saveCaption() {
    await onUpdate(item.id, draft);
  }

  async function toggleVisibility() {
    const next = { ...draft, visible: !draft.visible };
    setDraft(next);
    const saved = await onUpdate(item.id, next);
    if (!saved) {
      setDraft(draft);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-earth-400/10 bg-white shadow-sm">
      <div className="relative aspect-4/3 bg-mist-100">
        <CdnImage
          src={item.url}
          alt={item.alt}
          fill
          className={`object-cover ${item.visible === false ? "opacity-45 grayscale" : ""}`}
          sizes="(max-width: 640px) 100vw, 320px"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            item.visible === false
              ? "bg-ink-900/80 text-white"
              : "bg-white/90 text-forest-800"
          }`}
        >
          {item.visible === false ? "Gizli" : "Yayında"}
        </span>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-950/80 to-transparent p-3">
          <p className="line-clamp-2 text-sm font-medium text-white">
            {draft.title || draft.alt}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <Label htmlFor={`title-${item.id}`}>
            Üzerine gelince görünen yazı
          </Label>
          <Textarea
            id={`title-${item.id}`}
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="Kartın üzerine gelince ve büyütünce çıkan kısa başlık"
            className="min-h-20"
          />
          <p className="mt-1 text-xs text-ink-400">
            Sitede fotoğrafın üzerine gelince bu yazı görünür.
          </p>
        </div>
        <div>
          <Label htmlFor={`alt-${item.id}`}>Açıklama</Label>
          <Textarea
            id={`alt-${item.id}`}
            value={draft.alt}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                alt: event.target.value,
              }))
            }
            placeholder="Görseli tam cümleyle anlatın"
            className="min-h-24"
          />
          <p className="mt-1 text-xs text-ink-400">
            Büyütülmüş görselin altında ve arama motorlarında kullanılır. Boş
            bırakılamaz.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={busy || !captionDirty || !draft.alt.trim()}
            onClick={() => void saveCaption()}
          >
            <Save className="size-4" />
            Yazıları kaydet
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() => void toggleVisibility()}
            title={draft.visible ? "Siteden gizle" : "Sitede yayınla"}
          >
            {draft.visible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
            {draft.visible ? "Gizle" : "Yayınla"}
          </Button>
        </div>
        <div className="flex items-center justify-between border-t border-earth-400/10 pt-3">
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-lg p-2 text-ink-500 transition hover:bg-mist-100 hover:text-forest-800 disabled:opacity-30"
              disabled={busy || index === 0}
              onClick={() => void onMove(item.id, "up")}
              aria-label="Yukarı taşı"
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-ink-500 transition hover:bg-mist-100 hover:text-forest-800 disabled:opacity-30"
              disabled={busy || index === total - 1}
              onClick={() => void onMove(item.id, "down")}
              aria-label="Aşağı taşı"
            >
              <ArrowDown className="size-4" />
            </button>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
            disabled={busy}
            onClick={() => void onDelete(item.id)}
            aria-label="Görseli sil"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function AdminDashboard() {
  const [tab, setTab] = useState<MediaCollection>("yapi-insaat");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return items;
    return items.filter((item) =>
      `${item.title ?? ""} ${item.alt}`
        .toLocaleLowerCase("tr-TR")
        .includes(normalized),
    );
  }, [items, query]);

  const visibleCount = items.filter((item) => item.visible !== false).length;

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        const res = await fetch(`/api/media?collection=${tab}&raw=1`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Liste alınamadı");
        if (!cancelled) {
          setItems(data.items ?? []);
          setIsFallback(Boolean(data.isFallback));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Hata");
          setItems([]);
          setIsFallback(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchItems();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setError("En az bir dosya seçin");
      return;
    }
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      let nextItems = items;
      for (const [index, file] of files.entries()) {
        const body = new FormData();
        body.set("collection", tab);
        body.set("file", file);
        body.set("title", files.length === 1 ? title : "");
        body.set("alt", files.length === 1 && alt.trim() ? alt : file.name);
        const res = await fetch("/api/admin/media", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            `${index + 1}. dosya yüklenemedi: ${data.error ?? "Yükleme başarısız"}`,
          );
        }
        nextItems = data.items ?? nextItems;
        setItems(nextItems);
        setIsFallback(false);
      }
      setFiles([]);
      setTitle("");
      setAlt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage(`${files.length} görsel başarıyla yüklendi`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    if (
      !window.confirm(
        "Bu görsel hem panelden hem Cloudinary’den kalıcı olarak silinecek. Devam edilsin mi?",
      )
    ) {
      return;
    }
    setBusyId(id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/media?collection=${tab}&id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Silinemedi");
      setItems(data.items ?? []);
      setIsFallback(false);
      setMessage("Görsel silindi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silme hatası");
    } finally {
      setBusyId(null);
    }
  }

  async function onUpdate(id: string, draft: MediaDraft) {
    setBusyId(id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: tab, id, ...draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Değişiklik kaydedilemedi");
      setItems(data.items ?? []);
      setIsFallback(false);
      setMessage("Değişiklikler kaydedildi");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncelleme hatası");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function onMove(id: string, direction: "up" | "down") {
    setBusyId(id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: tab, id, direction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sıralama değiştirilemedi");
      setItems(data.items ?? []);
      setIsFallback(false);
      setMessage("Görsel sırası güncellendi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sıralama hatası");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">
          İçerik yönetimi
        </h2>
        <p className="mt-2 text-sm text-ink-500">
          Cloudinary’deki görselleri buradan yönetin. Her kartta üzerine gelince
          çıkan yazıyı ve açıklamayı doğrudan değiştirebilirsiniz.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === tab) return;
              setLoading(true);
              setTab(item.id);
              setQuery("");
              setMessage(null);
              setError(null);
            }}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
              tab === item.id
                ? "border-forest-700 bg-forest-800 text-white shadow-premium"
                : "border-earth-400/10 bg-white text-ink-700 shadow-sm hover:border-forest-800/25"
            }`}
          >
            <span
              className={`rounded-xl p-3 ${
                tab === item.id ? "bg-white/10" : "bg-forest-50 text-forest-800"
              }`}
            >
              <Images className="size-5" />
            </span>
            <span>
              <span className="block font-semibold">{item.label}</span>
              <span
                className={`text-xs ${
                  tab === item.id ? "text-white/70" : "text-ink-400"
                }`}
              >
                Görsel koleksiyonu
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Toplam
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900">
            {items.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Yayında
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-forest-800">
            {visibleCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Gizli
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-600">
            {items.length - visibleCount}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => void onUpload(e)}
        className="space-y-4 rounded-3xl border border-earth-400/15 bg-white p-6 shadow-premium"
      >
        <h2 className="font-display text-xl font-semibold text-ink-900">
          Yeni görsel yükle
        </h2>
        <div>
          <Label htmlFor="admin-file">Görseller</Label>
          <Input
            id="admin-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            ref={fileInputRef}
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
          <p className="mt-2 text-xs text-ink-400">
            JPG, PNG, WebP veya AVIF · dosya başına en fazla 10 MB
          </p>
        </div>
        {files.length <= 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="admin-title">Üzerine gelince görünen yazı</Label>
              <Textarea
                id="admin-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Örn. Ova Apt. 2 dış cephe"
                className="min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="admin-alt">Açıklama</Label>
              <Textarea
                id="admin-alt"
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
                placeholder="Görseli tam cümleyle anlatın"
                className="min-h-20"
              />
            </div>
          </div>
        )}
        {files.length > 1 && (
          <p className="rounded-xl bg-mist-50 p-3 text-sm text-ink-500">
            {files.length} dosya seçildi. İlk yüklemede dosya adları alt metin olarak
            kullanılacak; ardından kartlardan tek tek düzenleyebilirsiniz.
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-forest-700">{message}</p>}
        <Button type="submit" disabled={uploading || files.length === 0}>
          <Upload className="size-4" />
          {uploading
            ? "Yükleniyor..."
            : files.length > 1
              ? `${files.length} görseli yükle`
              : "Cloudinary’ye yükle"}
        </Button>
      </form>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {tab === "yapi-insaat" ? "Yapı - İnşaat görselleri" : "Galeri görselleri"}{" "}
            ({items.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Yazı veya açıklama ara"
              className="pl-10"
            />
          </div>
        </div>
        {isFallback && items.length > 0 && (
          <p className="rounded-2xl border border-gold-500/30 bg-gold-50 px-4 py-3 text-sm text-ink-700">
            Bunlar şu an sitede görünen varsayılan görseller. Düzenleme, silme veya
            yeni yükleme yaptığınızda kalıcı olarak kaydedilir.
          </p>
        )}
        {loading ? (
          <p className="text-sm text-ink-500">Yükleniyor…</p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Bu koleksiyonda görsel yok. Yukarıdan ekleyin; sitede de boş görünür.
          </p>
        ) : filteredItems.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-sm">
            Aramanızla eşleşen görsel bulunamadı.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                index={items.findIndex((candidate) => candidate.id === item.id)}
                total={items.length}
                busy={busyId === item.id}
                onDelete={onDelete}
                onMove={onMove}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
