import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { BlogCard } from "@/components/molecules/BlogCard";
import { blogPosts } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog · Tokat Yapı & Gayrimenkul Rehberi",
  description:
    "Tokat ve Turhal’da yapı malzemeleri, mantolama, kereste ve gayrimenkul üzerine SEO uyumlu rehber içerikler — Cevizoğulları Blog.",
  path: "/blog",
  keywords: [
    "Tokat yapı blog",
    "Turhal mantolama rehberi",
    "Tokat gayrimenkul yatırım",
  ],
});

export default function BlogPage() {
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  return (
    <>
      <PageHero
        title="Blog"
        description="Sektörden içgörüler, rehberler ve trend analizleri."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog" },
        ]}
      />
      <section className="container-wide py-12 md:py-16">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-forest-800/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-forest-800"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-ink-500">
          Daha fazla içerik için{" "}
          <Link
            href="/iletisim"
            className="font-semibold text-forest-800 underline"
          >
            bize yazın
          </Link>
          .
        </p>
      </section>
    </>
  );
}
