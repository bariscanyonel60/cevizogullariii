import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-xl border border-earth-400/20 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm transition placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
