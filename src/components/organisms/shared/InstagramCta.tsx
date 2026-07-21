import Link from "next/link";
import { InstagramIcon } from "@/components/atoms/SocialIcons";
import { Button } from "@/components/atoms/Button";
import { SITE } from "@/lib/constants";

export function InstagramCta({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <aside
      className={
        compact
          ? "rounded-3xl border border-earth-400/10 bg-white p-6 shadow-premium"
          : "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-900 via-forest-800 to-earth-700 px-6 py-10 text-white md:px-10 md:py-12"
      }
    >
      {!compact && (
        <div className="pointer-events-none absolute -right-10 top-0 size-56 rounded-full bg-gold-400/20 blur-3xl" />
      )}
      <div className={`relative flex flex-col gap-5 ${compact ? "" : "md:flex-row md:items-center md:justify-between"}`}>
        <div className="flex items-start gap-4">
          <span
            className={
              compact
                ? "grid size-12 place-items-center rounded-2xl bg-forest-800 text-gold-300"
                : "grid size-14 place-items-center rounded-2xl bg-white/10 text-gold-300"
            }
          >
            <InstagramIcon className="size-6" />
          </span>
          <div>
            <p
              className={
                compact
                  ? "text-xs font-semibold uppercase tracking-[0.18em] text-gold-600"
                  : "text-xs font-semibold uppercase tracking-[0.18em] text-gold-300"
              }
            >
              Instagram
            </p>
            <h2
              className={
                compact
                  ? "mt-1 font-display text-lg font-bold text-ink-900"
                  : "mt-2 font-display text-2xl font-bold md:text-3xl"
              }
            >
              {SITE.social.instagramHandle} üzerinde örnek projeler
            </h2>
            <p
              className={
                compact
                  ? "mt-2 text-sm text-ink-500"
                  : "mt-2 max-w-xl text-sm text-white/70 md:text-base"
              }
            >
              Güncel saha ve uygulama fotoğraflarımızı Instagram’dan takip edin.
              Beğendiğiniz işler için bize yazın.
            </p>
          </div>
        </div>
        <Button asChild variant={compact ? "primary" : "gold"} size="lg">
          <Link
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram’ı Aç
          </Link>
        </Button>
      </div>
    </aside>
  );
}
