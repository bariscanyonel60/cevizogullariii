"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";
import { useState } from "react";
import { cloudinarySizedUrl, mediaUrl } from "@/lib/media";

function isCloudinaryUrl(value: string) {
  return value.startsWith("https://res.cloudinary.com/");
}

const cloudinaryLoader: ImageLoader = ({ src, width }) =>
  cloudinarySizedUrl(src, width);

/**
 * Cloudinary görselleri srcset ile istenir: sunucu ve istemci aynı URL'yi
 * üretir, tarayıcı ekran genişliğine uygun boyutu tek seferde indirir.
 */
export function CdnImage({ src, alt, unoptimized, onError, ...props }: ImageProps) {
  const localSrc = typeof src === "string" && !src.startsWith("http") ? src : null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = localSrc !== null && failedSrc === localSrc;
  const resolved = typeof src === "string" ? mediaUrl(src) : src;
  const current = failed && localSrc ? localSrc : resolved;
  const cloudinary = typeof current === "string" && isCloudinaryUrl(current);
  const remote = typeof current === "string" && current.startsWith("http");

  return (
    <Image
      src={current}
      alt={alt}
      loader={cloudinary ? cloudinaryLoader : undefined}
      unoptimized={cloudinary ? false : (unoptimized ?? remote)}
      onError={(event) => {
        if (localSrc && !failed) setFailedSrc(localSrc);
        onError?.(event);
      }}
      {...props}
    />
  );
}
