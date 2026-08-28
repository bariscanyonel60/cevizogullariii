"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { mediaUrl } from "@/lib/media";

function isHttpUrl(value: string) {
  return value.startsWith("https://") || value.startsWith("http://");
}

/**
 * next/image sarmalayıcı: yerel `/public` yolunu Cloudinary CDN URL’sine çevirir.
 * CDN 404 verirse aynı yerel yola düşer — Cloudinary’den silinen kareler boş kalmaz.
 */
export function CdnImage({ src, unoptimized, onError, ...props }: ImageProps) {
  const localSrc = typeof src === "string" && !isHttpUrl(src) ? src : null;
  const resolved = typeof src === "string" ? mediaUrl(src) : src;
  const [current, setCurrent] = useState(resolved);
  const remote = typeof current === "string" && isHttpUrl(current);

  return (
    <Image
      src={current}
      unoptimized={unoptimized ?? remote}
      onError={(event) => {
        if (localSrc && current !== localSrc) {
          setCurrent(localSrc);
        }
        onError?.(event);
      }}
      {...props}
    />
  );
}
