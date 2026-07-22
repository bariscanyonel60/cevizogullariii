import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

export function AboutPreview() {
  return (
    <section id="kurumsal" className="container-wide scroll-mt-28 py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/projects/modern-konut-cephe.jpg"
                alt="Cevizoğulları modern konut ve dış cephe uygulaması"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 max-w-xs rounded-3xl glass p-5 shadow-premium md:-right-8">
              <p className="font-display text-3xl font-bold text-forest-800">
                Turhal
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Tokat’ta güvenin ve kalitenin adresi
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <SectionHeading
            eyebrow="Kurumsal"
            title="Turhal’dan Tokat’a güvenilir yapı market"
            description="Cevizoğulları olarak orman ürünleri, çatı ve ısı yalıtım malzemeleri ile inşaat sektörünün temel yapı taşlarını tek çatı altında sunuyoruz."
            className="mb-6"
          />
          <ul className="space-y-4 text-ink-500">
            {[
              "Kaliteli ürün · uygun fiyat · hızlı tedarik",
              "Bireysel müşteri, usta ve profesyonel projelere hizmet",
              "Orman ürünleri, yalıtım ve inşaat malzemelerinde geniş yelpaze",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8">
            <Link href="/kurumsal">Hakkımızda</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
