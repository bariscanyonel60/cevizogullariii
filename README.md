# Cevizoğulları Yapı Market & İnşaat

Tokat / Turhal merkezli kurumsal web sitesi — yapı market, orman ürünleri ve yapı-inşaat. Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lenis. Deploy: **Vercel**.

## Geliştirme

```bash
npm install
npm run dev
```

Yerel adres: `http://127.0.0.1:3000`

## Yapı

Atomic Design klasör mimarisi:

- `src/components/atoms` — temel UI
- `src/components/molecules` — birleşik bileşenler
- `src/components/organisms` — sayfa bölümleri
- `src/data` — içerik
- `src/app` — App Router sayfaları

## Scripts

- `npm run dev` — geliştirme sunucusu
- `npm run build` — production build
- `npm run start` — production sunucu
- `npm run lint` — ESLint
- `npm run smoke` — IA / SEO / a11y regresyon kontrolleri
- `npm run media:backup` — `public/` görsellerini Cloudinary’ye yedekler

## Vercel deploy

1. Repo’yu Vercel’e bağlayın (`vercel link` veya Dashboard → Import)
2. Storage → **Blob** store oluşturun; `BLOB_READ_WRITE_TOKEN` otomatik eklenir
3. Environment Variables’a şunları ekleyin (Production + Preview):
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (opsiyonel CDN için)
4. Deploy edin

Yerel secret’ları çekmek için: `vercel env pull .env.local --yes`

## Yönetici paneli (`/admin`)

Galeri (ana sayfa) ve Yapı-İnşaat görsellerini yönetmek, günlük satış / personel avansı / veresiye kartlarını tutmak için:

1. `.env.local` içine `ADMIN_USERNAME`, `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` ekleyin (bkz. `.env.example`)
2. Cloudinary env’lerinin dolu olduğundan emin olun
3. `http://127.0.0.1:3000/admin` → kullanıcı adı + şifre ile giriş
4. Production’da görsel metadata **Vercel Blob** (`media/*.json`) içinde saklanır; local’de `BLOB_READ_WRITE_TOKEN` yoksa `.data/media-store.json` fallback kullanılır
5. Ön muhasebe kayıtları sitede görünmez. Production’da özel (private) Blob (`accounting/ledger.json`) kullanılır; gerekirse `ADMIN_SESSION_SECRET` ile şifrelenmiş yedek yazılır. Local’de `.data/accounting-store.json`

Panelden birden fazla görsel yüklenebilir; başlık ve alt metin düzenlenebilir,
görseller sıralanabilir, geçici olarak gizlenebilir veya onay sonrasında kalıcı
olarak Cloudinary’den silinebilir.

**Ön muhasebe:** günlük satış (ürün, KDV, nakit/kart), personel kasadan avans,
müşteri veresiye kartı (ad, soyad, T.C., adres, telefon, alınan ürün, tarih, tutar, tahsilat).
**Aylık rapor** sekmesinden seçilen ay Excel (`.xlsx`) veya PDF olarak indirilir.
Bu bölüm Navbar, sitemap ve public API’de yoktur.

## Cloudinary (görsel yedek)

1. `.env.example` → `.env.local` kopyalayın; API key/secret doldurun
2. `npm run media:backup` — yükleme sonrası `src/data/cloudinary-backup.json` oluşur
3. `NEXT_PUBLIC_USE_CLOUDINARY=true` iken `CdnImage` / `mediaUrl()` görselleri Cloudinary’den sunar (`f_auto,q_auto`). Kapatınca yerel `/public` kullanılır.

**Güvenlik:** API secret ve admin şifresini asla commit etmeyin.
