import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/atoms/Badge";
import { PRODUCT_CATEGORY_LABELS, USE_CASE_LABELS } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl bg-white shadow-premium transition duration-500 hover:-translate-y-1 hover:shadow-premium-hover",
        className,
      )}
    >
      <Link href={`/yapi-malzemeleri/${product.slug}`} className="block">
        <div className="relative aspect-[5/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          {product.useCases.includes("dis-cephe") && (
            <span className="absolute left-3 top-3 rounded-full bg-forest-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-300">
              Dış cephe
            </span>
          )}
        </div>
        <div className="space-y-3 p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{product.brand}</Badge>
            <Badge className="bg-mist-100 text-ink-600">
              {PRODUCT_CATEGORY_LABELS[product.category]}
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-900 group-hover:text-forest-700">
            {product.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.useCases.map((u) => (
              <span
                key={u}
                className="rounded-full bg-forest-50 px-2 py-0.5 text-[11px] font-medium text-forest-800"
              >
                {USE_CASE_LABELS[u]}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 text-sm">
            <span className="text-ink-400">{product.unit}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-forest-800">
              İncele
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
