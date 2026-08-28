import Link from "next/link";
import { CdnImage } from "@/components/atoms/CdnImage";
import type { BlogPost } from "@/types";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl bg-white shadow-premium transition duration-500 hover:-translate-y-1 hover:shadow-premium-hover",
        className,
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <CdnImage
            src={post.coverImage}
            alt={`${post.title} — Cevizoğulları Blog | Tokat yapı market`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-5 md:p-6">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-gold-600">
            <span>{post.category}</span>
            <span className="text-ink-400">·</span>
            <span className="normal-case tracking-normal text-ink-400">
              {post.readingTime} dk okuma
            </span>
          </div>
          <h3 className="font-display text-xl font-semibold text-ink-900 group-hover:text-forest-700">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
