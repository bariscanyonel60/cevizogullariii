import type { Metadata } from "next";
import { CdnImage } from "@/components/atoms/CdnImage";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { Reveal } from "@/components/molecules/Reveal";
import { getSiteCards } from "@/lib/cms-store";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda · Turhal Pazar Mahallesi Yapı Market",
  description:
    "Pazar Mahallesi’nde yapı market, orman ürünleri ve inşaat tedariki. Cevizoğulları — stok, usta yönlendirmesi, şantiye teslimatı.",
  path: "/kurumsal",
  keywords: [
    "Cevizoğulları hakkında",
    "Turhal yapı market",
    "Tokat inşaat firması",
  ],
});

export const revalidate = 60;

export default async function CorporatePage() {
  const audienceSegments = await getSiteCards("audience");
  return (
    <>
      <PageHero
        title="Hakkımızda"
        description="Turhal’da reyonu olan bir yapı marketiz: boya, yalıtım, kereste ve inşaat malzemesi. Aynı çatı altında uygulama da yaparız."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hakkımızda" },
        ]}
      />

      <section className="container-wide py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-premium">
              <CdnImage
                src="/projects/modern-konut-bahce.jpg"
                alt="Cevizoğulları Turhal Tokat yapı market ve proje alanı"
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
              Turhal’dan Tokat şantiyesine malzeme
            </h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              Cevizoğulları, Pazar Mahallesi Yeşilırmak Sokak’taki yapı
              marketinden boya, mantolama, çimento, çatı, OSB ve kereste satar.
              Usta ve müteahhit günlük listeyle gelir; ev sahibi tadilat için
              renk ve kalınlık sorar. Biz raftan toplar, sayar, isterse kendi
              aracımızla götürürüz.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              Üç işi ayırmadan yürüyoruz: yapı market reyonu, orman ürünleri
              (OSB, plywood, çam-kavak) ve yapı-inşaat uygulaması. Böylece
              “malzemeyi aldım, usta yok” veya “ustam var, palet yarın gelir”
              kopukluğu azalır. Tokat merkez, Zile, Erbaa, Niksar ve Pazar’daki
              işlerde aynı tedarik mantığı geçerlidir.
            </p>
            <p className="mt-4 text-sm text-ink-400">
              {SITE.address} · {SITE.hours}
            </p>
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
                  {item.points?.map((point) => (
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
              title: "Ne yapmak isteriz",
              text: "Tokat’ta yapı malzemesi arayanın Turhal’da duracağı net bir reyon olmak: stok doğru, yönlendirme açık, teslim sözünde.",
            },
            {
              title: "Nasıl çalışırız",
              text: "Listeyi dinler, raftan çıkarır, eksik kalemi söyleriz. Toplu yükte palet hazırlar; talep olunca kendi aracımızla götürürüz.",
            },
            {
              title: "Nelere dikkat ederiz",
              text: "Yanlış EPS, eksik dübel, ıslak kereste sahayı durdurur. Ürünü işe göre seçer, sayarak teslim ederiz.",
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
