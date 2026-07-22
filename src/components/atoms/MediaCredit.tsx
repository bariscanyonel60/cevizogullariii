import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MediaCreditProps = {
  className?: string;
  /** Koyu zemin (footer) için daha parlak ton */
  inverted?: boolean;
  /** Navbar’da daha kompakt görünüm */
  compact?: boolean;
};

export function MediaCredit({
  className,
  inverted = false,
  compact = false,
}: MediaCreditProps) {
  return (
    <a
      href={SITE.media.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1.5 font-semibold tracking-wide transition",
        compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm",
        inverted
          ? "text-orange-300 hover:text-orange-200"
          : "text-orange-600 hover:text-orange-500",
        className,
      )}
      aria-label={`${SITE.media.label}: ${SITE.media.name} — ${SITE.media.url}`}
    >
      <span
        className={cn(
          "uppercase tracking-[0.14em]",
          inverted ? "text-orange-400/90" : "text-orange-500",
        )}
      >
        {SITE.media.label}
      </span>
      <span className={inverted ? "text-orange-200/50" : "text-orange-400/70"}>
        :
      </span>
      <span className="underline decoration-orange-400/50 underline-offset-2 transition group-hover:decoration-orange-300">
        {SITE.media.name}
      </span>
    </a>
  );
}
