import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { getFeaturedProjects } from "@/data/projects";

export function FeaturedProjects() {
  const items = getFeaturedProjects();

  return (
    <section
      id="gayrimenkul"
      className="container-wide scroll-mt-28 py-20 md:py-28"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Gayrimenkul"
          title="İmzamızı taşıyan işler"
          description="Modern konut, dış cephe, şantiye ve tadilat uygulamalarından seçilmiş örnekler."
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
