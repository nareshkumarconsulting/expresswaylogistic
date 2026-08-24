import Link from "next/link";
import { TrackHero } from "@/features/tracking/components/track-hero";
import { TrackingForm } from "@/features/tracking/components/tracking-form";
import { PageAeo } from "@/components/organisms/page-aeo";
import { pageSeo } from "@/lib/seo";
import { TRACK_PAGE_FAQS } from "@/constants/faqs";

export const metadata = pageSeo({
  title: "Track Shipment | ExpressWay Logistic",
  description:
    "Track your ExpressWay Logistic shipment using your shipment, booking or tracking reference. Public lookup shows operational status, not private commercial files.",
  path: "/track",
});

type TrackPageProps = {
  searchParams: Promise<{ q?: string; id?: string }>;
};

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const params = await searchParams;
  const initialTrackingId = (params.id ?? params.q ?? "").trim();

  return (
    <div className="bg-surface">
      <TrackHero />

      <section className="relative pb-16 md:pb-20">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/[0.04] to-transparent"
          aria-hidden
        />
        <div className="container-page relative z-10 -mt-12 max-w-4xl md:-mt-16">
          <div
            id="track-lookup"
            className="relative scroll-mt-28 overflow-hidden border border-border/80 bg-card shadow-[var(--ds-shadow-lg)]"
          >
            <div
              className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-accent/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 bg-primary/5 blur-2xl"
              aria-hidden
            />
            <div className="relative border-b border-border/60 bg-surface/50 px-5 py-4 md:px-8 md:py-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Shipment lookup
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Enter your tracking ID
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Format EW-XXXXX. Live status, lane, ETA, and an estimated
                position on the world map for air and ocean shipments.
              </p>
            </div>
            <div className="relative px-5 py-6 md:px-8 md:py-8">
              <TrackingForm initialTrackingId={initialTrackingId} />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have a tracking ID yet?{" "}
            <Link
              href="/quote"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Request a quote
            </Link>{" "}
            or{" "}
            <Link
              href="/appointment"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              book an appointment
            </Link>
            .
          </p>
        </div>
      </section>

      <PageAeo
        answers={TRACK_PAGE_FAQS}
        faqs={TRACK_PAGE_FAQS}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Track Shipment", path: "/track" },
        ]}
        answerTitle="How shipment tracking works"
        answerDescription="Use an ExpressWay tracking ID for live status. Public lookup does not expose full client commercial files."
        faqTitle="Tracking questions"
      />
    </div>
  );
}
