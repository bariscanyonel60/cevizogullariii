import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { CdnImage } from "@/components/atoms/CdnImage";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { SITE } from "@/lib/constants";
import type { Project } from "@/types";

const HOME_PROJECT_LIMIT = 6;

export function FeaturedProjects({ projects = [] }: { projects?: Project[] }) {
  const items = projects.slice(0, HOME_PROJECT_LIMIT);
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const instagramThumbs = items
    .map((project) => ({
      src: project.images[0],
      alt: `${project.title} — ${project.location}`,
      href: project.instagramUrl || SITE.social.instagram,
    }))
    .filter((item) => Boolean(item.src));

  return (
    <section
      id="yapi-insaat"
      className="container-wide scroll-mt-28 py-20 md:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Yapı - İnşaat"
          title="Turhal’da biten işler"
          description="Ova Apt. 3 teslim. Diğer kareler sahadan."
          action={
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/projelerimiz">Tüm Projeler</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/yapi-insaat">Yapı - İnşaat</Link>
              </Button>
            </div>
          }
        />
      </Reveal>
      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <ProjectCard
            project={featured}
            tall
            priority
            className="h-full min-h-88 lg:min-h-full"
          />
        </Reveal>
        {rest.map((project, index) => (
          <Reveal key={project.id} delay={Math.min(index + 1, 5) * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {instagramThumbs.length > 0 ? (
        <Reveal delay={0.12}>
          <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                  Instagram
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink-900">
                  Instagram’da şantiye
                </p>
              </div>
              <Link
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-forest-800 transition hover:text-forest-900"
              >
                {SITE.social.instagramHandle}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {instagramThumbs.map((thumb) => (
                <Link
                  key={thumb.src}
                  href={thumb.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-xl bg-mist-100"
                  aria-label={`${thumb.alt} — Instagram`}
                >
                  <CdnImage
                    src={thumb.src}
                    alt={thumb.alt}
                    fill
                    sizes="(max-width: 640px) 33vw, 16vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}
