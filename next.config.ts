import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Hostinger CDN (hcdn) Next.js ISR `stale-while-revalidate` degerini yoksa ~1 yil
  // tutuyor. Yeni deploy sonrasi eski HTML eski CSS/JS hash'lerine baglaniyor.
  expireTime: 300,
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
    "/api/admin/accounting/report": ["./src/lib/fonts/DejaVuSans.ttf"],
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
