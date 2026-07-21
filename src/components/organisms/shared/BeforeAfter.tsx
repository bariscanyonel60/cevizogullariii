"use client";

import Image from "next/image";
import { useState } from "react";

export function BeforeAfter({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl select-none">
      <Image src={after} alt={`${title} sonrası`} fill className="object-cover" sizes="100vw" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <div className="relative h-full w-[100vw] max-w-none md:w-[80rem]">
          <Image
            src={before}
            alt={`${title} öncesi`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-4 bottom-4 z-10"
        aria-label="Öncesi sonrası karşılaştırma"
      />
      <span className="absolute left-4 top-4 rounded-full bg-ink-950/60 px-3 py-1 text-xs font-semibold text-white">
        Önce
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-ink-950/60 px-3 py-1 text-xs font-semibold text-white">
        Sonra
      </span>
    </div>
  );
}
