import { PageHero } from "@/components/molecules/page-hero";
import { ServiceCard } from "@/components/molecules/service-card";
import { PageAeo } from "@/components/organisms/page-aeo";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { SERVICES } from "@/constants/services";
import { SERVICES_PAGE_FAQS } from "@/constants/faqs";
import { servicesItemListSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding Services in India | ExpressWay Logistic",
  description:
    "PAN India freight forwarding: NVOCC, ocean and air freight, FCL/LCL, consolidation, customs clearance, warehousing, project cargo, EXIM advisory and door-to-door logistics.",
  path: "/services",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Services"
        title="Complete logistics"
        accent="& EXIM capabilities"
        description="From freight booking and consolidation to customs, warehousing, project cargo, and door-to-door delivery — ExpressWay Logistic is your PAN India neutral NVOCC partner."
        breadcrumbs={crumbs}
        note={`${SERVICES.length} service pages, one coordinating desk`}
      />

      <section className="bg-surface py-section">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </section>

      <PageAeo
        answers={[
          SERVICES_PAGE_FAQS[3],
          SERVICES_PAGE_FAQS[4],
          SERVICES_PAGE_FAQS[2],
        ]}
        faqs={SERVICES_PAGE_FAQS}
        breadcrumbs={crumbs}
        extraJsonLd={[servicesItemListSchema()]}
        answerTitle="Freight forwarding services, explained"
        answerDescription="What a neutral NVOCC is, whether you can book a single service line, and how import and export freight are covered."
      />
      <QuoteCtaBand />
    </div>
  );
}
