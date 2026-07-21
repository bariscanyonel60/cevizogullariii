import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { BlogCard } from "@/components/molecules/BlogCard";
import { blogPosts } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Gayrimenkul, yapı malzemeleri ve tasarım üzerine SEO uyumlu içerikler.",
  path: "/blog",
});

export default function BlogPage() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
