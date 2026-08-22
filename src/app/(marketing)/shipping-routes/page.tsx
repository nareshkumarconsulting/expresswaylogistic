import { Plane, Ship } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { getAdditionalRoutes, getFeaturedRoutes } from "@/constants/geography";
import { SHIPPING_ROUTES_PAGE_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "India to Worldwide Shipping Routes | ExpressWay Logistic",
  description:
    "Commercially relevant India to worldwide freight corridors — ocean and air forwarding, FCL/LCL, documentation and customs coordination.",
  path: "/shipping-routes",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Shipping routes", path: "/shipping-routes" },
];

export default function ShippingRoutesPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Routes"
        title="India to worldwide"
        accent="shipping corridors"
        description="Only commercially relevant corridors are listed. Indicative transit varies by carrier, sailing, origin, destination, customs and operational conditions."
        image="/images/hero-port.jpg"
        secondaryCta={{ href: "/pan-india-logistics", label: "PAN India origins" }}
        breadcrumbs={crumbs}
        note={
          <>
            <Ship className="size-4 text-accent" aria-hidden />
            Ocean and air quoted per cargo file — no public tariff
          </>
        }
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              Modes on these lanes
            </p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-[#00A3FF]">
                  <Ship className="size-4" />
                </span>
                Ocean FCL / LCL / consolidation
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-[#00A3FF]">
                  <Plane className="size-4" />
                </span>
                Air freight when time-critical
              </li>
            </ul>
          </div>
        }
      />

      <BrandCatalog
        eyebrow="Priority corridors"
        title="India to"
        accent="worldwide destinations"
        description="USA, Canada, Netherlands, Singapore, Australia, UAE and Saudi Arabia — commercially used country lanes. Transit is never published as a guarantee."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {getFeaturedRoutes().map((route) => (
            <li key={route.slug}>
              <CatalogCard
                href={`/shipping-routes/${route.slug}`}
                kicker={route.destinationCountry}
                title={`India → ${route.destination}`}
                description={route.directAnswer}
              />
            </li>
          ))}
        </ul>
      </BrandCatalog>
      <BrandCatalog
        eyebrow="More corridors"
        title="Additional"
        accent="India-origin lanes"
        description="City and country pages kept for specific search intent. Dubai and Jeddah remain as gateway pages alongside UAE and Saudi Arabia."
        tone="light"
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {getAdditionalRoutes().map((route) => (
            <li key={route.slug}>
              <CatalogCard
                href={`/shipping-routes/${route.slug}`}
                kicker={route.destinationCountry}
                title={`India → ${route.destination}`}
                description={route.directAnswer}
                variant="light"
              />
            </li>
          ))}
        </ul>
      </BrandCatalog>
      <PageAeo
        answers={SHIPPING_ROUTES_PAGE_FAQS.slice(0, 3)}
        faqs={SHIPPING_ROUTES_PAGE_FAQS}
        breadcrumbs={crumbs}
        webPage={{
          name: "India to Worldwide Shipping Routes",
          description:
            "Commercially relevant India to worldwide freight corridors — ocean and air forwarding from ExpressWay Logistic.",
          path: "/shipping-routes",
        }}
        answerTitle="Shipping routes from India"
        answerDescription="Ocean and air corridors to USA, UAE, Europe and worldwide — quoted per cargo file, not from a public tariff."
      />
      <QuoteCtaBand />
    </div>
  );
}
