"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Clock3,
  MapPinned,
  Plane,
  Search,
  Ship,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Typography } from "@/components/atoms/typography";
import { StateAlert } from "@/components/molecules/state-alert";
import {
  trackingSchema,
  type TrackingFormValues,
} from "@/features/contact/schemas";
import type { FreightMode, TrackingResult } from "@/types";
import { cn } from "@/lib/utils";
import { EstimatedRouteMapCard } from "@/features/tracking/components/estimated-route-map-card";

function statusVariant(status: string) {
  switch (status) {
    case "Delivered":
      return "success" as const;
    case "Customs Hold":
    case "Delayed":
      return "warning" as const;
    case "In Transit":
      return "secondary" as const;
    default:
      return "muted" as const;
  }
}

function ModeIcon({ mode }: { mode: FreightMode }) {
  const Icon =
    mode === "Ocean Freight" ? Ship : mode === "Road Freight" ? Truck : Plane;
  return <Icon className="size-4" aria-hidden />;
}

interface TrackingFormProps {
  initialTrackingId?: string;
}

export function TrackingForm({ initialTrackingId = "" }: TrackingFormProps) {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "empty" | "error" | "success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingSchema),
    defaultValues: { trackingId: initialTrackingId },
  });

  const lookup = async (trackingId: string) => {
    setStatus("loading");
    setResult(null);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/tracking?id=${encodeURIComponent(trackingId)}`,
      );
      const json = (await res.json()) as {
        success: boolean;
        data?: TrackingResult;
        error?: string;
      };
      if (res.status === 404) {
        setStatus("empty");
        return;
      }
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? "Tracking lookup failed");
      }
      setResult(json.data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Lookup failed");
    }
  };

  const onSubmit = async (values: TrackingFormValues) => {
    await lookup(values.trackingId);
  };

  useEffect(() => {
    if (!initialTrackingId) return;
    void lookup(initialTrackingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for deep-linked IDs
  }, [initialTrackingId]);

  const fieldError = errors.trackingId?.message;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2" noValidate>
        <Label htmlFor="trackingId">
          Tracking ID
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <div className="flex items-stretch gap-3">
          <Input
            {...register("trackingId")}
            id="trackingId"
            placeholder="e.g. EWLPL-10001/26-27"
            autoComplete="off"
            aria-describedby={
              fieldError ? "trackingId-error" : "trackingId-hint"
            }
            error={Boolean(fieldError)}
            className="h-12 min-w-0 flex-1 rounded-none text-base"
          />
          <Button
            type="submit"
            rounded="none"
            loading={status === "loading"}
            className="h-12 shrink-0 px-6 shadow-accent-glow sm:min-w-36"
          >
            <Search className="size-4" />
            Track
          </Button>
        </div>
        {fieldError ? (
          <p
            id="trackingId-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {fieldError}
          </p>
        ) : (
          <p id="trackingId-hint" className="text-xs text-muted-foreground">
            Format: EWLPL-XXXXX/YY-YY
          </p>
        )}
      </form>

      {status === "empty" ? (
        <StateAlert
          variant="info"
          title="No shipment found"
          description="Check the tracking ID and try again. Use the ID from your booking confirmation."
        />
      ) : null}
      {status === "error" ? (
        <StateAlert
          variant="error"
          title="Unable to track shipment"
          description={errorMessage ?? undefined}
          onRetry={() => setStatus("idle")}
        />
      ) : null}

      {result ? (
        <article
          className="overflow-hidden rounded-2xl border border-sky-400/20 bg-[#071e38] text-white"
          aria-live="polite"
        >
          <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                Tracking ID
              </p>
              <Typography as="h2" variant="h3" className="truncate text-white">
                {result.trackingId}
              </Typography>
            </div>
            <Badge
              variant={statusVariant(result.status)}
              className="shrink-0 rounded-md"
            >
              {result.status}
            </Badge>
          </header>

          <div className="relative border-b border-white/10 px-6 py-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
                  Origin
                </p>
                <p className="text-h4 truncate text-white">{result.origin}</p>
              </div>

              <div
                className="flex shrink-0 items-center gap-2"
                aria-hidden
              >
                <span className="hidden h-px w-6 bg-sky-400/40 sm:block sm:w-8" />
                <span className="flex size-10 items-center justify-center rounded-full border border-sky-400/40 text-[#00A3FF] sm:size-11">
                  <ModeIcon mode={result.mode} />
                </span>
                <span className="hidden h-px w-6 bg-sky-400/40 sm:block sm:w-8" />
                <ArrowRight className="size-4 text-white/40 sm:hidden" />
              </div>

              <div className="min-w-0 text-right">
                <p className="mb-1 text-[10px] font-semibold tracking-[0.18em] text-[#00A3FF] uppercase">
                  Destination
                </p>
                <p className="text-h4 truncate text-white">
                  {result.destination}
                </p>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-1 divide-y divide-white/10 border-b border-white/10 bg-white/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-white/10">
            <div className="px-6 py-4">
              <dt className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                <ModeIcon mode={result.mode} />
                Mode
              </dt>
              <dd className="font-semibold text-white">{result.mode}</dd>
            </div>
            <div className="px-6 py-4">
              <dt className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                <Clock3 className="size-3.5" aria-hidden />
                ETA
              </dt>
              <dd className="font-semibold text-white">{result.eta}</dd>
            </div>
            <div className="px-6 py-4">
              <dt className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                <MapPinned className="size-3.5" aria-hidden />
                Last update
              </dt>
              <dd className="font-semibold text-white">
                {new Date(result.lastUpdate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </dd>
            </div>
          </dl>

          <div className="border-b border-white/10 px-6 py-6">
            <EstimatedRouteMapCard
              origin={result.origin}
              destination={result.destination}
              status={result.status}
              mode={result.mode}
              eta={result.eta}
              estimatedEtaIso={result.estimatedEtaIso}
              createdAt={result.createdAt}
              predictedEtaHours={result.predictedEtaHours}
              theme="dark"
            />
          </div>

          <div className="px-6 py-6">
            <Typography as="h3" variant="h4" className="mb-5 text-white">
              Shipment timeline
            </Typography>
            <ol className="relative space-y-0 border-l border-dashed border-sky-400/35 pl-6">
              {result.events.map((event, index) => {
                const isLatest = index === result.events.length - 1;
                return (
                  <li
                    key={`${event.timestamp}-${event.description}`}
                    className="relative pb-6 last:pb-0"
                  >
                    <span
                      className={cn(
                        "absolute top-1 -left-[1.9rem] size-3 rounded-full border-2 border-[#071e38]",
                        isLatest ? "bg-accent" : "bg-[#00A3FF]",
                      )}
                    />
                    <p className="font-semibold text-white">
                      {event.description}
                    </p>
                    <p className="mt-1 text-sm text-white/55">
                      {event.location} ·{" "}
                      {new Date(event.timestamp).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </article>
      ) : null}
    </div>
  );
}
