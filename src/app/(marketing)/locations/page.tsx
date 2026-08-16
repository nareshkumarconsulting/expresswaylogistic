import { Anchor, Building2, MapPin } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { CatalogCard, BrandCatalog } from "@/components/molecules/catalog-card";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { LOCATIONS } from "@/constants/geography";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding Locations in India | ExpressWay Logistic",
  description:
    "High-demand Indian cities and ports where ExpressWay coordinates freight forwarding. Coverage through a nationwide logistics network — not a claimed office in every city.",
  path: "/locations",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Locations", path: "/locations" },
];

function kindLabel(kind: (typeof LOCATIONS)[number]["kind"]) {
  if (kind === "office") return "Headquarters";
  if (kind === "port") return "Port gateway";
  return "Service geography";
}

export default function LocationsIndexPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Locations"
        title="Indian cities and ports"
        accent="we support"
        description="Freight forwarding for customers in these locations through our logistics network. Only Noida is listed as headquarters."
        image="/images/hero-port.jpg"
        secondaryCta={{ href: "/pan-india-logistics", label: "PAN India network" }}
        breadcrumbs={crumbs}
        note={
          <>
            <Building2 className="size-4 text-accent" aria-hidden />
            {LOCATIONS.length} high-demand geographies — no thin city farm
          </>
        }
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              How to read these pages
            </p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <Building2 className="mt-0.5 size-4 shrink-0 text-accent" />
                Office = Noida headquarters
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                City = origin/destination coverage
              </li>
              <li className="flex gap-3">
                <Anchor className="mt-0.5 size-4 shrink-0 text-accent" />
                Port = cargo gateway, not a terminal we own
              </li>
            </ul>
          </div>
        }
      />

      <BrandCatalog
        eyebrow="Coverage"
        title="Cities and"
        accent="gateways"
        description="Use these pages for local search intent. They do not claim a branch office unless marked headquarters."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {LOCATIONS.map((location) => (
            <li key={location.slug}>
              <CatalogCard
                href={`/locations/${location.slug}`}
                kicker={kindLabel(location.kind)}
                title={location.name}
                description={location.directAnswer}
              />
            </li>
          ))}
        </ul>
      </BrandCatalog>
      <QuoteCtaBand />
    </div>
  );
}
