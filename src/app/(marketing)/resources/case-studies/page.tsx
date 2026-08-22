import { PageHero } from "@/components/molecules/page-hero";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { CASE_STUDIES } from "@/constants/resources";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding Case Examples | ExpressWay Logistic",
  description:
    "Anonymized operational examples from verified ExpressWay shipment files — export, import and project cargo handled as a Neutral Logistics Provider.",
  path: "/resources/case-studies",
});

export default function CaseStudiesIndexPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Case examples"
        title="Verified shipment"
        accent="summaries"
        description="Anonymized operational examples from ExpressWay files. Client names and commercial values are omitted for privacy."
        image="/images/operations-center.jpg"
        backHref="/resources"
        backLabel="Resources hub"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Case studies", path: "/resources/case-studies" },
        ]}
      />
      <BrandCatalog
        eyebrow="Operations"
        title="How ExpressWay"
        accent="handles real files"
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <li key={study.slug}>
              <CatalogCard
                href={`/resources/case-studies/${study.slug}`}
                kicker={`${study.mode} · ${study.route}`}
                title={study.title}
                description={study.directAnswer}
              />
            </li>
          ))}
        </ul>
      </BrandCatalog>
      <QuoteCtaBand />
    </div>
  );
}
