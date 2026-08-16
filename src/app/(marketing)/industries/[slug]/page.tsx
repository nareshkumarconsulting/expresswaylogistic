import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { getIndustryBySlug, INDUSTRIES } from "@/constants/content";
import { ROUTES } from "@/constants/geography";
import { SERVICES } from "@/constants/services";
import { INDUSTRIES_PAGE_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return { title: "Industry not found" };
  return pageSeo({
    title: `${industry.name} Logistics & Freight Forwarding | ExpressWay Logistic`,
    description: industry.detail,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: industry.name, path: `/industries/${industry.slug}` },
  ];
  const serviceLinks = SERVICES.slice(0, 4).map((service) => ({
    href: service.href,
    label: service.title,
  }));
  const routeLinks = ROUTES.slice(0, 4).map((route) => ({
    href: `/shipping-routes/${route.slug}`,
    label: `India to ${route.destination}`,
  }));

  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Industries"
        title={`${industry.name} logistics`}
        accent="& freight forwarding"
        description={industry.description}
        image={industry.image ?? "/images/hero-banner-1280.webp"}
        backHref="/industries"
        backLabel="All industries"
        breadcrumbs={crumbs}
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-3 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              Focus
            </p>
            <p className="text-sm leading-relaxed text-white/85">{industry.focus}</p>
          </div>
        }
      />

      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock
            text={`ExpressWay Logistic handles ${industry.name.toLowerCase()} as part of PAN India freight forwarding to worldwide destinations. ${industry.detail}`}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <ArticlePanel title="Industry challenges">
              <p className="leading-relaxed text-slate-600">{industry.detail}</p>
            </ArticlePanel>
            <ArticlePanel title="Cargo types">
              <p className="leading-relaxed text-slate-600">{industry.description}</p>
            </ArticlePanel>
            <ArticlePanel title="Recommended modes">
              <p className="leading-relaxed text-slate-600">
                Ocean freight (FCL/LCL/consolidation) is typical for commercial
                volume. Air freight is used when the buyer window or product cannot
                wait for a sailing. Mode is confirmed on the quote.
              </p>
            </ArticlePanel>
            <ArticlePanel title="Documentation and customs">
              <p className="leading-relaxed text-slate-600">
                Filings must match the actual commodity. Customs documentation and
                requirements vary by origin, destination and regulation. Customers
                should verify current requirements for their shipment.
              </p>
            </ArticlePanel>
          </div>
          <ArticlePanel title="PAN India and worldwide">
            <p className="leading-relaxed text-slate-600">
              Serving customers across India through a nationwide logistics network,
              connecting Indian origins with worldwide destinations. Focus for this
              industry: {industry.focus}.
            </p>
          </ArticlePanel>
        </div>
      </section>

      <RelatedLinks services={serviceLinks} routes={routeLinks} />
      <PageAeo
        answers={INDUSTRIES_PAGE_FAQS}
        faqs={INDUSTRIES_PAGE_FAQS}
        breadcrumbs={crumbs}
      />
      <QuoteCtaBand />
    </div>
  );
}
