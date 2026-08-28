import type { StatItem, Testimonial } from "@/types";

export const stats: StatItem[] = [
  { id: "1", value: 30, suffix: "+", label: "Yıllık Tecrübe" },
  { id: "2", value: 5000, suffix: "+", label: "Mutlu Müşteri" },
  { id: "3", value: 15000, suffix: "+", label: "Teslim Edilen Ürün" },
  { id: "4", value: 100, suffix: "+", label: "Proje" },
  { id: "5", value: 500, suffix: "+", label: "Uygulama" },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Hasan Yıldız",
    role: "Müteahhit · Turhal",
    quote:
      "Şantiye listesini akşam atıyoruz, sabah palet hazır oluyor. Çimento, OSB ve mantolama aynı yükte çıktı; usta bekletmedik.",
    rating: 5,
  },
  {
    id: "2",
    name: "Fatma Aksoy",
    role: "Ev tadilatı · Tokat",
    quote:
      "Dış cephe için EPS kalınlığı ve Permolit rengi konusunda net konuştular. Aldığım malzeme evde açıkta kalmadı, fazlası da yoktu.",
    rating: 5,
  },
  {
    id: "3",
    name: "Ali Demir",
    role: "Usta · Tokat",
    quote:
      "Nalbur, file, dübel, astar — eksik kalem çıkınca Turhal’dan tamamlıyoruz. Reyon bildikleri için yanlış ürün önermiyorlar.",
    rating: 5,
  },
];

export const whyUs = [
  {
    title: "Turhal’da stoklu reyon",
    description:
      "Boya, mantolama, çimento, çatı, OSB ve nalbur aynı çatı altında. Listeyi getirin; raflardan toplayıp yükleriz.",
  },
  {
    title: "Şantiye temposuna uyum",
    description:
      "Toplu alımda palet hazırlar, talep olunca kendi aracımızla götürürüz. Usta beklesin diye işi uzatmayız.",
  },
  {
    title: "Doğru ürün, doğru iş",
    description:
      "Hangi EPS, hangi astar, hangi kereste — kullanım yerini sorar, Tokat iklimine ve uygulamaya göre yönlendiririz.",
  },
  {
    title: "Yerel, tekrar aranan adres",
    description:
      "Aynı müteahhit ve ustalarla tekrar çalışırız. Bir kere satıp bitirmek değil; bir sonraki siparişte de bulunmak isteriz.",
  },
];

export const services = [
  {
    title: "Yapı Market",
    description:
      "Permolit boya, mantolama seti, çimento, çatı membranı ve nalbur. Turhal reyonundan Tokat şantiyesine tedarik.",
    href: "/yapi-malzemeleri",
  },
  {
    title: "Orman Ürünleri",
    description:
      "OSB, plywood (odek), çam-kavak kereste ve lambri. Çatı, kalıp ve tadilat için ölçüye göre levha.",
    href: "/orman-urunleri",
  },
  {
    title: "Yalıtım & Dış Cephe",
    description:
      "EPS/XPS, İzocam, Weber yapıştırıcı, file-dübel ve dış cephe sıvası. Mantolamayı sistem olarak kurarız.",
    href: "/yapi-malzemeleri",
  },
  {
    title: "Yapı - İnşaat",
    description:
      "Konut, cephe ve tadilat uygulaması. Malzeme tedariki ile saha işini aynı ekipten yürütmek isteyenler için.",
    href: "/yapi-insaat",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Listeyi alın",
    description:
      "Mağazaya gelin, WhatsApp’tan yazın veya teklif formunu doldurun. Ürün, miktar ve teslim yeri yeter.",
  },
  {
    step: "02",
    title: "Stok ve ölçü",
    description:
      "Rafta ne var, hangisi sipariş, hangi kalınlık veya renk uygun — net konuşur, fiyatı söyleriz.",
  },
  {
    step: "03",
    title: "Yükleme",
    description:
      "Torba, levha ve paleti mağaza veya depodan hazırlarız. Kırılmasın, eksik çıkmasın diye sayarız.",
  },
  {
    step: "04",
    title: "Teslim ve devam",
    description:
      "Turhal’dan alın veya talep edin, aracımızla götürelim. Eksik kalem olursa aynı gün tamamlarız.",
  },
];

export const audienceSegments = [
  {
    title: "Müteahhit & şantiye",
    description:
      "Toplu çimento, demir, OSB, yalıtım ve cephe malzemesinde süreklilik. Proje takvimine göre yük planlarız.",
    points: [
      "Paletli teslim ve şantiye listesine göre hazırlık",
      "Mantolama ve çatı kalemlerini tek siparişte birleştirme",
      "Erbaa, Niksar, Zile ve Pazar şantiyelerine sevkiyat",
    ],
  },
  {
    title: "Usta",
    description:
      "Günlük ihtiyaç: astar, file, dübel, nalbur, sıva. Yanlış ürünle sahaya dönmeyin diye reyonu birlikte tararız.",
    points: [
      "Eksik kalemi aynı gün tamamlama",
      "Uygulamaya göre marka ve ölçü önerisi",
      "Küçük alımda da mağazadan hızlı çıkış",
    ],
  },
  {
    title: "Ev sahibi / tadilat",
    description:
      "Daire veya müstakil ev boyası, mantolama, çatı ve iç mekan. Ne kadar malzeme gideceğini abartmadan hesaplarız.",
    points: [
      "Permolit iç-dış boya ve astar seçimi",
      "EPS kalınlığı ve cephe sistemi yönlendirmesi",
      "İsterseniz ürünü adrese götürme",
    ],
  },
];
