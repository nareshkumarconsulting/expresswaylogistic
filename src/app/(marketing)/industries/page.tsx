import type { Metadata } from "next";
import { INDUSTRIES } from "@/constants/content";
import { CORE_INTENT_FAQS, INDUSTRIES_PAGE_FAQS } from "@/constants/faqs";
import { IndustriesCatalog } from "@/features/industries/components/industries-catalog";
import { IndustriesHero } from "@/features/industries/components/industries-hero";
import { PageAeo } from "@/components/organisms/page-aeo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "ExpressWay Logistic moves leather, garments, pharma, handicrafts, engineering goods, project machinery, bulk, coastal cargo, chemicals, and more — with cargo-specific handling and EXIM documentation.",
  alternates: { canonical: "/industries" },
};

const industryListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Industries served by ExpressWay Logistic",
  url: `${siteConfig.url}/industries`,
  itemListElement: INDUSTRIES.map((industry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: industry.name,
    description: industry.detail,
  })),
};

export default function IndustriesPage() {
  return (
    <div className="bg-surface">
      <IndustriesHero />
      <IndustriesCatalog />
      <PageAeo
        answers={[CORE_INTENT_FAQS[3], INDUSTRIES_PAGE_FAQS[1], INDUSTRIES_PAGE_FAQS[2]]}
        faqs={INDUSTRIES_PAGE_FAQS}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ]}
        extraJsonLd={[industryListSchema]}
        answerTitle="Which forwarder for your export cargo"
        answerDescription="Cargo types ExpressWay handles and how project machinery, pharma, and chemicals are treated."
      />
    </div>
  );
}
