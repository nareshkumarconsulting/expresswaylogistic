import type {
  CreateShipmentInput,
  UpdateShipmentInput,
} from "@/features/shipments/schemas";
import { riskScoreFromStatus } from "@/features/shipments/labels";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  mapShipmentRowToListItem,
  mapShipmentRowToManaged,
  memoryCreateShipment,
  memoryGetShipment,
  memoryListShipments,
  memoryUpdateShipment,
  type ShipmentRow,
} from "@/services/shipments-memory";
import type { ManagedShipment, Shipment } from "@/types";

type ShipmentDbRow = Database["public"]["Tables"]["shipments"]["Row"];

function mapDbRow(row: ShipmentDbRow): ShipmentRow {
  return {
    id: row.id,
    clientCompany: row.client_company,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone ?? undefined,
    bookingBasis: row.booking_basis,
    assignedTo: row.assigned_to ?? undefined,
    origin: row.origin,
    destination: row.destination,
    freightMode: row.freight_mode as ShipmentRow["freightMode"],
    pickupLocation: row.pickup_location ?? undefined,
    deliveryLocation: row.delivery_location ?? undefined,
    cargoReadyDate: row.cargo_ready_date ?? "",
    targetDeliveryDate: row.target_delivery_date ?? undefined,
    productType: (row.product_type ?? "other") as ShipmentRow["productType"],
    totalPackages: row.total_packages ?? undefined,
    approxWeight: row.approx_weight ?? undefined,
    containerSize: (row.container_size ?? undefined) as ShipmentRow["containerSize"],
    containerType: (row.container_type ?? undefined) as ShipmentRow["containerType"],
    valueInr: row.value_inr != null ? Number(row.value_inr) : undefined,
    carrierName: row.carrier_name ?? undefined,
    carrierRef: row.carrier_ref ?? undefined,
    forwarderId: row.forwarder_id ?? undefined,
    estimatedEta: row.estimated_eta ?? undefined,
    internalNotes: row.internal_notes ?? undefined,
    status: row.status,
    riskScore: row.risk_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toInsert(input: CreateShipmentInput, id: string) {
  return {
    id,
    client_company: input.clientCompany,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone ?? null,
    booking_basis: input.bookingBasis,
    assigned_to: input.assignedTo ?? null,
    origin: input.origin,
    destination: input.destination,
    freight_mode: input.freightMode,
    pickup_location: input.pickupLocation ?? null,
    delivery_location: input.deliveryLocation ?? null,
    cargo_ready_date: input.cargoReadyDate || null,
    target_delivery_date: input.targetDeliveryDate || null,
    product_type: input.productType,
    total_packages: input.totalPackages ?? null,
    approx_weight: input.approxWeight ?? null,
    container_size: input.containerSize ?? null,
    container_type: input.containerType ?? null,
    value_inr: input.valueInr ?? null,
    carrier_name: input.carrierName ?? null,
    carrier_ref: input.carrierRef ?? null,
    forwarder_id: input.forwarderId || null,
    estimated_eta: input.estimatedEta
      ? new Date(input.estimatedEta).toISOString()
      : null,
    internal_notes: input.internalNotes ?? null,
    status: "Processing" as const,
    risk_score: riskScoreFromStatus("Processing"),
  };
}

function toUpdatePatch(patch: UpdateShipmentInput) {
  const next: Database["public"]["Tables"]["shipments"]["Update"] = {};

  if (patch.status) {
    next.status = patch.status;
    next.risk_score = riskScoreFromStatus(patch.status);
  }
  if (patch.carrierName !== undefined) {
    next.carrier_name = patch.carrierName || null;
  }
  if (patch.carrierRef !== undefined) {
    next.carrier_ref = patch.carrierRef || null;
  }
  if (patch.estimatedEta !== undefined) {
    next.estimated_eta = patch.estimatedEta
      ? new Date(patch.estimatedEta).toISOString()
      : null;
  }
  if (patch.internalNotes !== undefined) {
    next.internal_notes = patch.internalNotes || null;
  }
  if (patch.assignedTo !== undefined) {
    next.assigned_to = patch.assignedTo || null;
  }

  return next;
}

async function nextShipmentIdFromDb(): Promise<string> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("shipments")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error || !data?.length) return "EW-10001";

  const latest = data[0]?.id ?? "EW-10000";
  const number = Number.parseInt(latest.replace(/^EW-/i, ""), 10);
  if (Number.isNaN(number)) return "EW-10001";
  return `EW-${number + 1}`;
}

export async function listShipments(): Promise<Shipment[]> {
  if (!isSupabaseConfigured()) return memoryListShipments();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingRelationError(error)) {
      logger.warn("shipments.list.missing_table", { error: error.message });
      return memoryListShipments();
    }
    logger.error("shipments.list.failed", { error: error.message });
    throw new Error("Failed to load shipments");
  }

  return (data ?? []).map((row) => mapShipmentRowToListItem(mapDbRow(row)));
}

export async function getShipmentById(
  id: string,
): Promise<ManagedShipment | null> {
  if (!isSupabaseConfigured()) return memoryGetShipment(id);

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error)) {
      logger.warn("shipments.get.missing_table", { error: error.message });
      return memoryGetShipment(id);
    }
    logger.error("shipments.get.failed", { error: error.message });
    throw new Error("Failed to load shipment");
  }

  if (!data) return null;
  return mapShipmentRowToManaged(mapDbRow(data));
}

export async function createShipment(
  input: CreateShipmentInput,
): Promise<Shipment> {
  if (!isSupabaseConfigured()) {
    return mapShipmentRowToListItem(memoryCreateShipment(input));
  }

  const supabase = createSupabaseAdmin();
  const id = await nextShipmentIdFromDb();
  const { data, error } = await supabase
    .from("shipments")
    .insert(toInsert(input, id))
    .select("*")
    .single();

  if (error) {
    if (isMissingRelationError(error)) {
      logger.warn("shipments.create.missing_table", { error: error.message });
      return mapShipmentRowToListItem(memoryCreateShipment(input));
    }
    logger.error("shipments.create.failed", { error: error.message });
    throw new Error("Failed to create shipment");
  }

  return mapShipmentRowToListItem(mapDbRow(data));
}

export async function updateShipment(
  id: string,
  patch: UpdateShipmentInput,
): Promise<ManagedShipment | null> {
  if (!isSupabaseConfigured()) return memoryUpdateShipment(id, patch);

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("shipments")
    .update(toUpdatePatch(patch))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error)) {
      logger.warn("shipments.update.missing_table", { error: error.message });
      return memoryUpdateShipment(id, patch);
    }
    logger.error("shipments.update.failed", { error: error.message });
    throw new Error("Failed to update shipment");
  }

  if (!data) return null;
  return mapShipmentRowToManaged(mapDbRow(data));
}
