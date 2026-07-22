import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/organisms/home/HeroSection";
import { BusinessAreasSection } from "@/components/organisms/home/BusinessAreasSection";
import { WhyUsSection } from "@/components/organisms/home/WhyUsSection";
import { ServicesSection } from "@/components/organisms/home/ServicesSection";
import { FeaturedListings } from "@/components/organisms/home/FeaturedListings";
import { FeaturedProjects } from "@/components/organisms/home/FeaturedProjects";
import { ProcessSection } from "@/components/organisms/home/ProcessSection";
import { BrandsMarquee } from "@/components/organisms/home/BrandsMarquee";
import { HomeLocalSeoSection } from "@/components/organisms/home/HomeLocalSeoSection";
import { HomeFaqSection } from "@/components/organisms/home/HomeFaqSection";
import { BlogPreview } from "@/components/organisms/home/BlogPreview";
import { ContactCta } from "@/components/organisms/home/ContactCta";
import { HOME_FAQS } from "@/lib/constants";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  buildMetadata,
  faqJsonLd,
  HOME_SEO,
  serviceJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  path: "/",
  image: "/og-default.jpg",
  keywords: [...HOME_SEO.keywords],
});

const StatsSection = dynamic(
  () =>
    import("@/components/organisms/home/StatsSection").then(
      (m) => m.StatsSection,
    ),
  { ssr: true },
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/organisms/home/TestimonialsSection").then(
      (m) => m.TestimonialsSection,
    ),
  { ssr: true },
);

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteJsonLd(), serviceJsonLd(), faqJsonLd(HOME_FAQS)]} />

      <HeroSection />
      <StatsSection />
      <BusinessAreasSection />
      <WhyUsSection />
      <ProcessSection />
      <ServicesSection />
      <FeaturedListings />
      <FeaturedProjects />
      <BrandsMarquee />
      <TestimonialsSection />
      <HomeLocalSeoSection />
      <HomeFaqSection />
      <BlogPreview />
      <ContactCta />
    </>
  );
}
