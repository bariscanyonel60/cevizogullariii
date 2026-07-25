import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { getFeaturedProducts } from "@/data/products";

export function FeaturedProducts() {
  const products = getFeaturedProducts().slice(0, 3);

  return (
    <section
      id="urunler"
      className="scroll-mt-28 bg-gradient-to-b from-mist-100/80 to-transparent py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Yapı Market"
            title="Tokat’ta kaliteli yapı malzemeleri"
            description="Permolit boya, mantolama, yalıtım ve dış cephe malzemelerinde Turhal stoklu çözümler."
            action={
              <Button asChild variant="secondary">
                <Link href="/yapi-malzemeleri#urunler">Yapı Market</Link>
              </Button>
            }
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
