import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ImageGallery } from "@/components/organisms/shared/ImageGallery";
import { BeforeAfter } from "@/components/organisms/shared/BeforeAfter";
import { InstagramCta } from "@/components/organisms/shared/InstagramCta";
import { Button } from "@/components/atoms/Button";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { getProjectBySlug, getProjects } from "@/lib/cms-store";
import { SITE } from "@/lib/constants";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  projectJsonLd,
  projectSeoDescription,
  projectSeoTitle,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return buildMetadata({
      title: "Proje bulunamadı",
      description: "Aradığınız proje bulunamadı.",
      path: "/projelerimiz",
      noIndex: true,
    });
  }
    return buildMetadata({
      title: projectSeoTitle(project),
      description: projectSeoDescription(project),
    path: `/projelerimiz/${project.slug}`,
    image: project.images[0],
    keywords: [
      project.title,
      project.location,
      "Tokat dış cephe",
      "Turhal inşaat projesi",
      "Cevizoğulları projeler",
    ],
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);
  if (!project) notFound();

  const otherProjects = allProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  const schemas = [
    projectJsonLd(project),
    breadcrumbJsonLd([
      { name: "Ana Sayfa", path: "/" },
      { name: "Projeler", path: "/projelerimiz" },
      { name: project.title, path: `/projelerimiz/${project.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        title={project.title}
        description={`${project.location} · ${project.year} · Tokat / Turhal proje`}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Projeler", href: "/projelerimiz" },
          { label: project.title },
        ]}
      />
      <section className="container-wide space-y-12 py-12 md:py-16">
        <ImageGallery
          images={project.images}
          alt={`${project.title} — ${project.location}`}
        />
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
        <div className="flex flex-col gap-4 rounded-3xl bg-forest-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Benzer bir proje mi planlıyorsunuz?
            </h2>
            <p className="mt-1 text-sm text-white/65">
              Malzeme listesi ve uygulama için ücretsiz teklif alın.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/yapi-insaat">Yapı-İnşaat Hizmetleri</Link>
            </Button>
          </div>
        </div>
        {otherProjects.length > 0 && (
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold">Diğer projeler</h2>
              <Link
                href="/projelerimiz"
                className="text-sm font-semibold text-forest-800 hover:underline"
              >
                Tüm projeler
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </div>
        )}
        <InstagramCta compact />
      </section>
    </>
  );
}
