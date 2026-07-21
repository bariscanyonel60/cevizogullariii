import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold tracking-wide text-forest-800",
        className,
      )}
      {...props}
    />
  );
}
