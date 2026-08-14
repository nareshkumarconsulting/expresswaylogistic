import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { HeroSection } from "@/components/organisms/hero-section";
import { siteConfig } from "@/config/site";
import { FAQ_ITEMS } from "@/constants/content";
import { SERVICES } from "@/constants/services";

function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/expressway-logo.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201305",
      addressCountry: "IN",
    },
    sameAs: Object.values(siteConfig.social),
  };

  const services = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
        },
        areaServed: "Worldwide",
      },
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/track?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

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
const FaqSection = dynamic(() =>
  import("@/components/organisms/faq-section").then((mod) => mod.FaqSection),
);

export default function HomePage() {
  preload("/images/hero-port-750.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    imageSrcSet:
      "/images/hero-port-750.webp 750w, /images/hero-port-1280.webp 1280w",
    imageSizes: "100vw",
  });

  return (
    <>
      <JsonLd />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <IndustriesSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <GlobalReachSection />
      <StatisticsSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
