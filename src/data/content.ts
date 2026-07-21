import type { StatItem, Testimonial } from "@/types";

export const stats: StatItem[] = [
  { id: "1", value: 15, suffix: "+", label: "Yıllık Tecrübe" },
  { id: "2", value: 500, suffix: "+", label: "Desteklenen Proje" },
  { id: "3", value: 2000, suffix: "+", label: "Mutlu Müşteri" },
  { id: "4", value: 1000, suffix: "+", label: "Ürün Çeşidi" },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Hasan Yıldız",
    role: "Müteaahhit · Turhal",
    quote:
      "Toplu alımlarda zamanında teslimat ve doğru ürün önerisi sayesinde şantiye tempomuz hiç düşmedi. Güvenilir bir tedarikçi.",
    rating: 5,
  },
  {
    id: "2",
    name: "Fatma Aksoy",
    role: "Ev Tadilatı",
    quote:
      "Yalıtım ve çatı malzemelerinde ihtiyacımıza uygun yönlendirme aldık. Kaliteli ürün, uygun fiyat — memnun kaldık.",
    rating: 5,
  },
  {
    id: "3",
    name: "Ali Demir",
    role: "Usta · Tokat",
    quote:
      "Günlük şantiye ihtiyaçlarında hızlı hazırlık ve sürekli stok desteği çok işimize yarıyor. Tek noktadan çözüyoruz.",
    rating: 5,
  },
];

export const whyUs = [
  {
    title: "Kaliteli Ürün",
    description:
      "Orman ürünlerinden yalıtıma, temel inşaat malzemelerine kadar dayanıklı ve güvenilir ürün gamı.",
  },
  {
    title: "Uygun Fiyat",
    description:
      "Bireysel müşteriden ustaya, müteahhitten büyük projelere kadar rekabetçi fiyatlandırma.",
  },
  {
    title: "Hızlı Tedarik",
    description:
      "Stoklu ürün yapısı ve organize sevkiyat ile proje temposuna uyum sağlayan teslimat.",
  },
  {
    title: "Doğru Yönlendirme",
    description:
      "İhtiyaca uygun ürün seçimi, uygulama odaklı danışmanlık ve satış sonrası destek.",
  },
];

export const services = [
  {
    title: "Orman Ürünleri",
    description:
      "OSB, plywood (odek), laminat, çam kereste, lambri ve kavak kereste ile sağlam temel.",
    href: "/yapi-malzemeleri",
  },
  {
    title: "Boya & Dış Cephe",
    description:
      "Polisan, Filli Boya ve Marshall ile iç-dış cephe boyası, astar ve dekoratif kaplama.",
    href: "/yapi-malzemeleri",
  },
  {
    title: "Yalıtım & Mantolama",
    description:
      "EPS, XPS, İzocam ve Weber sistemleri ile enerji verimli dış cephe yalıtımı.",
    href: "/yapi-malzemeleri",
  },
  {
    title: "Hızlı Tedarik",
    description:
      "Zamanında teslimat, geniş yelpaze ve müşteri memnuniyeti odaklı hizmet anlayışı.",
    href: "/teklif-al",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Keşif ve İhtiyaç Analizi",
    description:
      "Talebinizi dinler, proje ihtiyaçlarını belirler ve en uygun malzeme çözümlerini sunarız.",
  },
  {
    step: "02",
    title: "Planlama ve Ürün Seçimi",
    description:
      "Orman ürünleri, yalıtım ve inşaat malzemeleri; doğru ürün, fiyat ve planlama ile netleşir.",
  },
  {
    step: "03",
    title: "Tedarik ve Hazırlık",
    description:
      "Siparişler özenle hazırlanır; stok ve kalite kontrol süreçleri titizlikle yürütülür.",
  },
  {
    step: "04",
    title: "Teslimat ve Destek",
    description:
      "Ürünler zamanında teslim edilir; satış sonrası destek ve danışmanlık sürer.",
  },
];

export const audienceSegments = [
  {
    title: "Ticari Projeler",
    description:
      "Depo, iş yeri ve büyük ölçekli projelerde süreklilik ve hızlı tedarik avantajı.",
    points: [
      "Toplu alımlarda güçlü tedarik planı",
      "Proje sürecine uygun zamanında teslimat",
      "Geniş ürün çeşitliliğiyle tek noktadan çözüm",
    ],
  },
  {
    title: "Bireysel Yapılar",
    description:
      "Ev yapımı, tadilat ve yenilemede doğru malzeme seçimiyle uzun ömürlü çözümler.",
    points: [
      "İhtiyaca uygun ürün yönlendirmesi",
      "Yalıtım ve çatı çözümlerinde doğru seçim",
      "Hızlı tedarik, güvenilir kalite",
    ],
  },
  {
    title: "Usta & Şantiye",
    description:
      "Günlük şantiye ihtiyaçlarına pratik, hızlı ve doğru malzeme desteği.",
    points: [
      "İhtiyaç listesine göre hızlı hazırlık",
      "Uygulama odaklı ürün önerisi",
      "Sürekli stok ve düzenli tedarik",
    ],
  },
];
