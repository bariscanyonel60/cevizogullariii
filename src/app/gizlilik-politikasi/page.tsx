import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/atoms/JsonLd";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { Reveal } from "@/components/molecules/Reveal";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "Cevizoğulları web sitesinde hangi verilerin toplandığı, çerez kullanımı, üçüncü taraf hizmetler ve gizlilik haklarınız hakkında bilgilendirme.";

export const metadata: Metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description: DESCRIPTION,
  path: "/gizlilik-politikasi",
});

const sections = [
  {
    title: "1. Kapsam",
    body: `Bu gizlilik politikası, ${SITE.url.replace("https://", "")} alan adlı web sitesini ziyaret ettiğinizde ve sitedeki formları kullandığınızda kişisel bilgilerinizin nasıl ele alındığını açıklar. Kişisel verilerin işlenmesine ilişkin yasal bilgilendirme için KVKK Aydınlatma Metni’ni de inceleyebilirsiniz.`,
  },
  {
    title: "2. Topladığımız bilgiler",
    body: "Siteyi gezmek için herhangi bir üyelik veya kişisel bilgi gerekmez. Yalnızca iletişim ve teklif formlarını doldurduğunuzda ad-soyad, telefon, (isteğe bağlı) e-posta, firma adı ve talep içeriği gibi bilgileri bizimle kendi isteğinizle paylaşırsınız. Ayrıca sunucu, güvenlik ve hata takibi amacıyla IP adresi, tarayıcı türü ve ziyaret zamanı gibi teknik kayıtlar tutulabilir.",
  },
  {
    title: "3. Bilgilerin kullanım amacı",
    body: "Paylaştığınız bilgiler yalnızca talebinize yanıt vermek, fiyat ve stok teklifi hazırlamak, sipariş ve teslimat sürecini yürütmek ve yasal yükümlülüklerimizi yerine getirmek için kullanılır. Bilgileriniz reklam amacıyla satılmaz, kiralanmaz veya izniniz olmadan pazarlama iletişimi için kullanılmaz.",
  },
  {
    title: "4. Çerezler",
    body: "Sitemiz ziyaretçileri izlemek için reklam veya analiz çerezi kullanmaz. Yalnızca yönetim paneli girişinde, oturumu güvenli şekilde sürdürmek için zorunlu bir oturum çerezi oluşturulur; bu çerez ziyaretçi sayfalarında kullanılmaz. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz.",
  },
  {
    title: "5. Üçüncü taraf hizmetler",
    body: "Siteyi hızlı ve güvenli sunmak için bazı hizmet sağlayıcılardan yararlanırız: görseller ve videolar Cloudinary üzerinden sunulur; form e-postaları Resend altyapısıyla iletilir; konum haritası Google Haritalar tarafından gösterilir. WhatsApp veya Instagram bağlantılarına tıkladığınızda ilgili platformun kendi gizlilik politikası geçerli olur.",
  },
  {
    title: "6. Veri güvenliği",
    body: "Site trafiği HTTPS ile şifrelenir. Form verileri yalnızca yetkili ekibimizin erişebildiği e-posta adresine iletilir ve yetkisiz erişime karşı makul teknik ve idari önlemler alınır.",
  },
  {
    title: "7. Saklama süresi",
    body: "Form aracılığıyla ilettiğiniz bilgiler, talebiniz sonuçlanana ve ilgili mevzuatın öngördüğü süre dolana kadar saklanır; ardından silinir veya anonim hale getirilir.",
  },
  {
    title: "8. Haklarınız",
    body: `Bilgilerinize erişme, düzeltilmesini veya silinmesini isteme ve işlenmesine itiraz etme hakkına sahipsiniz. Talepleriniz için ${SITE.email} adresine e-posta gönderebilir veya ${SITE.phone} numaralı hattımızdan bize ulaşabilirsiniz.`,
  },
  {
    title: "9. Değişiklikler",
    body: "Bu politika, yasal düzenlemeler veya sitede kullanılan hizmetler değiştiğinde güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.",
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/gizlilik-politikasi",
            name: "Gizlilik Politikası",
            description: DESCRIPTION,
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Gizlilik Politikası", path: "/gizlilik-politikasi" },
          ]),
        ]}
      />
      <PageHero
        title="Gizlilik Politikası"
        description="Web sitemizi kullanırken bilgilerinizin nasıl korunduğunu açıklıyoruz."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Gizlilik Politikası" },
        ]}
      />

      <section className="container-wide py-16 md:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-base leading-relaxed text-ink-600 md:text-lg">
              {SITE.name} olarak gizliliğinize önem veriyoruz. Bu sayfa,
              sitemizi ziyaret ettiğinizde ve formlarımızı kullandığınızda
              hangi bilgilerin işlendiğini sade bir dille özetler.
            </p>
            {sections.map((section) => (
              <article key={section.title} className="space-y-3">
                <h2 className="font-display text-xl font-semibold text-forest-900">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink-600 md:text-base">
                  {section.body}
                </p>
              </article>
            ))}
            <p className="text-sm text-ink-600">
              Kişisel verilerin işlenmesine dair yasal bilgilendirme için{" "}
              <Link
                href="/kvkk"
                className="font-semibold text-forest-800 underline-offset-2 hover:underline"
              >
                KVKK Aydınlatma Metni
              </Link>
              ’ni inceleyebilirsiniz.
            </p>
            <p className="border-t border-earth-400/15 pt-6 text-xs text-ink-500">
              Son güncelleme: Ekim 2026
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
