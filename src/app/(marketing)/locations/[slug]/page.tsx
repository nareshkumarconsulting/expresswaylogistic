import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { getLocationBySlug, LOCATIONS } from "@/constants/geography";
import { getLocationFaqs } from "@/constants/faqs";
import { locationServiceSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return { title: "Location not found" };
  return pageSeo({
    title: location.seoTitle,
    description: location.seoDescription,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: location.name, path: `/locations/${location.slug}` },
  ];
  const kicker =
    location.kind === "office"
      ? "Headquarters"
      : location.kind === "port"
        ? "Port gateway"
        : location.kind === "icd"
          ? "ICD / dry port"
          : location.kind === "airport"
            ? "Airport gateway"
            : "Service geography";

  const locationFaqs = getLocationFaqs(location);

  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Locations"
        title={location.h1}
        description={location.body}
        backHref="/locations"
        backLabel="All locations"
        breadcrumbs={crumbs}
        note={
          <>
            <MapPin className="size-4 text-accent" aria-hidden />
            {kicker}
          </>
        }
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-3 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              At a glance
            </p>
            <p className="text-sm leading-relaxed text-white/85">
              {location.directAnswer}
            </p>
            {(location.place || location.portCode || location.note) && (
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-white/80">
                {location.place ? (
                  <li>
                    <span className="text-white/50">Place: </span>
                    {location.place}
                  </li>
                ) : null}
                {location.portCode ? (
                  <li>
                    <span className="text-white/50">Port code: </span>
                    {location.portCode}
                  </li>
                ) : null}
                {location.note ? (
                  <li>
                    <span className="text-white/50">Note: </span>
                    {location.note}
                  </li>
                ) : null}
              </ul>
            )}
          </div>
        }
      />

      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock text={location.directAnswer} />
          <ArticlePanel title="Service coverage">
            <p className="leading-relaxed text-slate-600">{location.body}</p>
          </ArticlePanel>
        </div>
      </section>

      <RelatedLinks
        extra={[
          {
            title: "Region",
            items: [
              {
                href: `/pan-india-logistics/${location.region}`,
                label: location.region.replace("-", " "),
              },
            ],
          },
          {
            title: "Services",
            items: [
              { href: "/services/freight-forwarding", label: "Freight forwarding" },
              { href: "/services/ocean-freight", label: "Ocean freight" },
              { href: "/quote", label: "Request a quote" },
            ],
          },
        ]}
      />
      <PageAeo
        answers={locationFaqs.slice(0, 3)}
        faqs={locationFaqs}
        breadcrumbs={crumbs}
        extraJsonLd={[locationServiceSchema(location)]}
      />
      <QuoteCtaBand />
    </div>
  );
}
