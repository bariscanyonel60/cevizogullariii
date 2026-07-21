import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "2026-gayrimenkul-yatirim-trendleri",
    title: "2026 Gayrimenkul Yatırım Trendleri",
    excerpt:
      "Enerji verimli konutlar, karma kullanımlı projeler ve bölgesel gelişim dinamikleri yatırımı nasıl şekillendiriyor?",
    content: `
## Giriş

2026 yılında gayrimenkul yatırımları; sürdürülebilirlik, lokasyon kalitesi ve uzun vadeli değer artışı etrafında şekilleniyor.

## Enerji Verimliliği Önceliği

Yüksek enerji sınıfına sahip konutlar hem işletme maliyetlerini düşürüyor hem de ikinci el piyasada daha hızlı talep görüyor.

## Karma Kullanımlı Projeler

Yaşam, çalışma ve sosyal alanları bir araya getiren projeler, özellikle büyük şehirlerde yatırımcıların radarında.

## Sonuç

Doğru lokasyon, şeffaf süreç ve uzman danışmanlık ile gayrimenkul yatırımı uzun vadede güvenli bir değer koruma aracı olmaya devam ediyor.
    `.trim(),
    category: "Gayrimenkul",
    tags: ["yatırım", "trend", "2026"],
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80",
    author: "Cevizoğulları Editör",
    publishedAt: "2026-03-12",
    readingTime: 6,
  },
  {
    id: "2",
    slug: "dogru-yapi-malzemesi-secimi",
    title: "Doğru Yapı Malzemesi Seçimi Rehberi",
    excerpt:
      "Çimento, yalıtım ve seramik seçiminde kalite kriterleri nelerdir? Proje bazlı seçim ipuçları.",
    content: `
## Malzeme Kalitesi Neden Kritik?

Yapı malzemesi seçimi; dayanıklılık, enerji performansı ve yaşam konforunu doğrudan etkiler.

## Çimento ve Dayanımlılık

Proje tipine uygun dayanım sınıfı seçimi, uzun vadeli yapı güvenliği için temel adımdır.

## Yalıtım ve Konfor

Doğru XPS / mineral yün uygulamaları hem ısı kaybını azaltır hem de iç mekân konforunu artırır.
    `.trim(),
    category: "Yapı",
    tags: ["malzeme", "kalite", "rehber"],
    coverImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
    author: "Cevizoğulları Editör",
    publishedAt: "2026-02-20",
    readingTime: 5,
  },
  {
    id: "3",
    slug: "premium-konutlarda-tasarim-dili",
    title: "Premium Konutlarda Tasarım Dili",
    excerpt:
      "Minimal çizgiler, doğal dokular ve ışık dengesi: prestijli konutların ortak tasarım ilkeleri.",
    content: `
## Minimal Ama Sıcak

Premium konutlarda sade formlar, doğal malzemelerle dengelenerek zamansız bir estetik oluşturur.

## Işık ve Oran

Doğru oranlar ve doğal ışık kullanımı, mekân algısını büyütür ve yaşam kalitesini yükseltir.
    `.trim(),
    category: "Tasarım",
    tags: ["tasarım", "konut", "mimari"],
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
    .filter((p) => p.slug !== slug)
    .slice(0, limit);
}
