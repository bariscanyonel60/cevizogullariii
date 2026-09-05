import Link from "next/link";
import { CdnImage } from "@/components/atoms/CdnImage";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import type { MediaItem } from "@/lib/media-types";
import { cn } from "@/lib/utils";

type ProjectWallSectionProps = {
  items: MediaItem[];
};

export function ProjectWallSection({ items }: ProjectWallSectionProps) {
  if (items.length === 0) return null;

  const featured = items[0];
  const rest = items.slice(1);
  const wide = items.length >= 3;

  return (
    <section
      id="sahadan-kareler"
      className="container-wide scroll-mt-28 py-20 md:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Sahadan"
          title="Sahadan kareler"
          description="Şantiye, dış cephe ve yapı market kareleri — galerinin tamamı bir tık ötede."
          action={
            <Button asChild variant="secondary">
              <Link href="/galeri">Tüm galeri</Link>
            </Button>
          }
        />
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          className={wide ? "h-full sm:col-span-2 lg:row-span-2" : "h-full"}
        >
          <WallTile item={featured} featured={wide} />
        </Reveal>
        {rest.map((item, index) => (
          <Reveal
            key={item.id}
            delay={Math.min(index + 1, 5) * 0.05}
            className="h-full"
          >
            <WallTile item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function WallTile({
  item,
  featured = false,
}: {
  item: MediaItem;
  featured?: boolean;
}) {
  const caption = item.title || item.alt;

  return (
    <Link
      href="/galeri"
      className={cn(
        "group relative block h-full overflow-hidden rounded-2xl bg-mist-100 focus-visible:outline-none",
        featured ? "min-h-88 sm:min-h-104" : "min-h-64",
      )}
      aria-label={`${caption} — galeriyi aç`}
    >
      <CdnImage
        src={item.url}
        alt={item.alt}
        fill
        sizes={
          featured
            ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-forest-950/70 via-forest-950/10 to-transparent opacity-80 transition group-hover:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 p-4 font-display text-sm font-semibold text-white sm:text-base">
        {caption}
      </span>
    </Link>
  );
}
