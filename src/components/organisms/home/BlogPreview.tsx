import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { BlogCard } from "@/components/molecules/BlogCard";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import type { BlogPost } from "@/types";

export function BlogPreview({ posts = [] }: { posts?: BlogPost[] }) {
  return (
    <section id="blog" className="container-wide scroll-mt-28 py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Rehber"
          title="Tokat’ta malzeme seçerken işe yarayan yazılar"
          description="Teslimat, mantolama, boya ve şantiye listesi — mağaza pratiğinden notlar."
          action={
            <Button asChild variant="secondary">
              <Link href="/blog">Tüm Yazılar</Link>
            </Button>
          }
        />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post, index) => (
          <Reveal key={post.id} delay={index * 0.08}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
