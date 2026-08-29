import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ProjectGrid } from "@/components/organisms/shared/ProjectGrid";
import { InstagramCta } from "@/components/organisms/shared/InstagramCta";
import { JsonLd } from "@/components/atoms/JsonLd";
import { getProjects } from "@/lib/cms-store";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projelerimiz · Turhal Dış Cephe ve Şantiye",
  description:
    "Turhal ve Tokat’ta tamamlanan dış cephe, şantiye ve tadilat örnekleri. Güncel işler Instagram’da: @cevizogullari.",
  path: "/projelerimiz",
  keywords: [
    "Tokat dış cephe projeleri",
    "Turhal inşaat uygulamaları",
    "Cevizoğulları projeler",
    "Tokat mantolama örnekleri",
  ],
});

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Projeler", path: "/projelerimiz" },
          ]),
          itemListJsonLd({
            path: "/projelerimiz",
            name: "Cevizoğulları projeleri",
            items: projects.map((p) => ({
              name: p.title,
              path: `/projelerimiz/${p.slug}`,
            })),
          }),
        ]}
      />
      <PageHero
        title="Projelerimiz"
        description="Saha uygulamalarımızdan örnekler — Tokat / Turhal. Daha fazlası için Instagram’ı ziyaret edin."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Projeler" },
        ]}
      />
      <section className="container-wide space-y-12 py-12 md:py-16">
        <InstagramCta />
        <ProjectGrid items={projects} />
      </section>
    </>
  );
}
