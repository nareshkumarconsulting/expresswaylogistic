import type { Metadata } from "next";
import { MapPin, Package, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/molecules/page-hero";
import { TrackingForm } from "@/features/tracking/components/tracking-form";

export const metadata: Metadata = {
  title: "Track Shipment",
  description:
    "Track ExpressWay Logistic shipments in real time with live status, ETA, and timeline events.",
  alternates: { canonical: "/track" },
};

const highlights = [
  {
    icon: Package,
    title: "Live status",
    description: "Milestone updates from booking through delivery",
  },
  {
    icon: MapPin,
    title: "Lane & ETA",
    description: "Origin, destination, mode, and predicted arrival",
  },
  {
    icon: ShieldCheck,
    title: "Secure lookup",
    description: "Public tracking without exposing client details",
  },
] as const;

type TrackPageProps = {
  searchParams: Promise<{ q?: string; id?: string }>;
};

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const params = await searchParams;
  const initialTrackingId = (params.id ?? params.q ?? "").trim();

  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Shipment Tracking"
        title="Track Your Cargo"
        description="Enter your ExpressWay tracking ID for live status, predicted ETA, and milestone history across air and ocean lanes."
      />

      <section className="relative z-10 -mt-10 pb-[var(--space-section)] md:-mt-12">
        <div className="container-page max-w-3xl">
          <div className="border border-border bg-card p-6 shadow-lg md:p-8">
            <TrackingForm initialTrackingId={initialTrackingId} />
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-h4 text-foreground">{title}</p>
                  <p className="text-muted-body mt-1 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
