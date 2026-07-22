import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ProjectGrid } from "@/components/organisms/shared/ProjectGrid";
import { InstagramCta } from "@/components/organisms/shared/InstagramCta";
import { projects } from "@/data/projects";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gayrimenkul",
  description: `Tamamladığımız dış cephe, şantiye ve tadilat örnekleri. Güncel işler: ${SITE.social.instagramHandle}`,
  path: "/projelerimiz",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="Gayrimenkul"
        description="Saha uygulamalarımızdan örnekler. Daha fazlası için Instagram’ı ziyaret edin."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Gayrimenkul" },
        ]}
      />
      <section className="container-wide space-y-12 py-12 md:py-16">
        <InstagramCta />
        <ProjectGrid items={projects} />
      </section>
    </>
  );
}
