"use client";

import { Fragment, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { estimateRoutePosition } from "@/lib/geo/estimate-route-position";
import { createShipmentMapMarkerIcon } from "@/lib/geo/shipment-map-marker";
import {
  FREIGHT_MODE_MAP,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_SUBDOMAINS,
  MAP_TILE_URL,
} from "@/lib/geo/shipment-map-style";
import type { FreightMode, Shipment, ShipmentStatus } from "@/types";
import "@/features/tracking/components/estimated-route-map.css";
import "leaflet/dist/leaflet.css";

const ACTIVE_STATUSES = new Set<ShipmentStatus>([
  "In Transit",
  "Customs Hold",
  "Delayed",
]);

const ROUTE_DASH: Record<FreightMode, string | undefined> = {
  "Air Freight": undefined,
  "Ocean Freight": "8 6",
  "Road Freight": "3 6",
};

type MappedShipment = {
  shipment: Shipment;
  estimateLat: number;
  estimateLng: number;
  path: [number, number][];
  statusLabel: string;
  bearing: number;
};

function buildMappedShipments(shipments: Shipment[]): MappedShipment[] {
  return shipments.flatMap((shipment) => {
    const route = estimateRoutePosition({
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      mode: shipment.type,
      eta: shipment.eta,
      predictedEtaHours: shipment.predictedEtaHours,
    });
    if (!route) return [];

    return [
      {
        shipment,
        estimateLat: route.estimate.lat,
        estimateLng: route.estimate.lng,
        path: route.path.map((point) => [point.lat, point.lng] as [number, number]),
        statusLabel: route.statusLabel,
        bearing: route.bearing,
      },
    ];
  });
}

function FitAllBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    map.fitBounds(points, { padding: [40, 40], maxZoom: 6 });
  }, [map, points]);

  return null;
}

type ShipmentsOverviewMapProps = {
  shipments: Shipment[];
  className?: string;
};

export function ShipmentsOverviewMap({
  shipments,
  className,
}: ShipmentsOverviewMapProps) {
  const mapped = useMemo(() => buildMappedShipments(shipments), [shipments]);
  const unmappedCount = shipments.length - mapped.length;

  const boundsPoints = useMemo(
    () =>
      mapped.flatMap((item) => {
        const points: [number, number][] = [
          [item.estimateLat, item.estimateLng],
        ];
        if (item.path.length > 0) {
          points.push(item.path[0]!, item.path[item.path.length - 1]!);
        }
        return points;
      }),
    [mapped],
  );

  const defaultCenter = useMemo((): [number, number] => {
    if (mapped.length === 0) return [20.5937, 78.9629];
    const lat =
      mapped.reduce((sum, item) => sum + item.estimateLat, 0) / mapped.length;
    const lng =
      mapped.reduce((sum, item) => sum + item.estimateLng, 0) / mapped.length;
    return [lat, lng];
  }, [mapped]);

  if (mapped.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
        No mappable shipments — use known city or port names (e.g. Mumbai, Dubai,
        Frankfurt).
      </div>
    );
  }

  return (
    <div className={className}>
      {unmappedCount > 0 ? (
        <p className="mb-2 text-xs text-muted-foreground">
          {unmappedCount} shipment{unmappedCount === 1 ? "" : "s"} hidden — origin
          or destination place not recognized yet.
        </p>
      ) : null}
      <MapContainer
        center={defaultCenter}
        zoom={3}
        scrollWheelZoom
        className="h-80 w-full rounded-md md:h-96"
        style={{ background: "#aad3df" }}
      >
        <TileLayer
          attribution={MAP_TILE_ATTRIBUTION}
          url={MAP_TILE_URL}
          subdomains={MAP_TILE_SUBDOMAINS}
        />
        <FitAllBounds points={boundsPoints} />
        {mapped.map((item) => {
          const modeStyle = FREIGHT_MODE_MAP[item.shipment.type];
          const animate = ACTIVE_STATUSES.has(item.shipment.status);
          const icon = createShipmentMapMarkerIcon({
            color: modeStyle.color,
            pulseColor: modeStyle.pulse,
            animate,
            compact: true,
            mode: modeStyle.key,
            bearing: item.bearing,
          });
          return (
            <Fragment key={item.shipment.id}>
              <Polyline
                positions={item.path}
                pathOptions={{
                  color: modeStyle.color,
                  weight: item.shipment.type === "Air Freight" ? 2.5 : 2,
                  opacity: 0.7,
                  dashArray: ROUTE_DASH[item.shipment.type],
                }}
              />
              <Marker
                position={[item.estimateLat, item.estimateLng]}
                icon={icon}
                zIndexOffset={animate ? 500 : 100}
              >
                <Popup minWidth={220}>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{item.shipment.id}</p>
                    <p>
                      {item.shipment.origin} → {item.shipment.destination}
                    </p>
                    <p className="text-muted-foreground">{item.statusLabel}</p>
                    <p>
                      <span className="font-medium">{item.shipment.status}</span>
                      {" · "}
                      {item.shipment.type}
                    </p>
                    <Link
                      href={`/command-center/shipments?shipment=${encodeURIComponent(item.shipment.id)}`}
                      className="inline-block pt-1 font-medium text-accent hover:underline"
                    >
                      Open shipment →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
