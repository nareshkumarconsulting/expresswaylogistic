"use client";

import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { EstimatedRoutePosition } from "@/lib/geo/estimate-route-position";
import {
  createShipmentMapMarkerIcon,
  FREIGHT_MODE_MAP,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_SUBDOMAINS,
  MAP_TILE_URL,
} from "@/lib/geo/shipment-map-marker";
import { cn } from "@/lib/utils";
import type { FreightMode } from "@/types";
import "leaflet/dist/leaflet.css";
import "./estimated-route-map.css";

const ROUTE_DASH: Record<FreightMode, string | undefined> = {
  "Air Freight": undefined,
  "Ocean Freight": "8 6",
  "Road Freight": "3 6",
};

type EstimatedRouteMapProps = {
  route: EstimatedRoutePosition;
  mode: FreightMode;
  className?: string;
  theme?: "dark" | "light";
  /** Pulse the live estimate pin (e.g. while in transit). */
  animateEstimate?: boolean;
};

function FitBounds({ route }: { route: EstimatedRoutePosition }) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [
      [route.origin.lat, route.origin.lng],
      [route.destination.lat, route.destination.lng],
      [route.estimate.lat, route.estimate.lng],
    ];
    map.fitBounds(points, { padding: [36, 36], maxZoom: 5 });
  }, [map, route]);

  return null;
}

export function EstimatedRouteMap({
  route,
  mode,
  className,
  theme = "dark",
  animateEstimate = true,
}: EstimatedRouteMapProps) {
  const isDark = theme === "dark";
  const modeStyle = FREIGHT_MODE_MAP[mode];
  const estimateIcon = useMemo(
    () =>
      createShipmentMapMarkerIcon({
        color: modeStyle.color,
        pulseColor: modeStyle.pulse,
        animate: animateEstimate,
        mode: modeStyle.key,
        bearing: route.bearing,
      }),
    [
      animateEstimate,
      modeStyle.color,
      modeStyle.key,
      modeStyle.pulse,
      route.bearing,
    ],
  );

  const center = useMemo(
    () =>
      [
        (route.origin.lat + route.destination.lat) / 2,
        (route.origin.lng + route.destination.lng) / 2,
      ] as [number, number],
    [
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng,
    ],
  );

  const pathPositions = useMemo(
    () => route.path.map((point) => [point.lat, point.lng] as [number, number]),
    [route.path],
  );

  const mapKey = `${mode}:${route.origin.label}:${route.destination.label}:${route.percentLabel}`;

  return (
    <div
      className={cn(
        "overflow-hidden border",
        isDark ? "border-white/10 bg-[#041525]" : "border-border bg-muted/30",
        className,
      )}
    >
      <MapContainer
        key={mapKey}
        center={center}
        zoom={3}
        scrollWheelZoom={false}
        className="h-64 w-full md:h-72"
        style={{ background: "#e8eef5" }}
      >
        <TileLayer
          attribution={MAP_TILE_ATTRIBUTION}
          url={MAP_TILE_URL}
          subdomains={MAP_TILE_SUBDOMAINS}
        />
        <FitBounds route={route} />
        <Polyline
          positions={pathPositions}
          pathOptions={{
            color: modeStyle.color,
            weight: mode === "Air Freight" ? 3 : 2.5,
            opacity: 0.85,
            dashArray: ROUTE_DASH[mode],
          }}
        />
        <CircleMarker
          center={[route.origin.lat, route.origin.lng]}
          radius={7}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor: isDark ? "#94a3b8" : "#64748b",
            fillOpacity: 1,
          }}
        >
          <Popup>Origin · {route.origin.label}</Popup>
        </CircleMarker>
        <CircleMarker
          center={[route.destination.lat, route.destination.lng]}
          radius={7}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor: modeStyle.color,
            fillOpacity: 1,
          }}
        >
          <Popup>Destination · {route.destination.label}</Popup>
        </CircleMarker>
        <Marker
          position={[route.estimate.lat, route.estimate.lng]}
          icon={estimateIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <strong>{modeStyle.label}</strong>
            <br />
            {route.statusLabel}
            <br />
            {route.estimate.lat.toFixed(2)}°, {route.estimate.lng.toFixed(2)}°
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
