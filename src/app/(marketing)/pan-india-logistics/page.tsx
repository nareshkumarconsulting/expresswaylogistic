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
import { LOCATIONS, REGIONS } from "@/constants/geography";
import { PAN_INDIA_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "PAN India Freight Forwarding & Logistics Services | ExpressWay Logistic",
  description:
    "ExpressWay supports customers across India through a nationwide logistics network, connecting Indian origins with worldwide destinations.",
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
