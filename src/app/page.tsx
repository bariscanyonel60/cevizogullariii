import dynamic from "next/dynamic";
import { HeroSection } from "@/components/organisms/home/HeroSection";
import { AboutPreview } from "@/components/organisms/home/AboutPreview";
import { WhyUsSection } from "@/components/organisms/home/WhyUsSection";
import { ServicesSection } from "@/components/organisms/home/ServicesSection";
import { FeaturedListings } from "@/components/organisms/home/FeaturedListings";
import { FeaturedProjects } from "@/components/organisms/home/FeaturedProjects";
import { ProcessSection } from "@/components/organisms/home/ProcessSection";
import { BlogPreview } from "@/components/organisms/home/BlogPreview";
import { ContactCta } from "@/components/organisms/home/ContactCta";

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
      <HeroSection />
      <AboutPreview />
      <WhyUsSection />
      <ServicesSection />
      <FeaturedListings />
      <FeaturedProjects />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <BlogPreview />
      <ContactCta />
    </>
  );
}
