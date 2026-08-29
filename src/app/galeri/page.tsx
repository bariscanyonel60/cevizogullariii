import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { GallerySection } from "@/components/organisms/shared/GallerySection";
import { SiteVideoSection } from "@/components/organisms/shared/SiteVideoSection";
import { JsonLd } from "@/components/atoms/JsonLd";
import { getPublicMedia } from "@/lib/media-store";
import { YAPI_INSAAT_VIDEO } from "@/data/yapi-insaat-media";
import {
  breadcrumbJsonLd,
  buildMetadata,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Galeri · Şantiye ve Cephe Uygulama Fotoğrafları",
  description:
    "Turhal ve Tokat saha kareleri: dış cephe, mantolama, şantiye ve yapı market uygulamaları — Cevizoğulları galerisi.",
  path: "/galeri",
  keywords: [
    "Cevizoğulları galeri",
    "Tokat yapı market görselleri",
    "Turhal şantiye fotoğrafları",
    "Tokat mantolama uygulama",
  ],
});

/** Yönetici panelinden yapılan galeri güncellemelerinin görünmesi için */
export const revalidate = 60;

export default async function GaleriPage() {
  const [gallery, yapiInsaat] = await Promise.all([
    getPublicMedia("gallery"),
    getPublicMedia("yapi-insaat"),
  ]);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/galeri",
            name: "Galeri · Cevizoğulları Yapı Market & İnşaat",
            description:
              "Tokat ve Turhal’daki uygulama, şantiye ve mağaza görsellerimiz.",
          }),
          breadcrumbJsonLd([
            { name: "Ana Sayfa", path: "/" },
            { name: "Galeri", path: "/galeri" },
          ]),
        ]}
      />

      <PageHero
        title="Galeri"
        description="Sahadan ve mağazadan kareler — Tokat / Turhal’daki uygulamalarımız."
        crumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Galeri" }]}
      />

      <GallerySection
        id="galeri"
        items={gallery.items}
        eyebrow="Galeri"
        title="Sahadan kareler"
        description="Yapı market, dış cephe ve tadilat uygulamalarımızdan seçilmiş görseller."
      />

      <SiteVideoSection
        src={YAPI_INSAAT_VIDEO.src}
        poster={YAPI_INSAAT_VIDEO.poster}
        title={YAPI_INSAAT_VIDEO.title}
        description={YAPI_INSAAT_VIDEO.description}
      />

      <GallerySection
        id="santiye-galeri"
        items={yapiInsaat.items}
        eyebrow="Şantiye galerisi"
        title="Yapı - İnşaat uygulamaları"
        description="Konut ve bina inşaatı ile şantiye çalışmalarımızdan güncel kareler."
      />
    </>
  );
}
