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
import {
  createShipmentMapMarkerIcon,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from "@/lib/geo/shipment-map-marker";
import type { Shipment, ShipmentStatus } from "@/types";
import "@/features/tracking/components/estimated-route-map.css";
import "leaflet/dist/leaflet.css";

const STATUS_MARKER: Record<
  ShipmentStatus,
  { fill: string; pulse: string; animate: boolean }
> = {
  Processing: { fill: "#64748b", pulse: "#64748b73", animate: false },
  "In Transit": { fill: "#0B5CAB", pulse: "#0B5CAB73", animate: true },
  "Customs Hold": { fill: "#F5A623", pulse: "#F5A62373", animate: true },
  Delayed: { fill: "#ef4444", pulse: "#ef444473", animate: true },
  Delivered: { fill: "#16a34a", pulse: "#16a34a73", animate: false },
};

type MappedShipment = {
  shipment: Shipment;
  estimateLat: number;
  estimateLng: number;
  path: [number, number][];
  statusLabel: string;
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

  const markerIcons = useMemo(() => {
    const icons = new Map<ShipmentStatus, ReturnType<typeof createShipmentMapMarkerIcon>>();
    for (const status of Object.keys(STATUS_MARKER) as ShipmentStatus[]) {
      const marker = STATUS_MARKER[status];
      icons.set(
        status,
        createShipmentMapMarkerIcon({
          color: marker.fill,
          pulseColor: marker.pulse,
          animate: marker.animate,
          compact: true,
        }),
      );
    }
    return icons;
  }, []);

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
        No mappable shipments — use known city or port names (e.g. Mumbai, Dubai).
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={defaultCenter}
        zoom={3}
        scrollWheelZoom
        className="h-80 w-full rounded-md md:h-96"
        style={{ background: "#aad3df" }}
      >
        <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
        <FitAllBounds points={boundsPoints} />
        {mapped.map((item) => {
          const marker = STATUS_MARKER[item.shipment.status];
          const icon = markerIcons.get(item.shipment.status)!;
          return (
            <Fragment key={item.shipment.id}>
              <Polyline
                positions={item.path}
                pathOptions={{
                  color: marker.fill,
                  weight: 2,
                  opacity: 0.55,
                  dashArray: "6 5",
                }}
              />
              <Marker
                position={[item.estimateLat, item.estimateLng]}
                icon={icon}
                zIndexOffset={marker.animate ? 500 : 100}
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
