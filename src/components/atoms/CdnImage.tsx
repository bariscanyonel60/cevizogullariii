"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cloudinarySizedUrl, mediaUrl, widthFromSizes } from "@/lib/media";

function isHttpUrl(value: string) {
  return value.startsWith("https://") || value.startsWith("http://");
}

/**
 * İlk boya her zaman `mediaUrl` (f_auto,q_auto) — sunucu ve istemci birebir aynı.
 * w_ / q_auto:eco yalnızca hydrate sonrası; Turbopack stale client hydration
 * hatasını önler (önceki prod deneyimi).
 */
export function CdnImage({
  src,
  unoptimized,
  onError,
  sizes,
  ...props
}: ImageProps) {
  const localSrc = typeof src === "string" && !isHttpUrl(src) ? src : null;
  const resolved = typeof src === "string" ? mediaUrl(src) : src;
  const [current, setCurrent] = useState(resolved);
  const [sized, setSized] = useState(false);
  const remote = typeof current === "string" && isHttpUrl(current);

  useEffect(() => {
    setSized(true);
  }, []);

  useEffect(() => {
    setCurrent(typeof src === "string" ? mediaUrl(src) : src);
  }, [src]);

  const displaySrc =
    remote && sized && typeof current === "string"
      ? cloudinarySizedUrl(current, widthFromSizes(sizes))
      : current;

  return (
    <Image
      src={displaySrc}
      sizes={sizes}
      unoptimized={unoptimized ?? remote}
      onError={(event) => {
        if (localSrc && current !== localSrc) {
          setCurrent(localSrc);
        }
        onError?.(event);
      }}
      {...props}
      suppressHydrationWarning
    />
  );
}
