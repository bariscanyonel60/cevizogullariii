import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cevizogullari.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
