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
import { Typography } from "@/components/atoms/typography";
import { FormField } from "@/components/molecules/form-field";
import { StateAlert } from "@/components/molecules/state-alert";
import {
  trackingSchema,
  type TrackingFormValues,
} from "@/features/contact/schemas";
import type { FreightMode, TrackingResult } from "@/types";
import { cn } from "@/lib/utils";

const DEMO_IDS = ["EW-10847", "EW-10846", "EW-10845", "EW-10844"] as const;

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
    setValue,
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

  const applyDemoId = (id: string) => {
    setValue("trackingId", id, { shouldValidate: true });
    void lookup(id);
  };

  useEffect(() => {
    if (!initialTrackingId) return;
    void lookup(initialTrackingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for deep-linked IDs
  }, [initialTrackingId]);

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
        noValidate
      >
        <FormField
          label="Tracking ID"
          htmlFor="trackingId"
          required
          error={errors.trackingId?.message}
          className="flex-1"
          hint="Format: EW-XXXXX"
        >
          <Input
            {...register("trackingId")}
            placeholder="e.g. EW-10847"
            autoComplete="off"
            className="h-12 text-base"
          />
        </FormField>
        <Button
          type="submit"
          size="lg"
          rounded="none"
          loading={status === "loading"}
          className="sm:min-w-36"
        >
          <Search className="size-4" />
          Track
        </Button>
      </form>

      <div>
        <p className="text-muted-body mb-3 text-muted-foreground">
          Try a demo shipment
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => applyDemoId(id)}
              className={cn(
                "border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent",
                result?.trackingId === id &&
                  "border-accent bg-accent/5 text-accent",
              )}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {status === "empty" ? (
        <StateAlert
          variant="info"
          title="No shipment found"
          description="Check the tracking ID and try again. Demo IDs start with EW-."
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
          className="border border-border bg-background"
          aria-live="polite"
        >
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border bg-brand px-6 py-5 text-brand-foreground">
            <div>
              <p className="text-eyebrow mb-1 text-white/60">Tracking ID</p>
              <Typography as="h2" variant="h3" className="text-white">
                {result.trackingId}
              </Typography>
            </div>
            <Badge
              variant={statusVariant(result.status)}
              className="rounded-none"
            >
              {result.status}
            </Badge>
          </header>

          <div className="flex flex-wrap items-center gap-3 border-b border-border px-6 py-5">
            <div className="min-w-0 flex-1">
              <p className="text-eyebrow mb-1 text-muted-foreground">Origin</p>
              <p className="text-h4 truncate text-foreground">{result.origin}</p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center bg-muted text-primary">
              <ArrowRight className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 text-right sm:text-left">
              <p className="text-eyebrow mb-1 text-muted-foreground">
                Destination
              </p>
              <p className="text-h4 truncate text-foreground">
                {result.destination}
              </p>
            </div>
          </div>

          <dl className="grid gap-px border-b border-border bg-border sm:grid-cols-3">
            <div className="bg-background px-6 py-4">
              <dt className="text-eyebrow mb-1 flex items-center gap-1.5 text-muted-foreground">
                <ModeIcon mode={result.mode} />
                Mode
              </dt>
              <dd className="font-semibold text-foreground">{result.mode}</dd>
            </div>
            <div className="bg-background px-6 py-4">
              <dt className="text-eyebrow mb-1 flex items-center gap-1.5 text-muted-foreground">
                <Clock3 className="size-3.5" aria-hidden />
                ETA
              </dt>
              <dd className="font-semibold text-foreground">{result.eta}</dd>
            </div>
            <div className="bg-background px-6 py-4">
              <dt className="text-eyebrow mb-1 flex items-center gap-1.5 text-muted-foreground">
                <MapPinned className="size-3.5" aria-hidden />
                Last update
              </dt>
              <dd className="font-semibold text-foreground">
                {new Date(result.lastUpdate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </dd>
            </div>
          </dl>

          <div className="px-6 py-6">
            <Typography as="h3" variant="h4" className="mb-5 text-foreground">
              Shipment timeline
            </Typography>
            <ol className="relative space-y-0 border-l-2 border-border pl-6">
              {result.events.map((event, index) => {
                const isLatest = index === result.events.length - 1;
                return (
                  <li key={`${event.timestamp}-${event.description}`} className="relative pb-6 last:pb-0">
                    <span
                      className={cn(
                        "absolute -left-[1.9rem] top-1 size-3 rounded-full border-2 border-background",
                        isLatest ? "bg-accent" : "bg-primary",
                      )}
                    />
                    <p className="font-semibold text-foreground">
                      {event.description}
                    </p>
                    <p className="text-muted-body mt-1 text-muted-foreground">
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
