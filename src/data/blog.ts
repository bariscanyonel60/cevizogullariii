import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "2026-tokat-yapi-insaat-ve-yalitim-trendleri",
    title: "2026 Tokat Yapı-İnşaat & Yalıtım Trendleri",
    excerpt:
      "Tokat ve Turhal’da enerji verimli cepheler, doğru mantolama ve şantiye malzemesi seçimi 2026 yapı-inşaat gündemini nasıl şekillendiriyor?",
    content: `
## Giriş

2026’da Tokat ve Turhal’daki yapı-inşaat işleri; enerji verimliliği, deprem bilinci ve doğru malzeme tedariki etrafında şekilleniyor. Konut veya tadilat fark etmeksizin mantolama, boya ve yalıtım seçimi uzun vadeli konforu belirler.

## Enerji Verimli Cepheler

Doğru EPS / XPS kalınlığı, dış cephe boyası ve sıva sistemi hem ısı kaybını azaltır hem bakım aralığını uzatır. Turhal’daki stoklu ürünlerle şantiye temposuna uygun tedarik mümkündür.

## Bölgesel Uygulama: Tokat İlçeleri

Erbaa, Niksar, Zile ve Pazar’daki konut ve tadilat projelerinde malzeme seçimi yerel iklim ve uygulama koşullarına göre yapılmalıdır. Cevizoğulları Yapı Market & İnşaat, Turhal merkezli danışmanlık ve tedarik sunar.

## Sonuç

Doğru yalıtım, şeffaf süreç ve yerinde ürün yönlendirmesi ile Tokat yapı-inşaat işleri daha güvenli ve verimli ilerler.
    `.trim(),
    category: "Yapı - İnşaat",
    tags: ["yalıtım", "mantolama", "2026", "Tokat", "Turhal"],
    coverImage: "/projects/modern-konut-cephe.jpg",
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
    coverImage: "/products/boya-rulo.jpg",
    author: "Cevizoğulları Editör",
    publishedAt: "2026-02-20",
    readingTime: 5,
  },
  {
    id: "3",
    slug: "dis-cephe-boya-ve-mantolama-uyumu",
    title: "Dış Cephe Boya & Mantolama Uyumu · Yerel Uygulama",
    excerpt:
      "Tokat ve Turhal’da cephe boyası, astar ve yalıtım birlikte planlandığında görünüm ile enerji performansı nasıl yükselir?",
    content: `
## Sistem Olarak Düşünmek

Dış cephede boya tek başına yetmez; astar, yalıtım levhası, file, dübel ve sıva birlikte çalışır. Turhal’da Permolit ve yalıtım ürünleriyle sistem bütünlüğü sağlanır.

## Işık, Oran ve Cephe

Doğru renk ve yüzey dokusu, mantolama detayıyla birleşince cephe hem estetik hem dayanıklı olur. Tokat ikliminde UV ve nem dayanımı kritik seçim kriteridir.

## Sonuç

Cephe dili; doğru yapı malzemesi ve yerel uygulama bilgisiyle tamamlanır. Cevizoğulları Yapı Market bu süreci destekler.
    `.trim(),
    category: "Dış Cephe",
    tags: ["dış cephe", "boya", "mantolama", "Tokat", "Turhal"],
    coverImage: "/projects/modern-konut-bahce.jpg",
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
