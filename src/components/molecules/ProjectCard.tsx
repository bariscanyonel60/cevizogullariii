import Link from "next/link";
import { CdnImage } from "@/components/atoms/CdnImage";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
  tall?: boolean;
};

export function ProjectCard({ project, className, tall }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl shadow-premium",
        tall ? "min-h-[28rem]" : "min-h-[22rem]",
        className,
      )}
    >
      <Link href={`/projelerimiz/${project.slug}`} className="absolute inset-0">
        <CdnImage
          src={project.images[0]}
          alt={`${project.title} — ${project.location} proje görseli`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
            {project.location} · {project.year}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/75">
            {project.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
