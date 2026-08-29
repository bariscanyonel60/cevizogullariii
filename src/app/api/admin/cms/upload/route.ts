import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cloudinary, cloudinaryFolder, configureCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const CMS_FOLDERS = ["products", "blog", "projects", "orman"] as const;
type CmsUploadFolder = (typeof CMS_FOLDERS)[number];

function isCmsUploadFolder(value: string): value is CmsUploadFolder {
  return (CMS_FOLDERS as readonly string[]).includes(value);
}

function slugStem(value: string): string {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  const folded = value.replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => map[ch] ?? ch);
  return folded
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function publicIdToLocalPath(publicId: string, format: string): string {
  const relative = publicId.replace(/^cevizogullari\//, "");
  const ext = format.replace(/^\./, "").toLowerCase() || "jpg";
  return `/${relative}.${ext}`;
}

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

  const folderRaw = String(form.get("folder") ?? "");
  if (!isCmsUploadFolder(folderRaw)) {
    return NextResponse.json(
      { error: "folder=products|blog|projects|orman olmalı" },
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

  const requestedStem = slugStem(String(form.get("stem") ?? ""));
  const fileStem = slugStem(file.name.replace(/\.[^.]+$/, ""));
  const stem = requestedStem || fileStem || randomUUID().slice(0, 12);

  try {
    configureCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = cloudinaryFolder(folderRaw);

    const uploaded = await new Promise<{
      secure_url: string;
      public_id: string;
      format: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: stem,
            resource_type: "image",
            overwrite: Boolean(requestedStem),
            invalidate: true,
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload başarısız"));
              return;
            }
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format ?? "jpg",
            });
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      ok: true,
      path: publicIdToLocalPath(uploaded.public_id, uploaded.format),
      url: uploaded.secure_url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Yükleme başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
