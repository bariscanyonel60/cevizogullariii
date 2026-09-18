import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import type { Product } from "@/types";

export function FeaturedProducts({ products = [] }: { products?: Product[] }) {
  const items = products.slice(0, 3);

  return (
    <section
      id="urunler"
      className="scroll-mt-28 bg-gradient-to-b from-mist-100/80 to-transparent py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Yapı Market"
            title="Turhal yapı malzemeleri stokta"
            description="Boya, mantolama, yalıtım. Tokat yapı malzemeleri listesini Turhal’daki raftan topluyoruz."
            action={
              <Button asChild variant="secondary">
                <Link href="/yapi-malzemeleri#urunler">Yapı Market</Link>
              </Button>
            }
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
