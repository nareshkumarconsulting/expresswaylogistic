import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { CatalogCard } from "@/components/molecules/catalog-card";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { getGatewaysByRegion, getRegionBySlug, LOCATIONS, REGIONS } from "@/constants/geography";
import { PAN_INDIA_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return REGIONS.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) return { title: "Region not found" };
  return pageSeo({
    title: region.seoTitle,
    description: region.seoDescription,
    path: `/pan-india-logistics/${region.slug}`,
  });
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();
  const places = LOCATIONS.filter(
    (location) =>
      location.region === region.slug &&
      location.kind !== "icd" &&
      location.kind !== "airport",
  );
  const gateways = getGatewaysByRegion(region.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "PAN India logistics", path: "/pan-india-logistics" },
    { name: region.name, path: `/pan-india-logistics/${region.slug}` },
  ];

  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="PAN India"
        title={region.h1}
        description={region.body}
        image="/images/hero-banner-1280.webp"
        backHref="/pan-india-logistics"
        backLabel="All regions"
        breadcrumbs={crumbs}
        note={
          <>
            <MapPin className="size-4 text-accent" aria-hidden />
            Service geography — not a claimed office in every hub
          </>
        }
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              Hubs
            </p>
            <ul className="space-y-3">
              {region.hubs.map((hub) => (
                <li key={hub} className="text-sm leading-relaxed text-white/85">
                  {hub}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock text={region.directAnswer} />
          <ArticlePanel title="ICDs and gateways in this region">
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Inland container depots, dry ports and airports connected through the
              logistics network. Port codes identify the customs location — not
              ExpressWay-owned terminals.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {gateways.map((gateway) => (
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
          </ArticlePanel>
          <ArticlePanel title="Locations in this region">
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Freight forwarding for customers in these places through the logistics
              network.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {places.map((place) => (
                <li key={place.slug}>
                  <CatalogCard
                    variant="light"
                    href={`/locations/${place.slug}`}
                    kicker={place.kind}
                    title={place.name}
                    description={place.directAnswer}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <Link href="/locations" className="font-semibold text-primary hover:text-accent">
                All locations
              </Link>
            </p>
          </ArticlePanel>
        </div>
      </section>

      <PageAeo answers={PAN_INDIA_FAQS} faqs={PAN_INDIA_FAQS} breadcrumbs={crumbs} />
      <QuoteCtaBand />
    </div>
  );
}
