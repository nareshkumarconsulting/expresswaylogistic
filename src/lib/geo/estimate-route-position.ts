import type { FreightMode, ShipmentStatus } from "@/types";
import { resolveLocation, type GeoPoint } from "@/lib/geo/locations";

export type LatLng = { lat: number; lng: number };

export type EstimateRouteInput = {
  origin: string;
  destination: string;
  status: ShipmentStatus;
  mode: FreightMode;
  eta?: string;
  estimatedEtaIso?: string;
  createdAt?: string;
  predictedEtaHours?: number;
  now?: Date;
};

export type EstimatedRoutePosition = {
  origin: GeoPoint;
  destination: GeoPoint;
  estimate: LatLng;
  progress: number;
  path: LatLng[];
  percentLabel: string;
  statusLabel: string;
  disclaimer: string;
  /** Bearing of travel at the estimate (degrees, 0 = north). */
  bearing: number;
};

const DEFAULT_TRANSIT_HOURS: Record<FreightMode, number> = {
  "Ocean Freight": 7 * 24,
  "Air Freight": 2 * 24,
  "Road Freight": 3 * 24,
};

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/** Initial great-circle bearing in degrees (0 = north, clockwise). */
export function initialBearing(from: LatLng, to: LatLng): number {
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Spherical linear interpolation between two points (great-circle). */
export function interpolateGreatCircle(
  from: LatLng,
  to: LatLng,
  t: number,
): LatLng {
  const clamped = Math.min(1, Math.max(0, t));
  const lat1 = toRad(from.lat);
  const lng1 = toRad(from.lng);
  const lat2 = toRad(to.lat);
  const lng2 = toRad(to.lng);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2,
      ),
    );

  if (d < 1e-9) return { lat: from.lat, lng: from.lng };

  const a = Math.sin((1 - clamped) * d) / Math.sin(d);
  const b = Math.sin(clamped * d) / Math.sin(d);

  const x =
    a * Math.cos(lat1) * Math.cos(lng1) + b * Math.cos(lat2) * Math.cos(lng2);
  const y =
    a * Math.cos(lat1) * Math.sin(lng1) + b * Math.cos(lat2) * Math.sin(lng2);
  const z = a * Math.sin(lat1) + b * Math.sin(lat2);

  return {
    lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
    lng: toDeg(Math.atan2(y, x)),
  };
}

export function buildGreatCirclePath(
  from: LatLng,
  to: LatLng,
  steps = 64,
): LatLng[] {
  const path: LatLng[] = [];
  for (let i = 0; i <= steps; i += 1) {
    path.push(interpolateGreatCircle(from, to, i / steps));
  }
  return path;
}

function parseEtaHours(eta?: string): number | undefined {
  if (!eta) return undefined;
  const trimmed = eta.trim().toLowerCase();
  if (trimmed === "pending" || trimmed === "due") return undefined;

  const dayMatch = trimmed.match(/^(\d+)\s*days?$/);
  if (dayMatch) return Number(dayMatch[1]) * 24;

  const hourMatch = trimmed.match(/^(\d+)\s*hours?$/);
  if (hourMatch) return Number(hourMatch[1]);

  return undefined;
}

/**
 * Estimate journey progress 0–1 from ETA fields and status.
 * Prefer createdAt + estimatedEtaIso; fall back to remaining hours vs mode default.
 */
export function estimateProgress(input: EstimateRouteInput): number {
  const now = input.now?.getTime() ?? Date.now();

  if (input.status === "Delivered") return 1;
  if (input.status === "Processing") return 0;

  const etaMs = input.estimatedEtaIso
    ? new Date(input.estimatedEtaIso).getTime()
    : Number.NaN;
  const createdMs = input.createdAt
    ? new Date(input.createdAt).getTime()
    : Number.NaN;

  if (!Number.isNaN(etaMs) && !Number.isNaN(createdMs) && etaMs > createdMs) {
    const progress = (now - createdMs) / (etaMs - createdMs);
    return clampTransitProgress(progress, input.status);
  }

  const remainingHours =
    input.predictedEtaHours ?? parseEtaHours(input.eta) ?? null;
  if (remainingHours != null) {
    const total = Math.max(
      DEFAULT_TRANSIT_HOURS[input.mode],
      remainingHours,
    );
    const progress = 1 - remainingHours / total;
    return clampTransitProgress(progress, input.status);
  }

  // Mid-voyage fallback when ETA is unknown but cargo is moving.
  return clampTransitProgress(0.45, input.status);
}

function clampTransitProgress(
  progress: number,
  status: ShipmentStatus,
): number {
  if (status === "Delivered") return 1;
  if (status === "Processing") return 0;
  // Keep in-transit pins off the exact endpoints.
  return Math.min(0.92, Math.max(0.08, progress));
}

function statusLabel(status: ShipmentStatus, progress: number): string {
  const pct = Math.round(progress * 100);
  switch (status) {
    case "Delivered":
      return "Arrived at destination";
    case "Processing":
      return "At origin · not yet departed";
    case "Customs Hold":
      return `Estimated position · ~${pct}% (customs hold)`;
    case "Delayed":
      return `Estimated position · ~${pct}% (delayed)`;
    default:
      return `Estimated position · ~${pct}% of journey`;
  }
}

/** Build estimated map geometry for a lane, or null if places are unknown. */
export function estimateRoutePosition(
  input: EstimateRouteInput,
): EstimatedRoutePosition | null {
  const origin = resolveLocation(input.origin);
  const destination = resolveLocation(input.destination);
  if (!origin || !destination) return null;

  const progress = estimateProgress(input);
  const estimate = interpolateGreatCircle(origin, destination, progress);
  const path = buildGreatCirclePath(origin, destination);
  // Look slightly ahead along the lane so the nose follows the arc.
  const ahead = interpolateGreatCircle(
    origin,
    destination,
    Math.min(1, progress + 0.02),
  );
  const bearing = initialBearing(estimate, ahead);

  return {
    origin,
    destination,
    estimate,
    progress,
    path,
    percentLabel: `${Math.round(progress * 100)}%`,
    statusLabel: statusLabel(input.status, progress),
    disclaimer:
      "Scheduled estimate along the great-circle lane — not live vessel GPS.",
    bearing,
  };
}
