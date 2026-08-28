/**
 * Cloudinary medya yardımcıları.
 * NEXT_PUBLIC_USE_CLOUDINARY=true iken CDN URL üretir.
 */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "ymm7xvz0";
const USE_CDN = process.env.NEXT_PUBLIC_USE_CLOUDINARY === "true";
const FOLDER = "cevizogullari";

/** `/products/foo.jpg` → `cevizogullari/products/foo` */
export function toCloudinaryPublicId(localPath: string): string {
  const cleaned = localPath.replace(/^\//, "").replace(/\.[^.]+$/, "");
  return `${FOLDER}/${cleaned}`;
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
