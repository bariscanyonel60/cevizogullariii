import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Bath, Maximize2, MapPin } from "lucide-react";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

const statusLabel: Record<Property["status"], string> = {
  satilik: "Satılık",
  kiralik: "Kiralık",
  rezerve: "Rezerve",
};

type PropertyCardProps = {
  property: Property;
  className?: string;
};

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl bg-white shadow-premium transition duration-500 hover:-translate-y-1 hover:shadow-premium-hover",
        className,
      )}
    >
      <Link href={`/gayrimenkul/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={`${property.title} ${property.status === "kiralik" ? "kiralık" : "satılık"} — ${property.district}, ${property.city}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
          <Badge className="absolute left-4 top-4 bg-white/90 text-forest-800 backdrop-blur-sm">
            {statusLabel[property.status]}
          </Badge>
          <p className="absolute bottom-4 left-4 font-display text-xl font-bold text-white">
            {formatPrice(property.price)}
            {property.status === "kiralik" && (
              <span className="text-sm font-medium text-white/80"> / ay</span>
            )}
          </p>
        </div>
        <div className="space-y-4 p-5 md:p-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink-900 transition group-hover:text-forest-700">
              {property.title}
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
              <MapPin className="size-4 text-gold-500" aria-hidden />
              {property.district}, {property.city}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-earth-400/10 pt-4 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="size-4" aria-hidden />
              {property.area} m²
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bath className="size-4" aria-hidden />
              {property.rooms}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-forest-800">
              Detay
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
