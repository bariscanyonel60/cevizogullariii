"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
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
  const reduce = useReducedMotion();
  // SSR'da null gelebilir; hydrate uyumu için hareketi sadece kesin true iken kapat.
  const noMotion = reduce === true;

  const motionProps = {
    className: cn(className),
    initial: noMotion ? false : { opacity: 0, y },
    whileInView: noMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once, margin: "-10% 0px" as const },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
  };

  if (as === "li") {
    return <motion.li {...motionProps}>{children}</motion.li>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}
