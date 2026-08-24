import type { ManagedShipment, Shipment, TrackingResult } from "@/types";
import {
  getShipmentById,
  listShipments,
} from "@/services/shipments-repository";

type TrackingSource = Shipment & {
  createdAt?: string;
  estimatedEtaIso?: string;
};

export function buildTrackingResult(shipment: TrackingSource): TrackingResult {
  return {
    trackingId: shipment.id,
    status: shipment.status,
    origin: shipment.origin,
    destination: shipment.destination,
    mode: shipment.type,
    eta: shipment.eta,
    lastUpdate: new Date().toISOString(),
    createdAt: shipment.createdAt,
    estimatedEtaIso: shipment.estimatedEtaIso,
    predictedEtaHours: shipment.predictedEtaHours,
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

function fromManaged(shipment: ManagedShipment): TrackingSource {
  return {
    ...shipment,
    createdAt: shipment.createdAt,
    estimatedEtaIso: shipment.estimatedEtaIso,
  };
}

export async function findTrackingById(
  trackingId: string,
): Promise<TrackingResult | null> {
  const direct = await getShipmentById(trackingId);
  if (direct) return buildTrackingResult(fromManaged(direct));

  const shipments = await listShipments();
  const listed = shipments.find(
    (row) => row.id.toLowerCase() === trackingId.toLowerCase(),
  );
  if (!listed) return null;

  const managed = await getShipmentById(listed.id);
  if (managed) return buildTrackingResult(fromManaged(managed));
  return buildTrackingResult(listed);
}
