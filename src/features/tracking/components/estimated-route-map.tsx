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
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from "@/lib/geo/shipment-map-marker";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import "./estimated-route-map.css";

function createEstimateMarkerIcon(animate: boolean) {
  return createShipmentMapMarkerIcon({
    color: "#F5A623",
    pulseColor: "rgb(245 166 35 / 0.45)",
    animate,
  });
}

type EstimatedRouteMapProps = {
  route: EstimatedRoutePosition;
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
  className,
  theme = "dark",
  animateEstimate = true,
}: EstimatedRouteMapProps) {
  const isDark = theme === "dark";
  const estimateIcon = useMemo(
    () => createEstimateMarkerIcon(animateEstimate),
    [animateEstimate],
  );
  const tileUrl = MAP_TILE_URL;

  const center = useMemo(
    () =>
      [
        (route.origin.lat + route.destination.lat) / 2,
        (route.origin.lng + route.destination.lng) / 2,
      ] as [number, number],
    [route.origin.lat, route.origin.lng, route.destination.lat, route.destination.lng],
  );

  const pathPositions = useMemo(
    () => route.path.map((point) => [point.lat, point.lng] as [number, number]),
    [route.path],
  );

  return (
    <div
      className={cn(
        "overflow-hidden border",
        isDark ? "border-white/10 bg-[#041525]" : "border-border bg-muted/30",
        className,
      )}
    >
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={false}
        className="h-64 w-full md:h-72"
        style={{ background: "#e8eef5" }}
      >
        <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={tileUrl} />
        <FitBounds route={route} />
        <Polyline
          positions={pathPositions}
          pathOptions={{
            color: isDark ? "#00A3FF" : "#0B5CAB",
            weight: 2.5,
            opacity: 0.85,
            dashArray: "8 6",
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
            fillColor: isDark ? "#00A3FF" : "#0B5CAB",
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
            {route.statusLabel}
            <br />
            {route.estimate.lat.toFixed(2)}°, {route.estimate.lng.toFixed(2)}°
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
