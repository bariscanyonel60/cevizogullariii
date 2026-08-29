"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { CdnImage } from "@/components/atoms/CdnImage";
import { Label } from "@/components/atoms/Label";
import { cn } from "@/lib/utils";

type CmsImageFolder = "products" | "blog" | "projects" | "orman";

function splitPaths(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueStem(base?: string) {
  const prefix = base?.trim() || "gorsel";
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function CmsImageField({
  label,
  value,
  onChange,
  folder,
  stem,
  multiple = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: CmsImageFolder;
  stem?: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const raw = value ?? "";
  const paths = multiple ? splitPaths(raw) : raw.trim() ? [raw.trim()] : [];

  async function uploadFile(file: File, nextStem?: string) {
    const body = new FormData();
    body.set("folder", folder);
    body.set("file", file);
    const resolved = nextStem?.trim();
    if (resolved) body.set("stem", resolved);
    const res = await fetch("/api/admin/cms/upload", { method: "POST", body });
    const data = (await res.json()) as { error?: string; path?: string };
    if (!res.ok || !data.path) {
      throw new Error(data.error ?? "Yükleme başarısız");
    }
    return data.path;
  }

  async function onFiles(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      if (multiple) {
        const uploaded: string[] = [];
        for (const file of files) {
          uploaded.push(await uploadFile(file, uniqueStem(stem)));
        }
        onChange([...paths, ...uploaded].join("\n"));
      } else {
        const path = await uploadFile(files[0], stem);
        onChange(path);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    if (multiple) {
      onChange(paths.filter((_, current) => current !== index).join("\n"));
      return;
    }
    onChange("");
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        disabled={uploading}
        className="sr-only"
        onChange={(event) => void onFiles(event.target.files)}
      />

      {multiple ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {paths.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="group relative aspect-4/3 overflow-hidden rounded-xl border border-earth-400/20 bg-mist-50"
            >
              <CdnImage
                src={src}
                alt=""
                fill
                sizes="240px"
                className="object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-ink-950/80 text-white opacity-90 transition hover:bg-red-600"
                aria-label="Görseli kaldır"
                onClick={() => removeAt(index)}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-earth-400/35 bg-mist-50 text-sm font-medium text-ink-500 transition hover:border-forest-700/40 hover:text-forest-800",
              uploading && "opacity-60",
            )}
          >
            {uploading ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <ImagePlus className="size-5" />
            )}
            Görsel ekle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {paths[0] ? (
            <div className="relative h-52 overflow-hidden rounded-xl border border-earth-400/20 bg-mist-50">
              <CdnImage
                key={paths[0]}
                src={paths[0]}
                alt={label}
                fill
                sizes="480px"
                className="object-contain p-2"
              />
            </div>
          ) : (
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex h-52 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-earth-400/35 bg-mist-50 text-sm font-medium text-ink-500 transition hover:border-forest-700/40 hover:text-forest-800"
            >
              {uploading ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-6" />
              )}
              Görsel seç
            </button>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-earth-400/20 bg-white px-4 text-sm font-semibold text-ink-700 transition hover:border-forest-700/30 hover:text-forest-800 disabled:opacity-60"
            >
              {uploading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <ImagePlus className="size-4" />
              )}
              {paths[0] ? "Görseli değiştir" : "Görsel seç"}
            </button>
            {paths[0] ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => removeAt(0)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-earth-400/20 bg-white px-4 text-sm font-semibold text-ink-600 transition hover:border-red-300 hover:text-red-700"
              >
                <Trash2 className="size-4" />
                Kaldır
              </button>
            ) : null}
          </div>
        </div>
      )}

      <p className="text-xs text-ink-400">
        Bilgisayardan JPG, PNG, WebP veya AVIF seçin (en fazla 10 MB). Yükledikten
        sonra Kaydet’e basın.
      </p>
      {uploading ? (
        <p className="inline-flex items-center gap-2 text-sm text-forest-800">
          <LoaderCircle className="size-4 animate-spin" />
          Cloudinary’ye yükleniyor...
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
