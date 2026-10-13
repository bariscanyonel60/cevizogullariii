"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "li";
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  as = "div",
}: RevealProps) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { rootMargin: "-10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, once]);

  const props = {
    ref: setNode,
    className: cn("reveal", className),
    "data-shown": shown ? "" : undefined,
    style: {
      "--reveal-y": `${y}px`,
      "--reveal-delay": `${delay}s`,
    } as CSSProperties,
  };

  if (as === "li") {
    return <li {...props}>{children}</li>;
  }

  return <div {...props}>{children}</div>;
}
