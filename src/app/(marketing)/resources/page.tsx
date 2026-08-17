import Link from "next/link";
import { BookOpen, HelpCircle, Library } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { GUIDES, GLOSSARY } from "@/constants/resources";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding Resources | ExpressWay Logistic",
  description:
    "Guides, glossary and FAQs on freight forwarding, Neutral Logistics Provider, FCL/LCL, EXIM and customs — written from ExpressWay’s actual service model.",
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
        description="Written from ExpressWay’s actual service model. Case studies are published only when a verified file exists."
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
      <QuoteCtaBand />
    </div>
  );
}
