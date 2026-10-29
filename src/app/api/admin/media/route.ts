import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cloudinary, cloudinaryFolder, configureCloudinary } from "@/lib/cloudinary";
import {
  appendMedia,
  moveMedia,
  removeMedia,
  updateMedia,
} from "@/lib/media-store";
import { isMediaCollection } from "@/lib/media-types";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return null;
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Form okunamadı" }, { status: 400 });
  }

  const collectionRaw = String(form.get("collection") ?? "");
  if (!isMediaCollection(collectionRaw)) {
    return NextResponse.json(
      { error: "collection=gallery|yapi-insaat olmalı" },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Yalnızca JPG, PNG, WebP veya AVIF görsel yükleyin" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Görsel boyutu en fazla 10 MB olabilir" },
      { status: 400 },
    );
  }

  const title = String(form.get("title") ?? "").trim();
  const alt = String(form.get("alt") ?? "").trim() || file.name;

  try {
    configureCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = cloudinaryFolder(collectionRaw);

    const uploaded = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload başarısız"));
              return;
            }
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          },
        )
        .end(buffer);
    });

    const item = {
      id: randomUUID(),
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      title,
      alt,
      visible: true,
      createdAt: new Date().toISOString(),
    };

    const items = await appendMedia(collectionRaw, item);
    return NextResponse.json({ ok: true, item, items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Yükleme başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: {
    collection?: string;
    id?: string;
    title?: string;
    alt?: string;
    visible?: boolean;
    direction?: "up" | "down";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const collection = body.collection ?? "";
  const id = body.id?.trim() ?? "";
  if (!isMediaCollection(collection) || !id) {
    return NextResponse.json(
      { error: "collection ve id gerekli" },
      { status: 400 },
    );
  }

  if (body.direction) {
    if (body.direction !== "up" && body.direction !== "down") {
      return NextResponse.json({ error: "Geçersiz sıralama yönü" }, { status: 400 });
    }
    const result = await moveMedia(collection, id, body.direction);
    return NextResponse.json({ ok: true, ...result });
  }

  const alt = body.alt?.trim() ?? "";
  if (!alt) {
    return NextResponse.json({ error: "Alt metin boş bırakılamaz" }, { status: 400 });
  }

  const { items, updated } = await updateMedia(collection, id, {
    title: body.title?.trim() ?? "",
    alt,
    visible: body.visible !== false,
  });
  if (!updated) {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: updated, items });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection") ?? "";
  const id = searchParams.get("id") ?? "";

  if (!isMediaCollection(collection) || !id) {
    return NextResponse.json(
      { error: "collection ve id gerekli" },
      { status: 400 },
    );
  }

  const { items, removed } = await removeMedia(collection, id);
  if (!removed) {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }

  if (removed.publicId && !removed.publicId.startsWith("local/")) {
    try {
      configureCloudinary();
      await cloudinary.uploader.destroy(removed.publicId, {
        resource_type: "image",
      });
    } catch {
      // metadata silindi; Cloudinary silme hatası admin’i bloklamasın
    }
  }

  return NextResponse.json({ ok: true, items });
}
