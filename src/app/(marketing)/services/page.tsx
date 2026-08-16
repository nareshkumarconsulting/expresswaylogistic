import type { Metadata } from "next";
import Link from "next/link";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { PageHero } from "@/components/molecules/page-hero";
import { ServiceCard } from "@/components/molecules/service-card";
import { siteConfig } from "@/config/site";
import { SERVICES } from "@/constants/services";
import { CORE_INTENT_FAQS, SERVICES_PAGE_FAQS } from "@/constants/faqs";
import { PageAeo } from "@/components/organisms/page-aeo";
import { servicesItemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Logistics Services",
  description:
    "Neutral NVOCC ocean and air freight, consolidation, customs clearance, warehousing, project cargo, cargo insurance, EXIM advisory, and door-to-door delivery from ExpressWay Logistic.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Services"
        title="Complete Logistics & EXIM Capabilities"
        description="From freight booking and consolidation to customs, warehousing, project cargo, and door-to-door delivery — ExpressWay Logistic is your neutral NVOCC partner."
      />

      <section className="relative z-10 -mt-8 pb-[var(--space-section)] md:-mt-10">
        <div className="container-page">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                href={service.href}
              />
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-border bg-card p-8 md:flex-row md:items-center">
            <div>
              <Typography as="h2" variant="h3" className="mb-2 text-foreground">
                Need a custom lane quote?
              </Typography>
              <Typography
                variant="muted"
                className="text-base text-muted-foreground"
              >
                Share cargo details and our team responds within 2 hours.
              </Typography>
            </div>
            <Button asChild size="lg" rounded="none">
              <Link href={siteConfig.cta.primary.href}>
                {siteConfig.cta.primary.label}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <PageAeo
        answers={[CORE_INTENT_FAQS[0], CORE_INTENT_FAQS[4], SERVICES_PAGE_FAQS[2]]}
        faqs={SERVICES_PAGE_FAQS}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        extraJsonLd={[servicesItemListSchema()]}
        answerTitle="Freight forwarding services, explained"
        answerDescription="What ExpressWay provides, how cost is quoted, and whether you can book a single service or a full door-to-door move."
      />
    </div>
  );
}
