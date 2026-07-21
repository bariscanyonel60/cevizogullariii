import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Link2 } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { BlogCard } from "@/components/molecules/BlogCard";
import { Badge } from "@/components/atoms/Badge";
import {
  FacebookIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/atoms/SocialIcons";
import {
  blogPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/data/blog";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
  });
}

function extractToc(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", "").trim());
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const toc = extractToc(post.content);
  const shareUrl = `${SITE.url}/blog/${post.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage,
      datePublished: post.publishedAt,
      author: { "@type": "Person", name: post.author },
    },
    breadcrumbJsonLd([
      { name: "Ana Sayfa", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title={post.title}
        description={post.excerpt}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="container-wide grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-ink-400">
            <Badge>{post.category}</Badge>
            <span>{post.publishedAt}</span>
            <span>·</span>
            <span>{post.readingTime} dk okuma</span>
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <div className="prose-custom space-y-4 text-ink-700">
            {post.content.split("\n").map((line, index) => {
              if (line.startsWith("## ")) {
                const text = line.replace("## ", "");
                return (
                  <h2
                    key={index}
                    id={text.toLowerCase().replace(/\s+/g, "-")}
                    className="pt-4 font-display text-2xl font-bold text-ink-900"
                  >
                    {text}
                  </h2>
                );
              }
              if (!line.trim()) return null;
              return (
                <p key={index} className="leading-relaxed text-ink-500">
                  {line}
                </p>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} className="bg-mist-100 text-ink-600">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white p-5 shadow-premium">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold-600">
              İçindekiler
            </h2>
            <ul className="mt-4 space-y-2">
              {toc.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-ink-600 transition hover:text-forest-700"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-premium">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold-600">
              Paylaş
            </h2>
            <div className="mt-4 flex gap-2">
              {[
                {
                  href: `https://twitter.com/intent/tweet?url=${shareUrl}`,
                  icon: XIcon,
                  label: "X",
                },
                {
                  href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  icon: FacebookIcon,
                  label: "Facebook",
                },
                {
                  href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                  icon: LinkedinIcon,
                  label: "LinkedIn",
                },
                { href: shareUrl, icon: Link2, label: "Link" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-800 transition hover:bg-forest-800 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </article>

      {related.length > 0 && (
        <section className="container-wide pb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">İlgili Yazılar</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <BlogCard key={item.id} post={item} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/blog" className="text-sm font-semibold text-forest-800">
              Tüm yazılara dön →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
