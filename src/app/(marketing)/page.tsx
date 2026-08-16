import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { preload } from "react-dom";
import { HeroSection } from "@/components/organisms/hero-section";
import { ConsultingCtaSection } from "@/components/organisms/consulting-cta-section";
import { PageAeo } from "@/components/organisms/page-aeo";
import { JsonLd } from "@/components/molecules/json-ld";
import { CORE_INTENT_FAQS, HOME_SUPPORTING_FAQS } from "@/constants/faqs";
import { servicesItemListSchema, websiteSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} | ${siteConfig.tagline}`,
  },
  description:
    "Neutral NVOCC freight forwarding from India: ocean and air, customs, door-to-door, and EXIM docs. Ship India to Dubai and worldwide — request a quote for cost; typical reply within two business hours.",
  alternates: { canonical: "/" },
};

const AboutSection = dynamic(() =>
  import("@/components/organisms/about-section").then((mod) => mod.AboutSection),
);
const ServicesSection = dynamic(() =>
  import("@/components/organisms/services-section").then(
    (mod) => mod.ServicesSection,
  ),
);
const IndustriesSection = dynamic(() =>
  import("@/components/organisms/industries-section").then(
    (mod) => mod.IndustriesSection,
  ),
);
const WhyChooseUsSection = dynamic(() =>
  import("@/components/organisms/why-choose-us-section").then(
    (mod) => mod.WhyChooseUsSection,
  ),
);
const ProcessSection = dynamic(() =>
  import("@/components/organisms/process-section").then(
    (mod) => mod.ProcessSection,
  ),
);
const GlobalReachSection = dynamic(() =>
  import("@/components/organisms/global-reach-section").then(
    (mod) => mod.GlobalReachSection,
  ),
);
const StatisticsSection = dynamic(() =>
  import("@/components/organisms/statistics-section").then(
    (mod) => mod.StatisticsSection,
  ),
);
const TestimonialsSection = dynamic(() =>
  import("@/components/organisms/testimonials-section").then(
    (mod) => mod.TestimonialsSection,
  ),
);

export default function HomePage() {
  preload("/images/hero-banner-750.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    imageSrcSet:
      "/images/hero-banner-750.webp 750w, /images/hero-banner-1280.webp 1280w",
    imageSizes: "(min-width: 768px) 62vw, 78vw",
  });

  return (
    <>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={servicesItemListSchema()} />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <IndustriesSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <GlobalReachSection />
      <StatisticsSection />
      <TestimonialsSection />
      <ConsultingCtaSection />
      <PageAeo
        answers={CORE_INTENT_FAQS}
        faqs={HOME_SUPPORTING_FAQS}
        breadcrumbs={[{ name: "Home", path: "/" }]}
        answerTitle="Answers to common freight queries"
        answerDescription="Direct answers on services, India–Dubai shipping, export documents, who can handle your export, and how freight cost is quoted."
        faqTitle="More frequently asked questions"
      />
    </>
  );
}
