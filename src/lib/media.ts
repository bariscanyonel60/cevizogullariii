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
function toCloudinaryPublicId(localPath: string): string {
  const cleaned = localPath.replace(/^\//, "").replace(/\.[^.]+$/, "");
  return `${FOLDER}/${cleaned}`;
}

function isCloudinaryTransformSegment(segment: string): boolean {
  return /^(f_|q_|w_|c_|dpr_|fl_|e_|so_)/.test(segment) || segment.includes(",");
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
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/${publicId}`;
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
