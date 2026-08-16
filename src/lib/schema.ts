import { siteConfig } from "@/config/site";
import type { FaqItem } from "@/constants/faqs";
import type { ServiceItem } from "@/constants/services";
import { SERVICES } from "@/constants/services";

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
      streetAddress:
        "Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201305",
      addressCountry: "IN",
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "NVOCC",
      "International freight forwarding",
      "Ocean freight",
      "Air freight",
      "Customs clearance",
      "EXIM documentation",
    ],
    sameAs: Object.values(siteConfig.social),
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/track?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
        areaServed: "Worldwide",
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
    areaServed: "Worldwide",
    serviceType: "Freight forwarding",
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
      "Five steps from quote to door delivery with one dedicated NVOCC team.",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.detail,
    })),
  };
}
