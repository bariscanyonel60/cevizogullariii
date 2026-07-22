import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { Footer } from "@/components/organisms/layout/Footer";
import { Navbar } from "@/components/organisms/layout/Navbar";
import { SmoothScrollProvider } from "@/components/organisms/shared/SmoothScrollProvider";
import { FloatingActions } from "@/components/organisms/shared/FloatingActions";
import { SITE } from "@/lib/constants";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

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
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = organizationJsonLd();

  return (
    <html
      lang="tr"
      className={`${montserrat.variable} ${cinzel.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
