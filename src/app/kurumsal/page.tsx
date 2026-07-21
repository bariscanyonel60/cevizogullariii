import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { Reveal } from "@/components/molecules/Reveal";
import { audienceSegments } from "@/data/content";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda",
  description: `${SITE.name} hakkında: Turhal / Tokat’ta orman ürünleri, yalıtım ve inşaat malzemeleri tedariki.`,
  path: "/kurumsal",
});

export default function CorporatePage() {
  return (
    <>
      <PageHero
        title="Hakkımızda"
        description="Turhal’da yılların tecrübesiyle yapı malzemeleri ve inşaat tedarikinde güvenilir çözüm ortağınız."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hakkımızda" },
        ]}
      />

      <section className="container-wide py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/about-project.jpg"
                alt="Cevizoğulları yapı market"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Hakkımızda
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 md:text-4xl">
              Güvenin ve kalitenin adresi
            </h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              Cevizoğulları olarak; orman ürünleri, çatı ve ısı yalıtım
              malzemeleri ile inşaat sektörünün temel yapı taşlarını tek çatı
              altında sunuyoruz. Yılların verdiği tecrübe ve sektör bilgisiyle,
              hem bireysel müşterilerimize hem de profesyonel ustalarımıza
              güvenilir çözümler sağlıyoruz.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              Turhal / Tokat’ta hizmet veren {SITE.shortName}, kaliteli ürün –
              uygun fiyat – hızlı tedarik prensibiyle çalışır. Projelerinizde
              sağlam bir temel atmak için doğru adrestesiniz.
            </p>
            <p className="mt-4 text-sm text-ink-400">{SITE.address}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {audienceSegments.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-premium">
                <h3 className="font-display text-xl font-semibold text-forest-800">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {item.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm text-ink-600"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Vizyon",
              text: "Bölgede yapı malzemeleri tedarikinde güven ve kalite standardı olmak.",
            },
            {
              title: "Misyon",
              text: "Doğru ürün, uygun fiyat ve hızlı tedarikle projelerinize sağlam temel sunmak.",
            },
            {
              title: "Değerler",
              text: "Güven, kalite, müşteri memnuniyeti ve zamanında teslimat.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="h-full rounded-3xl border border-earth-400/10 bg-forest-50/50 p-7">
                <h3 className="font-display text-xl font-semibold text-forest-800">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
