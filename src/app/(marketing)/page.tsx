import Script from "next/script";
import { HeroSection } from "@/components/organisms/hero-section";
import { AboutSection } from "@/components/organisms/about-section";
import { ServicesSection } from "@/components/organisms/services-section";
import { IndustriesSection } from "@/components/organisms/industries-section";
import { WhyChooseUsSection } from "@/components/organisms/why-choose-us-section";
import { ProcessSection } from "@/components/organisms/process-section";
import { GlobalReachSection } from "@/components/organisms/global-reach-section";
import { StatisticsSection } from "@/components/organisms/statistics-section";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";
import { FaqSection } from "@/components/organisms/faq-section";
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
      <Script
        id="ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <Script
        id="ld-services"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

export default function HomePage() {
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
