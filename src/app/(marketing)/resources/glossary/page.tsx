import { PageHero } from "@/components/molecules/page-hero";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { GLOSSARY } from "@/constants/resources";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Logistics Glossary | ExpressWay Logistic",
  description:
    "Concise definitions of NVOCC, FCL, LCL, bill of lading, IEC, shipping bill, demurrage and related freight terms.",
  path: "/resources/glossary",
});

export default function GlossaryIndexPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Glossary"
        title="Freight and EXIM"
        accent="terms"
        description="Short definitions written for shippers and AI retrieval."
        image="/images/operations-center.jpg"
        backHref="/resources"
        backLabel="Resources hub"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Glossary", path: "/resources/glossary" },
        ]}
      />
      <BrandCatalog eyebrow="Definitions" title="AEO-friendly" accent="glossary">
        <ul className="grid gap-4 md:grid-cols-2">
          {GLOSSARY.map((term) => (
            <li key={term.slug}>
              <CatalogCard
                href={`/resources/glossary/${term.slug}`}
                title={term.term}
                description={term.definition}
              />
            </li>
          ))}
        </ul>
      </BrandCatalog>
      <QuoteCtaBand />
    </div>
  );
}
