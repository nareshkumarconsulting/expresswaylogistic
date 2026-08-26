import type {
  CreateShipmentInput,
  UpdateShipmentInput,
} from "@/features/shipments/schemas";
import { riskScoreFromStatus } from "@/features/shipments/labels";
import { createNextShipmentId } from "@/lib/reference-id";
import type { ManagedShipment, Shipment } from "@/types";

export type ShipmentRow = CreateShipmentInput & {
  id: string;
  status: Shipment["status"];
  riskScore: number;
  createdAt: string;
  updatedAt: string;
};

let shipments: ShipmentRow[] = [];

export function memoryListShipments(): Shipment[] {
  return shipments.map(mapShipmentRowToListItem);
}

export function memoryGetShipment(id: string): ManagedShipment | null {
  const row = shipments.find(
    (item) => item.id.toLowerCase() === id.toLowerCase(),
  );
  if (!row) return null;
  return mapShipmentRowToManaged(row);
}

export function memoryCreateShipment(
  input: CreateShipmentInput,
): ShipmentRow {
  const now = new Date().toISOString();
  const row: ShipmentRow = {
    ...input,
    forwarderId: input.forwarderId || undefined,
    id: nextShipmentId(shipments.map(mapShipmentRowToListItem)),
    status: "Processing",
    riskScore: riskScoreFromStatus("Processing"),
    createdAt: now,
    updatedAt: now,
  };
  shipments = [row, ...shipments];
  return row;
}

export function memoryUpdateShipment(
  id: string,
  patch: UpdateShipmentInput,
): ManagedShipment | null {
  const index = shipments.findIndex(
    (item) => item.id.toLowerCase() === id.toLowerCase(),
  );
  if (index < 0) return null;

  const current = shipments[index]!;
  const nextStatus = patch.status ?? current.status;
  const updated: ShipmentRow = {
    ...current,
    status: nextStatus,
    riskScore: riskScoreFromStatus(nextStatus),
    carrierName: patch.carrierName ?? current.carrierName,
    carrierRef: patch.carrierRef ?? current.carrierRef,
    estimatedEta:
      patch.estimatedEta !== undefined
        ? patch.estimatedEta || undefined
        : current.estimatedEta,
    internalNotes:
      patch.internalNotes !== undefined
        ? patch.internalNotes
        : current.internalNotes,
    assignedTo:
      patch.assignedTo !== undefined ? patch.assignedTo : current.assignedTo,
    updatedAt: new Date().toISOString(),
  };

  shipments = [
    ...shipments.slice(0, index),
    updated,
    ...shipments.slice(index + 1),
  ];
  return mapShipmentRowToManaged(updated);
}

export function mapShipmentRowToListItem(row: ShipmentRow): Shipment {
  return {
    id: row.id,
    origin: row.origin,
    destination: row.destination,
    type: row.freightMode,
    status: row.status,
    eta: formatShipmentEta(row.estimatedEta),
    client: row.clientCompany,
    predictedEtaHours: etaHoursFromIso(row.estimatedEta),
    riskScore: row.riskScore,
  };
}

export function mapShipmentRowToManaged(row: ShipmentRow): ManagedShipment {
  return {
    ...mapShipmentRowToListItem(row),
    contactName: row.contactName,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    bookingBasis: row.bookingBasis,
    pickupLocation: row.pickupLocation,
    deliveryLocation: row.deliveryLocation,
    cargoReadyDate: row.cargoReadyDate,
    targetDeliveryDate: row.targetDeliveryDate,
    productType: row.productType,
    totalPackages: row.totalPackages,
    approxWeight: row.approxWeight,
    carrierName: row.carrierName,
    carrierRef: row.carrierRef,
    internalNotes: row.internalNotes,
    assignedTo: row.assignedTo,
    estimatedEtaIso: row.estimatedEta,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function nextShipmentId(existing: Shipment[]): string {
  return createNextShipmentId(existing.map((item) => item.id));
}

function formatShipmentEta(iso?: string): string {
  if (!iso) return "Pending";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Pending";
  const diffMs = date.getTime() - Date.now();
  if (diffMs <= 0) return "Due";
  const hours = diffMs / (1000 * 60 * 60);
  if (hours < 24) return `${Math.ceil(hours)} hours`;
  const days = Math.ceil(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

function etaHoursFromIso(iso?: string): number | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  const diffMs = date.getTime() - Date.now();
  if (diffMs <= 0) return 0;
  return Math.round(diffMs / (1000 * 60 * 60));
}
