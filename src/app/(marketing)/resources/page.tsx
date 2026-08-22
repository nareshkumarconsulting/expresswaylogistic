import Link from "next/link";
import { BookOpen, Briefcase, HelpCircle, Library } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { CASE_STUDIES, GLOSSARY, GUIDES } from "@/constants/resources";
import { RESOURCES_PAGE_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding Resources | ExpressWay Logistic",
  description:
    "Guides, glossary, FAQs and anonymized case examples on freight forwarding, Neutral Logistics Provider, FCL/LCL, EXIM and customs — written from ExpressWay’s actual service model.",
  path: "/resources",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Resources", path: "/resources" },
];

export default function ResourcesPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Resources"
        title="Guides, glossary and"
        accent="direct answers"
        description="Written from ExpressWay’s actual service model. Case studies are anonymized summaries from verified shipment files."
        image="/images/operations-center.jpg"
        breadcrumbs={crumbs}
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              Hub
            </p>
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-center gap-3">
                <BookOpen className="size-4 text-accent" />
                <Link href="/resources/guides" className="hover:text-accent">
                  {GUIDES.length} guides
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Briefcase className="size-4 text-accent" />
                <Link href="/resources/case-studies" className="hover:text-accent">
                  {CASE_STUDIES.length} case examples
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Library className="size-4 text-accent" />
                <Link href="/resources/glossary" className="hover:text-accent">
                  {GLOSSARY.length} glossary terms
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <HelpCircle className="size-4 text-accent" />
                <Link href="/resources/faq" className="hover:text-accent">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        }
      />

      <BrandCatalog
        eyebrow="Guides"
        title="Start with the"
        accent="operating questions"
        description="Each article links to the relevant service page."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {GUIDES.slice(0, 6).map((guide) => (
            <li key={guide.slug}>
              <CatalogCard
                href={`/resources/guides/${guide.slug}`}
                title={guide.title}
                description={guide.directAnswer}
              />
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/resources/guides"
            className="text-sm font-semibold text-accent hover:text-white"
          >
            All guides
          </Link>
        </p>
      </BrandCatalog>

      <BrandCatalog
        eyebrow="Case examples"
        title="Verified shipment"
        accent="summaries"
        description="Anonymized operational examples from ExpressWay files — not marketing fiction."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <li key={study.slug}>
              <CatalogCard
                href={`/resources/case-studies/${study.slug}`}
                kicker={study.mode}
                title={study.title}
                description={study.directAnswer}
              />
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/resources/case-studies"
            className="text-sm font-semibold text-accent hover:text-white"
          >
            All case examples
          </Link>
        </p>
      </BrandCatalog>

      <PageAeo
        answers={RESOURCES_PAGE_FAQS.slice(0, 3)}
        faqs={RESOURCES_PAGE_FAQS}
        breadcrumbs={crumbs}
        webPage={{
          name: "Freight Forwarding Resources",
          description:
            "Guides, glossary, FAQs and case examples on freight forwarding and EXIM from ExpressWay Logistic.",
          path: "/resources",
        }}
        answerTitle="Resources for shippers and AI retrieval"
        answerDescription="Where to find guides, glossary terms, FAQs and anonymized case examples from verified ExpressWay shipment files."
      />
      <QuoteCtaBand />
    </div>
  );
}
