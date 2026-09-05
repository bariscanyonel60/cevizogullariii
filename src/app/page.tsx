import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/organisms/home/HeroSection";
import { BusinessAreasSection } from "@/components/organisms/home/BusinessAreasSection";
import { WhyUsSection } from "@/components/organisms/home/WhyUsSection";
import { ServicesSection } from "@/components/organisms/home/ServicesSection";
import { FeaturedProducts } from "@/components/organisms/home/FeaturedProducts";
import { FeaturedProjects } from "@/components/organisms/home/FeaturedProjects";
import { ProcessSection } from "@/components/organisms/home/ProcessSection";
import { BrandsMarquee } from "@/components/organisms/home/BrandsMarquee";
import { HomeLocalSeoSection } from "@/components/organisms/home/HomeLocalSeoSection";
import { HomeFaqSection } from "@/components/organisms/home/HomeFaqSection";
import { BlogPreview } from "@/components/organisms/home/BlogPreview";
import { ContactCta } from "@/components/organisms/home/ContactCta";
import { ProjectWallSection } from "@/components/organisms/home/ProjectWallSection";
import { pickPreviewMedia } from "@/lib/media";
import { getPublicMedia } from "@/lib/media-store";
import { getCmsSnapshot, getFeaturedProjects } from "@/lib/cms-store";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  buildMetadata,
  faqJsonLd,
  HOME_SEO,
  serviceJsonLd,
  videoObjectJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  path: "/",
  image: "/og-default.jpg",
  keywords: [...HOME_SEO.keywords],
});

/** Galeri Blobs/local güncellemelerinin görünmesi için */
export const revalidate = 60;

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

export default async function HomePage() {
  const [gallery, yapiInsaat, cms, featuredProjects] = await Promise.all([
    getPublicMedia("gallery"),
    getPublicMedia("yapi-insaat"),
    getCmsSnapshot(),
    getFeaturedProjects(),
  ]);
  const wallItems = pickPreviewMedia(
    [...gallery.items, ...yapiInsaat.items],
    6,
  );
  const homeFaqs = (cms.faqs ?? []).filter((item) => item.page === "home");
  const whyUs = (cms.cards ?? []).filter((item) => item.kind === "why_us");
  const services = (cms.cards ?? [])
    .filter((item) => item.kind === "services")
    .map((item) => ({
      title: item.title,
      description: item.description,
      href: item.href || "/teklif-al",
    }));
  const processSteps = (cms.cards ?? [])
    .filter((item) => item.kind === "process")
    .map((item, index) => ({
      step: item.step || String(index + 1).padStart(2, "0"),
      title: item.title,
      description: item.description,
    }));
  const featuredProducts = (cms.products ?? []).filter((item) => item.featured);

  return (
    <>
      <JsonLd
        data={[
          websiteJsonLd(),
          serviceJsonLd(),
          videoObjectJsonLd(),
          faqJsonLd(homeFaqs),
        ]}
      />

      <HeroSection />
      <StatsSection stats={cms.stats} />
      <BusinessAreasSection />
      <WhyUsSection items={whyUs} />
      <ProcessSection steps={processSteps} />
      <ServicesSection services={services} />
      <FeaturedProducts products={featuredProducts} />
      <FeaturedProjects projects={featuredProjects} />
      <ProjectWallSection items={wallItems} />
      <BrandsMarquee brands={cms.brands} />
      <TestimonialsSection testimonials={cms.testimonials} />
      <HomeLocalSeoSection />
      <HomeFaqSection faqs={homeFaqs} />
      <BlogPreview posts={cms.posts} />
      <ContactCta />
    </>
  );
}
