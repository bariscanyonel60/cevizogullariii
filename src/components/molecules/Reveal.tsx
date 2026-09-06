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
  const Tag = as === "li" ? "li" : "div";

  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  const motionProps = {
    className: cn(className),
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once, margin: "-10% 0px" as const },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
  };

  if (as === "li") {
    return <motion.li {...motionProps}>{children}</motion.li>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}
