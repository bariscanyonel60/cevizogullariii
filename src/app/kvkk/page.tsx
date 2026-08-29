import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { Reveal } from "@/components/molecules/Reveal";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni",
  description:
    "Cevizoğulları kişisel veri işleme amaçları, saklama süresi ve haklarınız. Turhal Yapı Market KVKK aydınlatma metni.",
  path: "/kvkk",
  noIndex: true,
});

const sections = [
  {
    title: "1. Veri sorumlusu",
    body: `${SITE.name}, ${SITE.address} adresinde faaliyet gösteren veri sorumlusudur. İletişim: ${SITE.email} · ${SITE.phone}`,
  },
  {
    title: "2. İşlenen kişisel veriler",
    body: "İletişim ve teklif formları, bilgilerinizi sunucumuza kaydetmez; WhatsApp üzerinden mesaj hazırlamak için tarayıcınızda kullanır. Bu süreçte paylaştığınız ad-soyad, telefon, e-posta ve talep içeriği WhatsApp üzerinden tarafımıza iletilebilir. Ayrıca site kullanımına bağlı teknik log verileri işlenebilir.",
  },
  {
    title: "3. İşleme amaçları",
    body: "Kişisel verileriniz; WhatsApp ile ilettiğiniz talepleri yanıtlamak, teklif süreçlerini yürütmek, müşteri ilişkilerini yönetmek, yasal yükümlülükleri yerine getirmek ve hizmet kalitesini artırmak amacıyla işlenir.",
  },
  {
    title: "4. Hukuki sebepler",
    body: "Veriler, 6698 sayılı KVKK’nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayanarak; sözleşmenin kurulması/ifası, meşru menfaat ve açık rıza hallerinde işlenir.",
  },
  {
    title: "5. Aktarım",
    body: "Kişisel verileriniz, yalnızca hizmetin gerektirdiği ölçüde ve yasal zorunluluklar çerçevesinde iş ortaklarımıza, tedarikçilerimize veya yetkili kamu kurumlarına aktarılabilir.",
  },
  {
    title: "6. Saklama süresi",
    body: "Veriler, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir.",
  },
  {
    title: "7. Haklarınız",
    body: "KVKK m.11 kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme, itiraz ve şikâyet haklarına sahipsiniz. Taleplerinizi info@cevizogullari.com adresine iletebilirsiniz.",
  },
] as const;

export default function KvkkPage() {
  return (
    <>
      <PageHero
        title="KVKK Aydınlatma Metni"
        description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme."
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kurumsal", href: "/kurumsal" },
          { label: "KVKK" },
        ]}
      />

      <section className="container-wide py-16 md:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-base leading-relaxed text-ink-600 md:text-lg">
              Bu metin, {SITE.shortName} olarak topladığımız kişisel verilerin
              hangi amaçlarla ve hangi hukuki dayanaklarla işlendiğini
              açıklamak için hazırlanmıştır.
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
            <p className="border-t border-earth-400/15 pt-6 text-xs text-ink-500">
              Son güncelleme: {new Date().getFullYear()} · Bu metin bilgilendirme
              amaçlıdır; güncel yasal gerekliliklere göre revize edilebilir.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
