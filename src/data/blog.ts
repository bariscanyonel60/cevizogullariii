import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "2026-gayrimenkul-yatirim-trendleri",
    title: "2026 Gayrimenkul Yatırım Trendleri · Tokat & Turhal",
    excerpt:
      "Tokat ve Turhal’da enerji verimli konutlar, bölgesel gelişim ve doğru lokasyon seçimi 2026 gayrimenkul yatırımını nasıl şekillendiriyor?",
    content: `
## Giriş

2026 yılında gayrimenkul yatırımları; sürdürülebilirlik, lokasyon kalitesi ve uzun vadeli değer artışı etrafında şekilleniyor. Tokat ve Turhal’da da aynı dinamikler geçerli: doğru ilçe, sağlam yapı malzemesi ve şeffaf süreç kritik.

## Enerji Verimliliği Önceliği

Yüksek enerji sınıfına sahip konutlar hem işletme maliyetlerini düşürüyor hem de ikinci el piyasada daha hızlı talep görüyor. Turhal’daki mantolama ve yalıtım uygulamaları bu değeri doğrudan etkiler.

## Bölgesel Lokasyon: Tokat İlçeleri

Erbaa, Niksar, Zile ve Pazar gibi ilçelerde imar ve talep dengesi yatırımı belirler. Cevizoğulları Yapı - İnşaat, yerel portföyü Tokat odaklı sunar.

## Sonuç

Doğru lokasyon, şeffaf süreç ve uzman danışmanlık ile Tokat gayrimenkul yatırımı uzun vadede güvenli bir değer koruma aracı olmaya devam ediyor.
    `.trim(),
    category: "Yapı - İnşaat",
    tags: ["yatırım", "trend", "2026", "Tokat", "Turhal"],
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80",
    author: "Cevizoğulları Editör",
    publishedAt: "2026-03-12",
    readingTime: 6,
  },
  {
    id: "2",
    slug: "dogru-yapi-malzemesi-secimi",
    title: "Doğru Yapı Malzemesi Seçimi · Tokat Rehberi",
    excerpt:
      "Tokat ve Turhal’da çimento, yalıtım, boya ve OSB seçiminde kalite kriterleri nelerdir? Şantiye bazlı seçim ipuçları.",
    content: `
## Malzeme Kalitesi Neden Kritik?

Yapı malzemesi seçimi; dayanıklılık, enerji performansı ve yaşam konforunu doğrudan etkiler. Tokat yapı malzemeleri alırken marka, kuruluk ve uygulama uyumu birlikte düşünülmelidir.

## Çimento ve Dayanımlılık

Proje tipine uygun dayanım sınıfı seçimi, uzun vadeli yapı güvenliği için temel adımdır. Turhal Yapı Market stokumuzda bağlayıcı ürünleri bulabilirsiniz.

## Yalıtım ve Mantolama

Doğru EPS / XPS / İzocam uygulamaları hem ısı kaybını azaltır hem de iç mekân konforunu artırır. Tokat mantolama projelerinde kalınlık ve sistem seçimi birlikte yapılır.

## Sonuç

Cevizoğulları; Turhal merkezli stok ve danışmanlıkla doğru ürünü doğru işe yönlendirir.
    `.trim(),
    category: "Yapı",
    tags: ["malzeme", "kalite", "rehber", "Tokat mantolama", "Turhal"],
    coverImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
    author: "Cevizoğulları Editör",
    publishedAt: "2026-02-20",
    readingTime: 5,
  },
  {
    id: "3",
    slug: "premium-konutlarda-tasarim-dili",
    title: "Premium Konutlarda Tasarım Dili · Yerel Uygulama",
    excerpt:
      "Tokat ve Turhal’daki yeni konutlarda minimal çizgiler, doğal dokular ve dış cephe uyumu: prestijli yaşamın ortak ilkeleri.",
    content: `
## Minimal Ama Sıcak

Premium konutlarda sade formlar, doğal malzemelerle dengelenerek zamansız bir estetik oluşturur. Turhal’daki dış cephe boyası ve lambri seçimleri bu dili tamamlar.

## Işık, Oran ve Cephe

Doğru oranlar ve doğal ışık kullanımı, mekân algısını büyütür. Tokat’ta cephe boyası ve yalıtım birlikte planlandığında hem görünüm hem enerji performansı yükselir.

## Sonuç

Tasarım dili; doğru yapı malzemesi ve yerel uygulama bilgisiyle tamamlanır. Cevizoğulları Yapı Market bu süreci destekler.
    `.trim(),
    category: "Tasarım",
    tags: ["tasarım", "konut", "mimari", "Tokat", "dış cephe"],
    coverImage:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
    author: "Cevizoğulları Editör",
    publishedAt: "2026-01-18",
    readingTime: 4,
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 2) {
  const current = getPostBySlug(slug);
  if (!current) return blogPosts.slice(0, limit);
  return blogPosts
    .filter((p) => p.slug !== slug && p.category === current.category)
    .concat(blogPosts.filter((p) => p.slug !== slug))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, limit);
}
