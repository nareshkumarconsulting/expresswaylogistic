import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plane, Ship } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { INDUSTRIES } from "@/constants/content";
import { getRouteBySlug, ROUTES } from "@/constants/geography";
import { SERVICES } from "@/constants/services";
import { CORE_INTENT_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ROUTES.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return { title: "Route not found" };
  return pageSeo({
    title: route.seoTitle,
    description: route.seoDescription,
    path: `/shipping-routes/${route.slug}`,
  });
}

export default async function RoutePage({ params }: Props) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Shipping routes", path: "/shipping-routes" },
    { name: `India to ${route.destination}`, path: `/shipping-routes/${route.slug}` },
  ];

  const faqs = [
    {
      question: `How can I ship cargo from India to ${route.destination}?`,
      answer: route.directAnswer,
    },
    CORE_INTENT_FAQS[4],
    {
      question: "Do you publish a fixed transit time for this corridor?",
      answer:
        "No. Indicative transit times vary based on origin, destination, carrier, sailing schedule, customs and operational conditions.",
    },
  ];

  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Shipping routes"
        title={`India to ${route.destination}`}
        accent="freight forwarding"
        description={route.body}
        backHref="/shipping-routes"
        backLabel="All routes"
        breadcrumbs={crumbs}
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              This corridor
            </p>
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-center gap-3">
                <Ship className="size-4 text-accent" />
                Ocean FCL / LCL / consolidation
              </li>
              <li className="flex items-center gap-3">
                <Plane className="size-4 text-accent" />
                Air when the cargo cannot wait
              </li>
              <li>
                Destination: {route.destination}, {route.destinationCountry}
              </li>
            </ul>
          </div>
        }
      />

      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock text={route.directAnswer} />
          <div className="grid gap-4 md:grid-cols-2">
            <ArticlePanel title="Origin locations">
              <p className="leading-relaxed text-slate-600">
                Origins across India through the nationwide logistics network —
                inland pickup, port and airport connectivity. Noida is headquarters,
                not the only origin.
              </p>
            </ArticlePanel>
            <ArticlePanel title="Destination">
              <p className="leading-relaxed text-slate-600">
                {route.destination}, {route.destinationCountry}. ExpressWay does not
                claim a physical office in the destination country.
              </p>
            </ArticlePanel>
            <ArticlePanel title="Ocean, air, FCL and LCL">
              <p className="leading-relaxed text-slate-600">{route.body}</p>
            </ArticlePanel>
            <ArticlePanel title="Quote process">
              <p className="leading-relaxed text-slate-600">
                Share origin city, destination, cargo type, weight or volume, and
                whether pickup, door delivery or insurance is required.
              </p>
            </ArticlePanel>
          </div>
        </div>
      </section>

      <RelatedLinks
        services={route.relatedServiceIds
          .map((id) => SERVICES.find((service) => service.id === id))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .map((service) => ({ href: service.href, label: service.title }))}
        industries={route.relatedIndustrySlugs
          .map((industrySlug) => INDUSTRIES.find((industry) => industry.slug === industrySlug))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .map((industry) => ({
            href: `/industries/${industry.slug}`,
            label: industry.name,
          }))}
      />
      <PageAeo answers={faqs} faqs={faqs} breadcrumbs={crumbs} />
      <QuoteCtaBand />
    </div>
  );
}
