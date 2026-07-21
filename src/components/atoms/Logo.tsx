import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
  /** Footer gibi koyu zeminlerde metin rengini açmak için */
  inverted?: boolean;
};

export function Logo({ className, compact = false, inverted = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 rounded-lg",
        className,
      )}
      aria-label="Cevizoğulları ana sayfa"
    >
      <span
        className={cn(
          "relative overflow-hidden bg-transparent",
          compact ? "h-9 w-[7.5rem]" : "h-11 w-[9.5rem] md:h-12 md:w-44",
        )}
      >
        <Image
          src="/logo.png"
          alt="Cevizoğulları Yapı Market & İnşaat"
          fill
          sizes="180px"
          className="object-contain object-left"
          priority
        />
      </span>
      {!compact && (
        <span className="hidden flex-col leading-none sm:flex">
          <span
            className={cn(
              "font-display text-sm font-bold md:text-base",
              inverted ? "text-white" : "text-forest-900",
            )}
          >
            Cevizoğulları
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-medium tracking-[0.12em] uppercase",
              inverted ? "text-gold-300/80" : "text-earth-400",
            )}
          >
            Yapı Market & İnşaat
          </span>
        </span>
      )}
    </Link>
  );
}
