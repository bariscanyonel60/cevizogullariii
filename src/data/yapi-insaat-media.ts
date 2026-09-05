import type { MediaItem } from "@/lib/media-types";

const CREATED = "2026-08-29T00:00:00.000Z";

function item(
  n: number,
  file: string,
  alt: string,
  title: string,
): MediaItem {
  const id = `c0e2026a-0829-4000-8000-${String(n).padStart(12, "0")}`;
  return {
    id,
    url: `/media/yapi-insaat/${file}`,
    publicId: `cevizogullari/media/yapi-insaat/${file.replace(/\.jpg$/, "")}`,
    title,
    alt,
    visible: true,
    createdAt: CREATED,
  };
}

/** Şantiye galerisi — CVZ Yapı İnşaat sahasından seçilmiş kareler (tekrarlar elendi). */
export const YAPI_INSAAT_MEDIA: MediaItem[] = [
  item(
    17,
    "ova-apt-3.jpg",
    "CVZ Yapı İnşaat Ova Apt. 3 bitmiş konut cephesi — Turhal / Tokat",
    "Ova Apt. 3",
  ),
  item(
    1,
    "ova-apt-2-saha.jpg",
    "CVZ Yapı İnşaat Ova Apt. 2 dış cephe uygulaması — Tokat Turhal konut inşaatı",
    "Ova Apt. 2",
  ),
  item(
    2,
    "ova-apt-tabela.jpg",
    "CVZ Yapı İnşaat Ova Apartmanı tabela ve modern dış cephe — Tokat",
    "Ova Apt tabela",
  ),
  item(
    3,
    "ova-apt-alt-aci.jpg",
    "CVZ Ova Apt ahşap görünümlü dış cephe ve balkon detayı — Turhal",
    "Ova Apt cephe",
  ),
  item(
    4,
    "ova-apt-giris.jpg",
    "Cevizoğulları Ova Apartmanı giriş ve dış cephe giydirme — Tokat Turhal",
    "Ova Apt giriş",
  ),
  item(
    5,
    "gece-cephe-cvz-1.jpg",
    "CVZ Yapı İnşaat gece cephe aydınlatmalı konut projesi — Tokat",
    "Gece cephe",
  ),
  item(
    6,
    "gece-cephe-cvz-2.jpg",
    "CVZ Yapı İnşaat müstakil konut dış cephe aydınlatması — Turhal",
    "Konut gece",
  ),
  item(
    7,
    "santiye-luks-daireler.jpg",
    "CVZ Yapı İnşaat şantiye tabelası ve kaba inşaat iskelesi — Tokat",
    "Şantiye tabelası",
  ),
  item(
    8,
    "santiye-iskele-ova.jpg",
    "CVZ Ova Apt dış cephe iskele ve mantolama çalışması — Tokat Turhal",
    "Cephe iskele",
  ),
  item(
    9,
    "temel-beton-dokumu.jpg",
    "Tokat Cevizoğulları inşaat sahasında temel beton dökümü ve pompa",
    "Temel beton",
  ),
  item(
    10,
    "kaba-insaat-iskelet.jpg",
    "Kaba inşaat betonarme iskelet ve yalıtım uygulaması — Tokat Turhal",
    "Kaba inşaat",
  ),
  item(
    15,
    "kalip-ahsap.jpg",
    "Ahşap kalıp ve temel duvar formu — Cevizoğulları kaba inşaat Tokat Turhal",
    "Ahşap kalıp",
  ),
  item(
    11,
    "satilik-daire-cephe.jpg",
    "CVZ Yapı İnşaat satılık daireli modern apartman cephesi — Tokat Turhal",
    "Satılık daire cephe",
  ),
  item(
    12,
    "dis-cephe-ahsap-detay.jpg",
    "Ahşap görünümlü dış cephe paneli ve balkon uygulaması — Cevizoğulları Tokat",
    "Cephe detay",
  ),
  item(
    16,
    "villa-dis-cephe.jpg",
    "Modern müstakil konut dış cephe: beyaz sıva, antrasit panel ve ahşap görünüm — Tokat",
    "Villa cephe",
  ),
  item(
    13,
    "ic-kapi-koridor.jpg",
    "Modern iç oda kapısı ve koridor aydınlatması — Cevizoğulları ince iş Tokat",
    "İç kapı koridor",
  ),
  item(
    14,
    "ic-kapi-lake.jpg",
    "Lake iç oda kapısı modelleri — Tokat yapı inşaat ince iş bitişi",
    "İç kapı modelleri",
  ),
];

export const YAPI_INSAAT_VIDEO = {
  src: "/media/yapi-insaat/santiye-saha.mp4",
  poster: "/media/yapi-insaat/santiye-saha-poster.jpg",
  title: "Şantiye sahası",
  description:
    "Tokat / Turhal’da kaba inşaat temposu — kalıp, saha ve cephe işi aynı ekipte.",
} as const;
