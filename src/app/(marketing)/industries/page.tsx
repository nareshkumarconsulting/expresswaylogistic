import { INDUSTRIES } from "@/constants/content";
import { INDUSTRIES_PAGE_FAQS } from "@/constants/faqs";
import { IndustriesCatalog } from "@/features/industries/components/industries-catalog";
import { IndustriesHero } from "@/features/industries/components/industries-hero";
import { PageAeo } from "@/components/organisms/page-aeo";
import { pageSeo } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = pageSeo({
  title: "Industries We Serve | ExpressWay Logistic",
  description:
    "Garments, pharma, engineering, project machinery, bulk and chemicals — PAN India freight forwarding matched to the cargo Indian EXIM actually ships.",
  path: "/industries",
});

const industryListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Industries served by ExpressWay Logistic",
  url: `${siteConfig.url}/industries`,
  itemListElement: INDUSTRIES.map((industry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteConfig.url}/industries/${industry.slug}`,
  })),
};

export default function IndustriesPage() {
  return (
    <div className="bg-surface">
      <IndustriesHero />
      <IndustriesCatalog />
      <PageAeo
        answers={INDUSTRIES_PAGE_FAQS}
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
