import { PageHero } from "@/components/molecules/page-hero";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { GUIDES } from "@/constants/resources";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding Guides | ExpressWay Logistic",
  description:
    "Practical guides on freight forwarding, Neutral Logistics Provider, FCL vs LCL, export and import processes, documentation and freight cost.",
  path: "/resources/guides",
});

export default function GuidesIndexPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Guides"
        title="Freight forwarding"
        accent="guides"
        description="Each article links to the relevant ExpressWay service page."
        image="/images/operations-center.jpg"
        backHref="/resources"
        backLabel="Resources hub"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Guides", path: "/resources/guides" },
        ]}
      />
      <BrandCatalog
        eyebrow="Library"
        title="Practical EXIM"
        accent="explainers"
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <CatalogCard
                href={`/resources/guides/${guide.slug}`}
                title={guide.title}
                description={guide.directAnswer}
              />
            </li>
          ))}
        </ul>
      </BrandCatalog>
      <QuoteCtaBand />
    </div>
  );
}
