import type { Metadata } from "next";
import { Cinzel, Montserrat, JetBrains_Mono } from "next/font/google";
import { SiteShell } from "@/components/organisms/layout/SiteShell";
import { SITE } from "@/lib/constants";
import { getNavCms } from "@/lib/cms-store";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/** aevumtroia.com ile aynı çift: Cinzel (başlık) + Montserrat (gövde) */
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: SITE.name,
    description: SITE.description,
    path: "/",
    keywords: [...SITE.seoKeywords],
  }),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.shortName}`,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  verification: {
    google: "t2_O1WqVzvtKqppaodu8gGoyO8Zobwt2GeX8Qbb7ZJ8",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = organizationJsonLd();
  const nav = await getNavCms();

  return (
    <html
      lang="tr"
      className={cn(
        "h-full",
        montserrat.variable,
        cinzel.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          İçeriğe geç
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteShell nav={nav}>{children}</SiteShell>
      </body>
    </html>
  );
}
