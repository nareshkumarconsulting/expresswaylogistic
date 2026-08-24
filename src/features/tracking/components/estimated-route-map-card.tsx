"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { FreightMode, ShipmentStatus } from "@/types";
import {
  estimateRoutePosition,
  type EstimateRouteInput,
} from "@/lib/geo/estimate-route-position";

const EstimatedRouteMap = dynamic(
  () =>
    import("@/features/tracking/components/estimated-route-map").then(
      (mod) => mod.EstimatedRouteMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center border border-dashed border-border/60 bg-muted/20 text-sm text-muted-foreground md:h-72">
        Loading map…
      </div>
    ),
  },
);

export type EstimatedRouteMapCardProps = {
  origin: string;
  destination: string;
  status: ShipmentStatus;
  mode: FreightMode;
  eta?: string;
  estimatedEtaIso?: string;
  createdAt?: string;
  predictedEtaHours?: number;
  theme?: "dark" | "light";
  className?: string;
};

export function EstimatedRouteMapCard(props: EstimatedRouteMapCardProps) {
  const route = useMemo(() => {
    const input: EstimateRouteInput = {
      origin: props.origin,
      destination: props.destination,
      status: props.status,
      mode: props.mode,
      eta: props.eta,
      estimatedEtaIso: props.estimatedEtaIso,
      createdAt: props.createdAt,
      predictedEtaHours: props.predictedEtaHours,
    };
    return estimateRoutePosition(input);
  }, [
    props.origin,
    props.destination,
    props.status,
    props.mode,
    props.eta,
    props.estimatedEtaIso,
    props.createdAt,
    props.predictedEtaHours,
  ]);

  if (!route) {
    return (
      <p className="text-sm text-muted-foreground">
        Map estimate unavailable for this lane — add a known city/port name
        (e.g. Mumbai, Dubai).
      </p>
    );
  }

  const isDark = props.theme !== "light";

  return (
    <div className={props.className}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p
            className={
              isDark
                ? "text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase"
                : "text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase"
            }
          >
            Estimated location
          </p>
          <p
            className={
              isDark
                ? "mt-1 font-semibold text-white"
                : "mt-1 font-semibold text-foreground"
            }
          >
            {route.statusLabel}
          </p>
        </div>
        <p
          className={
            isDark
              ? "text-xs text-accent"
              : "text-xs font-medium text-accent"
          }
        >
          {route.percentLabel} along lane
        </p>
      </div>
      <EstimatedRouteMap
        route={route}
        theme={props.theme ?? "dark"}
        animateEstimate={
          props.status !== "Delivered" && props.status !== "Processing"
        }
      />
      <p
        className={
          isDark
            ? "mt-2 text-xs text-white/45"
            : "mt-2 text-xs text-muted-foreground"
        }
      >
        {route.disclaimer}
      </p>
    </div>
  );
}
