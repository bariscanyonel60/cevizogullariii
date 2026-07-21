import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ImageGallery } from "@/components/organisms/shared/ImageGallery";
import { BeforeAfter } from "@/components/organisms/shared/BeforeAfter";
import { InstagramCta } from "@/components/organisms/shared/InstagramCta";
import { Button } from "@/components/atoms/Button";
import { getProjectBySlug, projects } from "@/data/projects";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projelerimiz/${project.slug}`,
    image: project.images[0],
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Yapı-İnşaat", path: "/projelerimiz" },
    { name: project.title, path: `/projelerimiz/${project.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title={project.title}
        description={`${project.location} · ${project.year}`}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yapı-İnşaat", href: "/projelerimiz" },
          { label: project.title },
        ]}
      />
      <section className="container-wide space-y-12 py-12 md:py-16">
        <ImageGallery images={project.images} alt={project.title} />
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold">Proje Özeti</h2>
          <p className="mt-4 leading-relaxed text-ink-500">{project.description}</p>
          {(project.instagramUrl || SITE.social.instagram) && (
            <Button asChild className="mt-6" variant="secondary">
              <Link
                href={project.instagramUrl ?? SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram’da Gör ({SITE.social.instagramHandle})
              </Link>
            </Button>
          )}
        </div>
        {project.beforeImage && project.afterImage && (
          <div>
            <h2 className="mb-6 font-display text-2xl font-bold">
              Öncesi / Sonrası
            </h2>
            <BeforeAfter
              before={project.beforeImage}
              after={project.afterImage}
              title={project.title}
            />
          </div>
        )}
        <InstagramCta compact />
      </section>
    </>
  );
}
