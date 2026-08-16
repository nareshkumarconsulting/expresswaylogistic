import { siteConfig } from "@/config/site";
import { LEADERS } from "@/constants/content";
import type { FaqItem } from "@/constants/faqs";
import type { ServiceItem } from "@/constants/services";
import { SERVICES } from "@/constants/services";
import {
  HQ_COUNTRY,
  HQ_LOCALITY,
  HQ_POSTAL_CODE,
  HQ_REGION,
  HQ_STREET,
} from "@/constants/entity";

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;

export function uniqueFaqs(...groups: readonly (readonly FaqItem[])[]): FaqItem[] {
  const seen = new Set<string>();
  const out: FaqItem[] = [];
  for (const group of groups) {
    for (const item of group) {
      if (seen.has(item.question)) continue;
      seen.add(item.question);
      out.push(item);
    }
  }
  return out;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/expressway-logo.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: HQ_STREET,
      addressLocality: HQ_LOCALITY,
      addressRegion: HQ_REGION,
      postalCode: HQ_POSTAL_CODE,
      addressCountry: HQ_COUNTRY,
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      "Worldwide",
    ],
    knowsAbout: [
      "NVOCC",
      "Freight forwarding",
      "Ocean freight",
      "Air freight",
      "Customs clearance",
      "EXIM documentation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function webPageSchema(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path === "/" ? "/" : input.path}`,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": ORGANIZATION_ID },
  };
}

export function personSchema() {
  return LEADERS.map((leader) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: leader.name,
    jobTitle: leader.title,
    worksFor: { "@id": ORGANIZATION_ID },
    image: `${siteConfig.url}${leader.image}`,
  }));
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function servicesItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ExpressWay Logistic freight forwarding services",
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}${service.href}`,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: [
          { "@type": "Country", name: "India" },
          "Worldwide",
        ],
        serviceType: "Freight forwarding",
      },
    })),
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: readonly { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function serviceSchema(service: ServiceItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.details,
    url: `${siteConfig.url}${service.href}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: [
      { "@type": "Country", name: "India" },
      "Worldwide",
    ],
    serviceType: service.title,
    brand: { "@id": ORGANIZATION_ID },
  };
}

export function howToProcessSchema(
  steps: readonly { title: string; detail: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to ship cargo internationally with ExpressWay Logistic",
    description:
      "Quote, booking and documents, pickup, customs, and delivery when those steps are in scope.",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.detail,
    })),
  };
}
