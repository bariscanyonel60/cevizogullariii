"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cloudinarySizedUrl, mediaUrl } from "@/lib/media";

function isHttpUrl(value: string) {
  return value.startsWith("https://") || value.startsWith("http://");
}

function widthFromSizes(sizes?: string): number {
  if (!sizes) return 960;
  const px = sizes.match(/(\d+)px/u);
  if (px) return Math.min(1600, Number(px[1]) * 2);
  if (sizes.includes("33vw") || sizes.includes("32vw")) return 800;
  if (sizes.includes("50vw")) return 960;
  if (sizes.includes("100vw")) return 1200;
  return 960;
}

/**
 * İlk boya her zaman `mediaUrl` (f_auto,q_auto). w_ ancak hydrate sonrası.
 * Aksi halde Turbopack stale client ham URL, sunucu w_420 bekler ve Navbar
 * hydration hatası gibi görünür.
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
