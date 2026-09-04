import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { HeroSection } from "@/components/organisms/hero-section";
import { ConsultingCtaSection } from "@/components/organisms/consulting-cta-section";
import { PageAeo } from "@/components/organisms/page-aeo";
import { PanIndiaNetworkSection } from "@/components/organisms/pan-india-network-section";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { JsonLd } from "@/components/molecules/json-ld";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { HOME_SUPPORTING_FAQS } from "@/constants/faqs";
import { ENTITY_STATEMENT } from "@/constants/entity";
import { siteConfig } from "@/config/site";
import { servicesItemListSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding & Neutral Logistics | ExpressWay Logistic",
  description:
    "ExpressWay Logistic is a Neutral Logistics Provider for PAN India freight forwarding — ocean, air, customs, EXIM advisory, and door-to-door worldwide.",
  path: "/",
});

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

export default function HomePage() {
  preload("/images/hero-banner-750.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    imageSrcSet:
      "/images/hero-banner-750.webp 750w, /images/hero-banner-1280.webp 1280w",
    imageSizes: "(min-width: 768px) 62vw, 70vw",
  });

  return (
    <>
      <JsonLd data={servicesItemListSchema()} />
      <HeroSection />
      <section className="bg-surface py-10">
        <div className="container-page">
          <DirectAnswerBlock text={ENTITY_STATEMENT} />
        </div>
      </section>
      <ServicesSection />
      <IndustriesSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <PanIndiaNetworkSection />
      <GlobalReachSection />
      <StatisticsSection />
      <AboutSection />
      <PageAeo
        answers={HOME_SUPPORTING_FAQS}
        faqs={HOME_SUPPORTING_FAQS}
        breadcrumbs={[{ name: "Home", path: "/" }]}
        webPage={{
          name: "International Freight Forwarding & Neutral Logistics Provider in India",
          description: siteConfig.description,
          path: "/",
        }}
        answerTitle="Answers to Common Freight Questions"
        answerDescription="Visible answers on what ExpressWay does, cargo types, tracking, quotes, EXIM support, PAN India coverage, ports, door-to-door, import/export and pricing."
        faqTitle="More frequently asked questions"
      />
      <QuoteCtaBand />
      <ConsultingCtaSection />
    </>
  );
}
