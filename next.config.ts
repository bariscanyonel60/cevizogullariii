import type { NextConfig } from "next";

const HTML_CACHE =
  "public, max-age=0, s-maxage=60, stale-while-revalidate=300, must-revalidate";
const STATIC_CACHE = "public, max-age=31536000, immutable";
const PRIVATE_NO_STORE =
  "private, no-store, max-age=0, must-revalidate";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Hostinger hcdn, Next'in varsayilan s-maxage=31536000 degerini 1 yil HTML
  // olarak tutuyor. Eski HTML eski CSS/JS hash'ine baglaninca sayfa stilsiz kaliyor.
  expireTime: 300,
  async headers() {
    const routeHeaders = [
      {
        source: "/:path*",
        headers: [{ key: "Cache-Control", value: HTML_CACHE }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: PRIVATE_NO_STORE }],
      },
      {
        source: "/admin",
        headers: [{ key: "Cache-Control", value: PRIVATE_NO_STORE }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: PRIVATE_NO_STORE }],
      },
    ];
    if (process.env.NODE_ENV === "production") {
      routeHeaders.push({
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
      });
    }
    return routeHeaders;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ymm7xvz0/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["exceljs", "pdfkit", "mysql2"],
  outputFileTracingIncludes: {
    "/api/admin/accounting/report": [
      "./src/lib/fonts/DejaVuSans.ttf",
      "./src/lib/fonts/logo.png",
    ],
    "/api/admin/accounting/section-pdf": [
      "./src/lib/fonts/DejaVuSans.ttf",
      "./src/lib/fonts/logo.png",
    ],
    "/api/admin/accounting/customer-pdf": [
      "./src/lib/fonts/DejaVuSans.ttf",
      "./src/lib/fonts/logo.png",
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.cevizogullari.com" }],
        destination: "https://cevizogullari.com/",
        statusCode: 301,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "www.cevizogullari.com" }],
        destination: "https://cevizogullari.com/:path+",
        statusCode: 301,
      },
      {
        source: "/urunler",
        destination: "/yapi-malzemeleri",
        statusCode: 301,
      },
      {
        source: "/urunler/:path*",
        destination: "/yapi-malzemeleri/:path*",
        statusCode: 301,
      },
      {
        source: "/yapi-malzemeleri/polisan-dis-cephe-boyasi",
        destination: "/yapi-malzemeleri/permolit-dis-cephe-boyasi",
        permanent: true,
      },
      {
        source: "/yapi-malzemeleri/polisan-dis-cephe-astari",
        destination: "/yapi-malzemeleri/permolit-astar",
        permanent: true,
      },
      {
        source: "/yapi-malzemeleri/polisan-ic-cephe-boyasi",
        destination: "/yapi-malzemeleri/permolit-ic-cephe-boyasi",
        permanent: true,
      },
      {
        source: "/urunler/polisan-dis-cephe-boyasi",
        destination: "/yapi-malzemeleri/permolit-dis-cephe-boyasi",
        permanent: true,
      },
      {
        source: "/urunler/polisan-dis-cephe-astari",
        destination: "/yapi-malzemeleri/permolit-astar",
        permanent: true,
      },
      {
        source: "/urunler/polisan-ic-cephe-boyasi",
        destination: "/yapi-malzemeleri/permolit-ic-cephe-boyasi",
        permanent: true,
      },
      {
        source: "/kereste",
        destination: "/orman-urunleri",
        permanent: true,
      },
      {
        source: "/kereste/:path*",
        destination: "/orman-urunleri",
        permanent: true,
      },
      {
        source: "/gayrimenkul",
        destination: "/yapi-insaat",
        permanent: true,
      },
      {
        source: "/gayrimenkul/:path*",
        destination: "/yapi-insaat",
        permanent: true,
      },
      {
        source: "/projelerimiz/modern-konut-kompleksi",
        destination: "/projelerimiz/ova-apartmani-2",
        permanent: true,
      },
      {
        source: "/projelerimiz/dis-cephe-uygulama-turhal",
        destination: "/projelerimiz/ova-apt-dis-cephe",
        permanent: true,
      },
      {
        source: "/projelerimiz/santiye-malzeme-tedarik",
        destination: "/projelerimiz/kaba-insaat-santiye",
        permanent: true,
      },
      {
        source: "/projelerimiz/cati-ve-yalitim",
        destination: "/projelerimiz/gece-cephe-aydinlatma",
        permanent: true,
      },
      {
        source: "/projelerimiz/konut-tadilat-destegi",
        destination: "/projelerimiz/ic-kapi-ince-is",
        permanent: true,
      },
      {
        source: "/projelerimiz/depo-ve-saha-calismalari",
        destination: "/projelerimiz/satilik-daire-projesi",
        permanent: true,
      },
      {
        source: "/yapi-insaat/:slug([^./]+)",
        destination: "/yapi-insaat",
        permanent: true,
      },
      {
        source: "/orman-urunleri/orman-urunleri",
        destination: "/orman-urunleri/turler",
        permanent: true,
      },
      {
        source: "/blog/2026-gayrimenkul-yatirim-trendleri",
        destination: "/blog/2026-tokat-yapi-insaat-ve-yalitim-trendleri",
        permanent: true,
      },
      {
        source: "/blog/premium-konutlarda-tasarim-dili",
        destination: "/blog/dis-cephe-boya-ve-mantolama-uyumu",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
