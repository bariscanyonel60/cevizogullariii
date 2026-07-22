import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Layers,
  PaintBucket,
  Home,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { SITE } from "@/lib/constants";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const TOCAT_KEYWORDS = [
  "Tokat yapı malzemeleri",
  "Turhal yapı market",
  "Tokat mantolama",
  "Turhal mantolama",
  "Tokat dış cephe boyası",
  "Tokat ısı yalıtım",
  "Tokat strafor",
  "Tokat EPS XPS",
  "Tokat inşaat malzemesi",
  "Erbaa Niksar Zile yapı malzemeleri",
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Tokat Yapı Malzemeleri · Turhal Mantolama & Boya",
  description:
    "Tokat yapı malzemeleri, Turhal mantolama, dış cephe boyası, ısı yalıtımı ve strafor (EPS/XPS) tedariki. Cevizoğulları Yapı Market — stoklu ürün, doğru yönlendirme, depreme uygun malzeme seçimi.",
  path: "/tokat",
  keywords: [...TOCAT_KEYWORDS],
});

/** İnsanların Google’da aradığı niyetlere göre konu başlıkları */
const searchTopics = [
  {
    icon: Layers,
    query: "Tokat mantolama",
    title: "Tokat & Turhal mantolama malzemeleri",
    text: "EPS, XPS, file, dübel, yapıştırıcı ve cephe sıvası… Mantolama setini eksiksiz stoklarız. Enerji faturasını düşüren, uzun ömürlü dış cephe yalıtımı için doğru ürünü birlikte seçeriz.",
    href: "/yapi-malzemeleri",
  },
  {
    icon: PaintBucket,
    query: "Tokat dış cephe boyası",
    title: "Dış cephe boyası & astar",
    text: "Permolit, Filli Boya ve Marshall dış cephe boyaları; astar ve dekoratif kaplamalar. Tokat iklimine uygun, UV ve yağmura dayanıklı boya sistemleri.",
    href: "/yapi-malzemeleri",
  },
  {
    icon: Flame,
    query: "Tokat ısı yalıtım",
    title: "Isı yalıtımı & strafor",
    text: "Tokat strafor, karbonlu EPS, XPS levha ve İzocam taşyünü / camyünü. Çatı, duvar ve temel detaylarında ısı-ses yalıtımı çözümleri.",
    href: "/yapi-malzemeleri",
  },
  {
    icon: Warehouse,
    query: "Tokat yapı market",
    title: "Yapı market & inşaat malzemesi",
    text: "OSB, plywood, çimento, tuğla, çatı membranı, kiremit, PVC ve nalbur. Turhal’daki yapı marketimizden şantiye ve tadilat ihtiyaçlarınıza tek noktadan tedarik.",
    href: "/yapi-malzemeleri",
  },
  {
    icon: Home,
    query: "Tokat ev tadilatı",
    title: "Ev tadilatı malzemeleri",
    text: "İç cephe boyası, alçıpan, sıva ve bitiş ürünleri. Tokat’ta daire / müstakil ev yenilemelerinde doğru malzeme ve uygulama danışmanlığı.",
    href: "/yapi-malzemeleri",
  },
  {
    icon: ShieldCheck,
    query: "depreme dayanıklı yapı Tokat",
    title: "Depreme uygun malzeme seçimi",
    text: "2026 deprem koşullarına uygun yapı anlayışında; bağlayıcılar, yalıtım ve cephe sistemlerinde yönetmelik bilinciyle ürün önerisi sunuyoruz.",
    href: "/teklif-al",
  },
] as const;

const districts = [
  {
    name: "Turhal",
    text: "Merkez mağazamız burada. Turhal mantolama, boya ve yapı market alışverişinde hızlı teslimat.",
  },
  {
    name: "Tokat Merkez",
    text: "Tokat yapı malzemeleri ihtiyacında stoklu ürün ve şantiye sevkiyatı.",
  },
  {
    name: "Erbaa & Niksar",
    text: "Erbaa / Niksar mantolama ve yalıtım malzemelerinde proje bazlı tedarik.",
  },
  {
    name: "Zile & Pazar",
    text: "Zile ve Pazar’daki tadilat ile konut işlerinde boya, sıva ve orman ürünleri.",
  },
  {
    name: "Amasya & Çorum",
    text: "Yakın illerdeki şantiyelere planlı malzeme sevkiyatı ve teklif desteği.",
  },
  {
    name: "Yozgat & Sivas",
    text: "Bölgesel tedarik ağımızla yalıtım, çatı ve kereste ihtiyaçlarına cevap.",
  },
] as const;

const tokatFaqs = [
  {
    question: "Tokat’ta mantolama malzemesi nereden alınır?",
    answer:
      "Cevizoğulları Yapı Market, Turhal’da EPS/XPS, file, dübel, yapıştırıcı ve dış cephe sıvasını stoklu sunar. Tokat mantolama projeleriniz için ürün seçimi ve tedarik desteği sağlarız.",
  },
  {
    question: "Turhal’da dış cephe boyası satıyor musunuz?",
    answer:
      "Evet. Permolit, Filli Boya ve Marshall dış cephe boyası ile astarları Turhal mağazamızda bulabilirsiniz. Renk ve yüzey tipine göre yönlendirme yapıyoruz.",
  },
  {
    question: "Tokat strafor / ısı yalıtım ürünleri var mı?",
    answer:
      "Tokat ısı yalıtım ihtiyacı için strafor (EPS), karbonlu EPS, XPS ve İzocam ürünlerini tedarik ediyoruz. Kalınlık ve kullanım alanına göre öneri veriyoruz.",
  },
  {
    question: "Erbaa, Niksar, Zile ve Pazar’a malzeme götürüyor musunuz?",
    answer:
      "Turhal merkezliyiz; Tokat merkez, Erbaa, Niksar, Zile, Pazar ve Amasya, Yozgat, Sivas, Çorum, Samsun’daki şantiye / tadilat işlerine ürün tedariki sunuyoruz. Detay için teklif alın.",
  },
] as const;

export default function TokatPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/tokat",
            name: "Tokat Yapı Malzemeleri · Turhal Mantolama & Boya",
            description:
              "Tokat yapı malzemeleri, Turhal mantolama, dış cephe boyası ve ısı yalıtımı tedariki.",
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Tokat", path: "/tokat" },
          ]),
          faqJsonLd(tokatFaqs),
        ]}
      />

      <PageHero
        title="Tokat Yapı Malzemeleri"
        description="Turhal Yapı Market · Tokat mantolama, dış cephe boyası, ısı yalıtımı ve inşaat malzemeleri. Aradığınız ürün, doğru yönlendirme."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tokat" },
        ]}
      />

      <section className="container-wide py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-premium">
              <Image
                src="/projects/modern-konut-cephe.jpg"
                alt="Tokat dış cephe mantolama ve boya uygulaması örneği"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Turhal Yapı Market
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 md:text-4xl text-balance">
              Tokat’ta yapı malzemesi arayanlar için net adres
            </h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              “Tokat yapı malzemeleri”, “Turhal mantolama” veya “Tokat dış cephe
              boyası” diye arıyorsanız doğru yerdesiniz. {SITE.shortName}; boya,
              mantolama, ısı yalıtımı, strafor, OSB, çatı ve kaba inşaat
              ürünlerini Turhal’daki yapı marketinde stoklu bulundurur.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              Amacımız katalog doldurmak değil; Tokat’taki konut, tadilat ve
              şantiye işlerinde gerçekten kullanılan malzemeleri, anlaşılır
              fiyat ve doğru uygulama önerisiyle sunmak. Deprem kuşağında
              yaşadığımız için ürün seçiminde güvenli yapı bilincini öne
              alıyoruz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/yapi-malzemeleri">Ürünlere Git</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/teklif-al">Fiyat Teklifi</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-earth-400/10 bg-forest-950 py-16 text-white md:py-24">
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              Ne arıyorsunuz?
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold md:text-4xl text-balance">
              Tokat’ta en çok aranan yapı çözümleri
            </h2>
            <p className="mt-4 max-w-2xl text-white/70">
              İnsanların arama motorlarında sorduğu sorulara göre düzenledik —
              ezbere “yakın il” listesi değil; gerçek ihtiyaç başlıkları.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {searchTopics.map((topic, index) => (
              <Reveal key={topic.query} delay={index * 0.05}>
                <Link
                  href={topic.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold-400/40 hover:bg-white/10"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
                    <topic.icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400/80">
                    {topic.query}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">
                    {topic.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
                    {topic.text}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-gold-300 group-hover:underline">
                    İncele →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            İlçe bazlı hizmet
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-ink-900 md:text-4xl text-balance">
            Turhal, Tokat, Erbaa, Niksar, Zile…
          </h2>
          <p className="mt-4 max-w-2xl text-ink-500">
            Mağazamız Turhal’da. Teslimat ve tedarik ağımız Tokat merkeze ve
            ilçelerdeki şantiye / tadilat işlerine uzanır.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-earth-400/15 bg-white/80 p-5 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-forest-900">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-mist-100/90 to-transparent py-16 md:py-24">
        <div className="container-wide">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Neden burada alınır?
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 md:text-4xl text-balance">
                Tokat yapı marketinde stok + yönlendirme
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-500 md:text-base">
                <p>
                  İnternette “en ucuz strafor” aramak kolay; sahada doğru kalınlık,
                  doğru yapıştırıcı ve doğru boya sistemi seçmek ayrı iş.
                  Cevizoğulları’nda ürünü raftan vermekle kalmayız — mantolama mı,
                  sadece boya mı, çatı mı netleştirip öneririz.
                </p>
                <p>
                  Tokat kışları sert geçer; ısı yalıtımı ve dış cephe boyasında
                  dayanım kritiktir. Bu yüzden Permolit / Filli / Marshall boya,
                  Weber sistemleri ve İzocam gibi bilinen markaları öne çıkarırız.
                </p>
                <p>
                  Yeni bina veya güçlendirme / tadilat fark etmeksizin; 2026
                  deprem koşullarına uygun yapı kültüründe malzeme kalitesinin
                  taşıyıcı güven kadar önemli olduğunu biliyoruz.
                </p>
              </div>
              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[1.75rem] shadow-premium">
                <Image
                  src="/projects/modern-konut-bahce.jpg"
                  alt="Tokat modern konut dış cephe ve peyzaj uygulaması"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>

            <div className="space-y-3">
              <Reveal>
                <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
                  Sık sorulanlar
                </h2>
                <p className="mt-2 text-sm text-ink-500">
                  Tokat mantolama, boya ve yalıtım hakkında net cevaplar.
                </p>
              </Reveal>
              {tokatFaqs.map((faq, index) => (
                <Reveal key={faq.question} delay={index * 0.05}>
                  <article className="rounded-2xl border border-earth-400/15 bg-white/90 p-5 md:p-6">
                    <h3 className="font-display text-base font-semibold text-forest-900 md:text-lg">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">
                      {faq.answer}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide pb-16 md:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-900 via-forest-800 to-earth-700 px-8 py-14 text-white md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-10 top-0 size-64 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
                Hemen teklif alın
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-balance">
                Tokat mantolama, boya veya yalıtım listesi hazır mı?
              </h2>
              <p className="mt-4 text-white/70">
                İhtiyacınızı yazın; Turhal Yapı Market stokundan net fiyat ve
                ürün önerisi dönelim. WhatsApp veya teklif formu yeterli.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="gold" size="lg">
                  <Link href="/teklif-al">Teklif Al</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/iletisim">İletişim</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/55">{SITE.address}</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
