import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPinned, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tokat & Bölge · Yapı Malzemeleri",
  description:
    "Tokat, Turhal ve yakın illerde yapı malzemeleri, inşaat tedariki ve 2026 deprem koşullarına uygun yapı çözümleri. Cevizoğulları ile güvenli inşaat.",
  path: "/tokat",
});

const nearbyRegions = [
  {
    name: "Tokat & Turhal",
    blurb: "Merkez üssümüz. Stoklu ürün, hızlı teslimat ve yerinde teknik destek.",
  },
  {
    name: "Amasya",
    blurb: "Konut ve tadilat projelerinde yalıtım, boya ve orman ürünleri tedariki.",
  },
  {
    name: "Samsun",
    blurb: "Şantiye temposuna uygun malzeme sevkiyatı ve cephe sistemleri.",
  },
  {
    name: "Sivas",
    blurb: "Isı yalıtımı, çatı ve kaba inşaat malzemelerinde bölgesel destek.",
  },
  {
    name: "Ordu & Çorum",
    blurb: "Yakın çevre illerde proje bazlı tedarik ve uygulama danışmanlığı.",
  },
] as const;

const services = [
  {
    icon: Building2,
    title: "Yapı market & malzeme",
    text: "Boya, mantolama, yalıtım, çatı, OSB, çimento ve nalbur ihtiyaçlarınızı tek noktadan karşılıyoruz.",
  },
  {
    icon: Truck,
    title: "Bölgesel tedarik",
    text: "Tokat ve çevresindeki şantiyelere planlı sevkiyat; usta ve müteahhitlere hızlı çözüm.",
  },
  {
    icon: ShieldCheck,
    title: "Depreme dayanıklı yaklaşım",
    text: "Malzeme seçimi ve uygulama yönlendirmesinde güncel yönetmelik ve güvenli yapı prensiplerini esas alıyoruz.",
  },
  {
    icon: MapPinned,
    title: "Yerel saha bilgisi",
    text: "Bölgenin iklimi, zemin koşulları ve yapı kültürünü bilen bir ekiple yanınızdayız.",
  },
] as const;

const earthquakePoints = [
  {
    title: "Güncel yönetmelik bilinci",
    body: "Türkiye Bina Deprem Yönetmeliği (TBDY) ve ilgili güncellemeler çerçevesinde; taşıyıcı sistem, yalıtım ve cephe detaylarında güvenli yapı yaklaşımını destekliyoruz.",
  },
  {
    title: "2026 deprem koşullarına uygun yapı",
    body: "Yeni konut ve tadilat projelerinde; doğru yalıtım, kaliteli bağlayıcılar, standartlara uygun demir-çimento kombinasyonu ve cephe sistemleriyle deprem riskine karşı daha dayanıklı yapılar hedefliyoruz.",
  },
  {
    title: "Malzeme kalitesi = yapı güvenliği",
    body: "Depreme karşı direnç yalnızca proje çiziminde değil, sahadaki malzeme kalitesinde başlar. Stoklarımızda güvenilir marka ve standart ürünleri önceliklendiriyoruz.",
  },
  {
    title: "Uygulama & danışmanlık",
    body: "Mantolama, sıva, boya ve çatı detaylarında doğru ürün-uygulama eşleşmesiyle uzun ömürlü ve daha güvenli sonuçlar üretiyoruz.",
  },
] as const;

export default function TokatPage() {
  return (
    <>
      <PageHero
        title="Tokat & Yakın Bölge"
        description="Turhal merkezli Cevizoğulları; Tokat ve çevresinde yapı malzemeleri, inşaat tedariki ve deprem koşullarına uygun yapı çözümleri sunar."
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
                alt="Tokat bölgesinde modern konut ve dış cephe uygulaması"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Bölgesel önem
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 md:text-4xl text-balance">
              Tokat’ta güvenli yapı, doğru malzemeyle başlar
            </h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              Tokat ve yakın illerde konut, tadilat ve şantiye yatırımları artarken;
              kaliteli yapı malzemesine erişim hem maliyet hem güvenlik açısından
              kritik hale geldi. Deprem kuşağında yer alan bölgemizde; yalıtım,
              bağlayıcı malzemeler, cephe sistemleri ve orman ürünleri doğru
              seçildiğinde yapı ömrü ve can güvenliği doğrudan etkilenir.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              {SITE.shortName} olarak Turhal’daki merkezimizden Tokat merkeze,
              ilçelere ve komşu illere stoklu ürün, hızlı tedarik ve uygulama
              danışmanlığı sağlıyoruz. Amacımız; bölgedeki her projede güvenilir
              malzeme ve sürdürülebilir çözüm sunmak.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/yapi-malzemeleri">Yapı Market</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/projelerimiz">Gayrimenkul</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-earth-400/10 bg-forest-950 py-16 text-white md:py-24">
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
              Hizmet bölgemiz
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold md:text-4xl text-balance">
              Tokat ve yakın illerde yanınızdayız
            </h2>
            <p className="mt-4 max-w-2xl text-white/70">
              Merkezimiz Turhal’da; hizmet ağımız Tokat merkez, ilçeler ve
              komşu illerdeki şantiye ile tadilat projelerine uzanır.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {nearbyRegions.map((region, index) => (
              <Reveal key={region.name} delay={index * 0.05}>
                <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <h3 className="font-display text-lg font-semibold text-gold-300">
                    {region.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {region.blurb}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Bölge içi hizmetlerimiz
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-ink-900 md:text-4xl text-balance">
            İnşaattan bitişe kadar tek çözüm ortağı
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <article className="flex gap-4 rounded-[1.5rem] border border-earth-400/15 bg-white/70 p-6 shadow-sm">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-800 text-gold-300">
                  <service.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {service.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-mist-100/90 to-transparent py-16 md:py-24">
        <div className="container-wide">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Deprem güvenliği
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 md:text-4xl text-balance">
                2026 deprem koşullarına uygun yapı anlayışı
              </h2>
              <p className="mt-5 leading-relaxed text-ink-500">
                Bölgemizde deprem riski göz ardı edilemez. Bu yüzden yalnızca
                “ucuz malzeme” değil; yönetmelik bilinciyle seçilmiş, uygulamada
                doğru kullanılan ürünlerle ilerliyoruz. Yeni binalarda ve
                güçlendirme / tadilat işlerinde güvenli yapı kültürünü
                yaygınlaştırmayı hedefliyoruz.
              </p>
              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[1.75rem] shadow-premium">
                <Image
                  src="/projects/modern-konut-bahce.jpg"
                  alt="Deprem koşullarına uygun modern konut örneği"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </Reveal>
            <div className="space-y-4">
              {earthquakePoints.map((point, index) => (
                <Reveal key={point.title} delay={index * 0.06}>
                  <article className="rounded-2xl border border-earth-400/15 bg-white/80 p-5 md:p-6">
                    <h3 className="font-display text-lg font-semibold text-forest-900">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">
                      {point.body}
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
                Tokat’ta yanınızdayız
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-balance">
                Projeniz için bölgesel destek alın
              </h2>
              <p className="mt-4 text-white/70">
                Tokat, Turhal ve yakın illerdeki konut / şantiye ihtiyaçlarınız
                için teklif alın; deprem koşullarına uygun malzeme seçiminde
                size yol gösterelim.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="gold" size="lg">
                  <Link href="/teklif-al">Teklif Al</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/iletisim">İletişime Geç</Link>
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
