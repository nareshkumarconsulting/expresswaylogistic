"use client";

import dynamic from "next/dynamic";
import { FREIGHT_MODE_MAP } from "@/lib/geo/shipment-map-style";
import type { FreightMode, Shipment } from "@/types";

const MODE_LEGEND = (
  Object.entries(FREIGHT_MODE_MAP) as [
    FreightMode,
    (typeof FREIGHT_MODE_MAP)[FreightMode],
  ][]
).map(([mode, style]) => ({
  mode,
  label: style.label,
  color: style.color,
  hint:
    mode === "Air Freight"
      ? "Plane · solid lane"
      : mode === "Ocean Freight"
        ? "Ship · dashed lane"
        : "Truck · dotted lane",
}));

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
            Air, ocean, and road cargo by mode — estimated positions on the board
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
        {MODE_LEGEND.map((item) => (
          <li
            key={item.mode}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              className="size-2.5 rounded-full border border-white shadow-sm"
              style={{ background: item.color }}
              aria-hidden
            />
            <span>
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-foreground"> · {item.hint}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Scheduled estimates along great-circle lanes — not live vessel or aircraft
        GPS. Pulsing markers are in transit, on hold, or delayed.
      </p>
    </div>
  );
}
