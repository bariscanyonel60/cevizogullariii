import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { BlogCard } from "@/components/molecules/BlogCard";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { blogPosts } from "@/data/blog";

export function BlogPreview() {
  return (
    <section id="blog" className="container-wide scroll-mt-28 py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Blog"
          title="Sektörden içgörüler"
          description="Gayrimenkul ve yapı dünyasından güncel içerikler."
          action={
            <Button asChild variant="secondary">
              <Link href="/blog">Tüm Yazılar</Link>
            </Button>
          }
        />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <Reveal key={post.id} delay={index * 0.08}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
