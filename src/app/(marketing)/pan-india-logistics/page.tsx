import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { COVERAGE_STATEMENT } from "@/constants/entity";
import { LOCATIONS, REGIONS, getGatewaysByRegion } from "@/constants/geography";
import { PAN_INDIA_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "PAN India Freight Forwarding & Logistics Services | ExpressWay Logistic",
  description:
    "PAN India freight forwarding through a nationwide logistics network — cities, coastal ports, inland ICDs, dry ports and airports connecting Indian origins with worldwide destinations.",
  path: "/pan-india-logistics",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "PAN India logistics", path: "/pan-india-logistics" },
];

export default function PanIndiaPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="PAN India"
        title="Logistics network for"
        accent="worldwide shipping"
        description={COVERAGE_STATEMENT}
        image="/images/hero-banner-1280.webp"
        secondaryCta={{ href: "/shipping-routes", label: "View routes" }}
        note={
          <>
            <MapPin className="size-4 text-accent" aria-hidden />
            Headquarters in Noida — coverage is a network, not a branch in every city
          </>
        }
        breadcrumbs={crumbs}
        panel={
          <div className="border border-white/15 bg-white/5 p-5 backdrop-blur-sm md:p-6">
            <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              Regions
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {REGIONS.map((region) => (
                <li key={region.slug}>
                  <Link
                    href={`/pan-india-logistics/${region.slug}`}
                    className="block truncate rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/90 transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock text={COVERAGE_STATEMENT} />
          <ArticlePanel title="How coverage works">
            <p className="leading-relaxed text-slate-600">
              ExpressWay coordinates inland pickup, port connectivity, airport
              connectivity, customs and door delivery through a nationwide logistics
              network. Headquarters are in Noida. Regional and city pages describe
              service demand — not a physical office in every listed city.
            </p>
          </ArticlePanel>
        </div>
      </section>

      <BrandCatalog
        eyebrow="Geography"
        title="North, west, south and"
        accent="east India"
        description="Each region page is unique. Cities and ports are origin/gateway coverage through the network."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {REGIONS.map((region) => (
            <li key={region.slug}>
              <CatalogCard
                href={`/pan-india-logistics/${region.slug}`}
                kicker={region.hubs[0]}
                title={region.name}
                description={region.directAnswer}
              />
            </li>
          ))}
        </ul>
      </BrandCatalog>

      <section className="bg-background py-section">
        <div className="container-page">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            Inland gateways
          </p>
          <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
          <h2 className="text-h2 mb-3 text-slate-900">
            ICDs, dry ports and airports by region
          </h2>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-slate-600">
            Network connectivity for inland container depots and related gateways.
            Port codes identify the customs location — not ExpressWay-owned terminals.
          </p>
          <div className="space-y-10">
            {REGIONS.map((region) => (
              <div key={region.slug}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{region.name}</h3>
                  <Link
                    href={`/pan-india-logistics/${region.slug}`}
                    className="text-sm font-semibold text-primary hover:text-accent"
                  >
                    Region details
                  </Link>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {getGatewaysByRegion(region.slug).map((gateway) => (
                    <li key={gateway.slug}>
                      <Link
                        href={`/locations/${gateway.slug}`}
                        className="block h-full border border-border bg-card p-4 transition-colors hover:border-accent"
                      >
                        <p className="text-sm font-semibold text-foreground">{gateway.name}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {gateway.place}
                        </p>
                        {(gateway.portCode || gateway.note) && (
                          <p className="mt-2 text-[11px] font-medium tracking-wide text-accent uppercase">
                            {gateway.portCode
                              ? `Port code: ${gateway.portCode}`
                              : gateway.note}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedLinks
        extra={[
          {
            title: "Locations",
            items: LOCATIONS.slice(0, 8).map((location) => ({
              href: `/locations/${location.slug}`,
              label: location.name,
            })),
          },
          {
            title: "Services",
            items: [
              { href: "/services/freight-forwarding", label: "Freight forwarding" },
              { href: "/services/ocean-freight", label: "Ocean freight" },
              { href: "/quote", label: "Request a quote" },
            ],
          },
          {
            title: "Worldwide",
            items: [
              { href: "/shipping-routes", label: "Shipping routes" },
              { href: "/locations", label: "Cities and ports" },
            ],
          },
        ]}
      />
      <PageAeo
        answers={PAN_INDIA_FAQS}
        faqs={PAN_INDIA_FAQS}
        breadcrumbs={crumbs}
      />
      <QuoteCtaBand />
    </div>
  );
}
