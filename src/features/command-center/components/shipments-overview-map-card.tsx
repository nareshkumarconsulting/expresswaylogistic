"use client";

import dynamic from "next/dynamic";
import type { Shipment } from "@/types";

const SHIPMENT_MAP_LEGEND = [
  { label: "In transit", color: "#0B5CAB" },
  { label: "Processing", color: "#64748b" },
  { label: "Customs / delayed", color: "#F5A623" },
  { label: "Delivered", color: "#16a34a" },
] as const;

const ShipmentsOverviewMap = dynamic(
  () =>
    import("@/features/command-center/components/shipments-overview-map").then(
      (mod) => mod.ShipmentsOverviewMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-sm text-muted-foreground md:h-96">
        Loading network map…
      </div>
    ),
  },
);

type ShipmentsOverviewMapCardProps = {
  shipments: Shipment[];
};

export function ShipmentsOverviewMapCard({
  shipments,
}: ShipmentsOverviewMapCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold">Live Network Map</h3>
          <p className="text-sm text-muted-foreground">
            Estimated positions for all shipments on the board
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {shipments.length === 0
            ? "No shipments"
            : `${shipments.length} shipment${shipments.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <ShipmentsOverviewMap shipments={shipments} />

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {SHIPMENT_MAP_LEGEND.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              className="size-2.5 rounded-full border border-white shadow-sm"
              style={{ background: item.color }}
            />
            {item.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Scheduled estimates along great-circle lanes — not live vessel GPS.
      </p>
    </div>
  );
}
