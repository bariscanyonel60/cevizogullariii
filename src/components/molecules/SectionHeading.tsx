import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14 flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
          {eyebrow}
        </p>
      )}
      <div
        className={cn(
          "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
          align === "center" && "md:flex-col md:items-center",
        )}
      >
        <div className={cn(align === "center" && "max-w-2xl")}>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 md:text-4xl lg:text-[2.75rem] text-balance">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
