/**
 * Cloudinary medya yardımcıları.
 * NEXT_PUBLIC_USE_CLOUDINARY=true iken CDN URL üretir.
 */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "ymm7xvz0";
const USE_CDN = process.env.NEXT_PUBLIC_USE_CLOUDINARY === "true";
const FOLDER = "cevizogullari";

/** Lighthouse / DPR dengesi — üst sınır (görüntülenen CSS px * 2 civarı). */
const MAX_DELIVERY_WIDTH = 1200;

/** `/products/foo.jpg` → `cevizogullari/products/foo` */
export function toCloudinaryPublicId(localPath: string): string {
  const cleaned = localPath.replace(/^\//, "").replace(/\.[^.]+$/, "");
  return `${FOLDER}/${cleaned}`;
}

function isCloudinaryTransformSegment(segment: string): boolean {
  return /^(f_|q_|w_|c_|dpr_|fl_|e_|so_)/.test(segment) || segment.includes(",");
}

/**
 * next/image `sizes` → Cloudinary w_ tahmini.
 * Media-query breakpoint px (640/768/1024…) boyut sanılmamalı.
 */
export function widthFromSizes(sizes?: string): number {
  if (!sizes) return 800;

  const trimmed = sizes.trim();
  const exactPx = trimmed.match(/^(\d+)px$/u);
  if (exactPx) {
    return Math.min(640, Number(exactPx[1]) * 2);
  }

  let estimate = 0;
  for (const part of trimmed.split(",")) {
    const token = part.trim().match(/(\d+)(vw|px)\s*$/u);
    if (!token) continue;
    const n = Number(token[1]);
    const unit = token[2];

    if (unit === "px") {
      // max-width: 1024px gibi breakpoint'leri atla
      if (n === 640 || n === 768 || n === 1024 || n === 1280 || n === 1536) {
        continue;
      }
      estimate = Math.max(estimate, n * 2);
      continue;
    }

    if (n >= 100) estimate = Math.max(estimate, 1100);
    else if (n >= 66) estimate = Math.max(estimate, 960);
    else if (n >= 50) estimate = Math.max(estimate, 860);
    else if (n >= 33) estimate = Math.max(estimate, 700);
    else if (n >= 25) estimate = Math.max(estimate, 520);
    else estimate = Math.max(estimate, 320);
  }

  if (estimate <= 0) return 800;
  return Math.min(MAX_DELIVERY_WIDTH, Math.round(estimate));
}

/**
 * Cloudinary URL’ye genişlik ekler (Lighthouse “displayed size” uyarısı).
 * Mevcut dönüşüm katmanını w_,c_limit,f_auto,q_auto:eco ile değiştirir.
 */
export function cloudinarySizedUrl(url: string, width: number): string {
  const marker = "/image/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) {
    return url;
  }
  const idx = url.indexOf(marker);
  const prefix = url.slice(0, idx + marker.length);
  const segments = url
    .slice(idx + marker.length)
    .split("/")
    .filter(Boolean);
  let i = 0;
  let version = "";
  if (segments[0] && /^v\d+$/.test(segments[0])) {
    version = segments[0];
    i = 1;
  }
  if (segments[i] && isCloudinaryTransformSegment(segments[i])) {
    i += 1;
    if (segments[i] && /^v\d+$/.test(segments[i])) {
      version = segments[i];
      i += 1;
    }
  }
  const publicId = segments.slice(i).join("/");
  if (!publicId) return url;
  const w = Math.max(32, Math.min(MAX_DELIVERY_WIDTH, Math.round(width)));
  const versionPath = version ? `${version}/` : "";
  return `${prefix}w_${w},c_limit,f_auto,q_auto:eco/${versionPath}${publicId}`;
}

/** Yerel path veya Cloudinary delivery URL */
export function mediaUrl(localPath: string): string {
  if (!localPath) return localPath;
  if (localPath.startsWith("http://") || localPath.startsWith("https://")) {
    return localPath;
  }
  if (!USE_CDN) return localPath;

  const publicId = toCloudinaryPublicId(localPath);
  // Hydration-safe base (CdnImage hydrate sonrası w_ + q_auto:eco ekler)
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/${publicId}`;
}

/** Cloudinary video public id veya yerel mp4 yolu */
export function videoUrl(publicId: string, localFallback?: string): string {
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    return publicId;
  }
  if (!USE_CDN) return localFallback || `/${publicId}`;
  return `https://res.cloudinary.com/${CLOUD}/video/upload/w_1280,c_limit,q_auto:eco,vc_auto/${publicId}.mp4`;
}

/** Videodan poster karesi (Cloudinary so_ dönüşümü) */
export function videoPosterUrl(
  publicId: string,
  localFallback?: string,
  startOffset = 1.2,
): string {
  if (!USE_CDN) return localFallback || "";
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_${startOffset},q_auto:eco,f_jpg/${publicId}.jpg`;
}

/** OG / JSON-LD için mutlak URL (CDN açıksa Cloudinary, değilse site origin). */
export function absoluteMediaUrl(localPath: string, origin: string): string {
  const resolved = mediaUrl(localPath);
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  const path = resolved.startsWith("/") ? resolved : `/${resolved}`;
  return `${origin}${path}`;
}

/** Anasayfa duvarı: tekrarlayan kareleri at, en fazla maxCount bırak. */
export function pickPreviewMedia<T extends { url: string }>(
  items: T[],
  maxCount = 6,
): T[] {
  const unique: T[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (!item.url || seen.has(item.url)) continue;
    seen.add(item.url);
    unique.push(item);
    if (unique.length >= maxCount) break;
  }

  return unique;
}
