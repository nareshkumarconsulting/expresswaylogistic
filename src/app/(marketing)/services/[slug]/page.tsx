import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { PageBreadcrumbs } from "@/components/molecules/page-breadcrumbs";
import { ServiceCard } from "@/components/molecules/service-card";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { ServiceHero } from "@/features/services/components/service-hero";
import { siteConfig } from "@/config/site";
import { INDUSTRIES } from "@/constants/content";
import { ROUTES } from "@/constants/geography";
import { SERVICE_PAGES } from "@/constants/service-pages";
import {
  getServiceById,
  getServiceIds,
  SERVICES,
} from "@/constants/services";
import { getServiceFaqs } from "@/constants/faqs";
import { PageAeo } from "@/components/organisms/page-aeo";
import { serviceSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getServiceIds().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) {
    return { title: "Service not found" };
  }

  return pageSeo({
    title: `${service.title} in India | PAN India to Worldwide | ExpressWay Logistic`,
    description: service.description,
    path: service.href,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) notFound();

  const copy = SERVICE_PAGES[service.id];
  const related = (copy?.relatedServiceIds ?? [])
    .map((id) => SERVICES.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 4);
  const fallbackRelated = SERVICES.filter((item) => item.id !== service.id).slice(0, 3);
  const relatedCards = related.length > 0 ? related : fallbackRelated;
  const serviceFaqs = getServiceFaqs(service.id, service.title);
  const industryLinks = (copy?.relatedIndustrySlugs ?? [])
    .map((industrySlug) => INDUSTRIES.find((industry) => industry.slug === industrySlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((industry) => ({
      href: `/industries/${industry.slug}`,
      label: industry.name,
    }));
  const routeLinks = (copy?.relatedRouteIds ?? [])
    .map((routeId) => ROUTES.find((route) => route.slug === routeId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((route) => ({
      href: `/shipping-routes/${route.slug}`,
      label: `India to ${route.destination}`,
    }));

  return (
    <div className="bg-surface">
      <ServiceHero serviceId={service.id} />
      <PageBreadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: service.href },
        ]}
      />

      <section className="relative z-10 pt-8 pb-[var(--space-section)] md:pt-10">
        <div className="container-page">
          <div className="mb-10">
            <DirectAnswerBlock text={service.details} />
          </div>
          <div className="grid gap-10 lg:grid-cols-12">
            <article className="space-y-8 lg:col-span-8">
              {copy ? (
                <>
                  <Section title={`What is ${service.title}?`} body={copy.whatIs} />
                  <Section
                    title={`How ExpressWay provides ${service.title}`}
                    body={copy.howProvided}
                  />
                  <Section title="Who is this service for?" body={copy.whoFor} />
                  <Section title="Cargo types supported" body={copy.cargoTypes} />
                  <Section title="Import / Export" body={copy.importExport} />
                  <Section title="Ocean / Air" body={copy.oceanAir} />
                  <Section title="PAN India coverage" body={copy.panIndia} />
                  <Section title="Worldwide coverage" body={copy.worldwide} />
                  <Section title="Process" body={copy.process} />
                  <Section title="Documentation" body={copy.documentation} />
                  <Section title="Why ExpressWay" body={copy.whyExpressWay} />
                  <div className="border border-border bg-card p-6 md:p-8">
                    <Typography as="h2" variant="h3" className="mb-4 text-foreground">
                      Benefits
                    </Typography>
                    <ul className="grid gap-3">
                      {copy.benefits.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                          <span className="text-sm text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Section title="How this service works" body={service.details} />
              )}

              <div className="border border-border bg-card p-6 md:p-8">
                <Typography as="h2" variant="h3" className="mb-4 text-foreground">
                  What’s included
                </Typography>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border border-border bg-surface p-4"
                    >
                      <CheckCircle2
                        className="mt-0.5 size-5 shrink-0 text-accent"
                        aria-hidden
                      />
                      <span className="text-sm font-medium leading-relaxed text-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <aside className="space-y-6 lg:col-span-4">
              <div className="border border-border bg-card p-6 shadow-sm">
                <Typography as="h2" variant="h4" className="mb-2 text-foreground">
                  Need this service?
                </Typography>
                <Typography
                  variant="muted"
                  className="mb-5 text-sm text-muted-foreground"
                >
                  Share origin, destination and cargo. ExpressWay evaluates ocean,
                  air, FCL, LCL or consolidation options for that file.
                </Typography>
                <div className="flex flex-col gap-3">
                  <Button asChild rounded="none">
                    <Link href={siteConfig.cta.primary.href}>
                      Get a Quote
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" rounded="none">
                    <Link href="/appointment">Book an Appointment</Link>
                  </Button>
                  <Button asChild variant="outline" rounded="none">
                    <Link href="/pan-india-logistics">PAN India logistics</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-16">
            <Typography as="h2" variant="h3" className="mb-6 text-foreground">
              Related services
            </Typography>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedCards.map((item) => (
                <ServiceCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  href={item.href}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        industries={industryLinks}
        routes={routeLinks}
        extra={[
          {
            title: "Coverage",
            items: [
              { href: "/pan-india-logistics", label: "PAN India logistics" },
              { href: "/quote", label: "Request a quote" },
            ],
          },
        ]}
      />

      <PageAeo
        answers={serviceFaqs.slice(0, 4)}
        faqs={serviceFaqs}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: service.href },
        ]}
        extraJsonLd={[serviceSchema(service)]}
        answerTitle={`${service.title} — common questions`}
        answerDescription="Straight answers shippers typically ask before booking this service. Remaining questions are in the FAQ below."
        faqTitle={`${service.title} FAQ`}
        faqDescription="More questions on scope, documents, pricing and how this service is booked from India."
      />
      <QuoteCtaBand />
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border bg-card p-6 md:p-8">
      <Typography as="h2" variant="h3" className="mb-4 text-foreground">
        {title}
      </Typography>
      <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
