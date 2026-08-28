import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import type { Project } from "@/types";

export function FeaturedProjects({ projects = [] }: { projects?: Project[] }) {
  const items = projects;

  return (
    <section
      id="yapi-insaat"
      className="container-wide scroll-mt-28 py-20 md:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Yapı - İnşaat"
          title="Tokat ve Turhal’daki işlerden örnekler"
          description="Konut cephesi, mantolama, çatı ve şantiye tedariki — sahada kullandığımız malzeme ve uygulamalar."
          action={
            <Button asChild variant="secondary">
              <Link href="/projelerimiz">Tüm Projeler</Link>
            </Button>
          }
        />
      </Reveal>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.08}>
            <ProjectCard project={project} tall={index === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
