import type { Shipment, TrackingResult } from "@/types";
import { listShipments } from "@/services/shipments-repository";

export function buildTrackingResult(shipment: Shipment): TrackingResult {
  return {
    trackingId: shipment.id,
    status: shipment.status,
    origin: shipment.origin,
    destination: shipment.destination,
    mode: shipment.type,
    eta: shipment.eta,
    lastUpdate: new Date().toISOString(),
    events: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        location: shipment.origin,
        description: "Shipment booked and cargo received",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        location: shipment.origin,
        description: "Departed origin hub",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        location: "En route",
        description: `Status: ${shipment.status}`,
      },
    ],
  };
}

export async function findTrackingById(
  trackingId: string,
): Promise<TrackingResult | null> {
  const shipments = await listShipments();
  const shipment = shipments.find(
    (row) => row.id.toLowerCase() === trackingId.toLowerCase(),
  );
  if (!shipment) return null;
  return buildTrackingResult(shipment);
}
