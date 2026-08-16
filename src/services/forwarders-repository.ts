import type { ForwarderUpsertInput } from "@/features/quotes/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { isForeignKeyError, isMissingRelationError } from "@/lib/supabase/errors";
import {
  memoryDeleteForwarder,
  memoryGetForwarder,
  memoryListForwarders,
  memorySaveForwarder,
} from "@/services/quotes-memory";
import type { Forwarder } from "@/types";

type ForwarderRow = Database["public"]["Tables"]["forwarders"]["Row"];

export function mapForwarderRow(row: ForwarderRow): Forwarder {
  return {
    id: row.id,
    companyName: row.company_name,
    contactPerson: row.contact_person ?? undefined,
    email: row.email,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    country: row.country ?? undefined,
    serviceTypes: row.service_types ?? [],
    originLocations: row.origin_locations ?? [],
    destinationLocations: row.destination_locations ?? [],
    preferredRoutes: row.preferred_routes ?? undefined,
    notes: row.notes ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listForwarders(): Promise<Forwarder[]> {
  if (!isSupabaseConfigured()) return memoryListForwarders();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("forwarders")
    .select("*")
    .order("company_name", { ascending: true });

  if (error) {
    if (isMissingRelationError(error)) {
      logger.warn("forwarders.list.missing_table", { error: error.message });
      return memoryListForwarders();
    }
    logger.error("forwarders.list.failed", { error: error.message });
    throw new Error("Failed to load forwarders");
  }

  return (data ?? []).map(mapForwarderRow);
}

export async function getForwarder(id: string): Promise<Forwarder | null> {
  if (!isSupabaseConfigured()) return memoryGetForwarder(id);

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("forwarders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error)) {
      return memoryGetForwarder(id);
    }
    logger.error("forwarders.get.failed", { error: error.message });
    throw new Error("Failed to load forwarder");
  }
  return data ? mapForwarderRow(data) : null;
}

function toInsert(input: ForwarderUpsertInput) {
  return {
    company_name: input.companyName,
    contact_person: input.contactPerson ?? null,
    email: input.email,
    phone: input.phone ?? null,
    address: input.address ?? null,
    country: input.country ?? null,
    service_types: input.serviceTypes ?? [],
    origin_locations: input.originLocations ?? [],
    destination_locations: input.destinationLocations ?? [],
    preferred_routes: input.preferredRoutes ?? null,
    notes: input.notes ?? null,
    status: input.status ?? "Active",
  };
}

export async function createForwarder(
  input: ForwarderUpsertInput,
): Promise<Forwarder> {
  if (!isSupabaseConfigured()) {
    const now = new Date().toISOString();
    return memorySaveForwarder({
      id: crypto.randomUUID(),
      companyName: input.companyName,
      contactPerson: input.contactPerson,
      email: input.email,
      phone: input.phone,
      address: input.address,
      country: input.country,
      serviceTypes: input.serviceTypes ?? [],
      originLocations: input.originLocations ?? [],
      destinationLocations: input.destinationLocations ?? [],
      preferredRoutes: input.preferredRoutes,
      notes: input.notes,
      status: input.status ?? "Active",
      createdAt: now,
      updatedAt: now,
    });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("forwarders")
    .insert(toInsert(input))
    .select("*")
    .single();

  if (error || !data) {
    if (isMissingRelationError(error)) {
      const now = new Date().toISOString();
      return memorySaveForwarder({
        id: crypto.randomUUID(),
        companyName: input.companyName,
        contactPerson: input.contactPerson,
        email: input.email,
        phone: input.phone,
        address: input.address,
        country: input.country,
        serviceTypes: input.serviceTypes ?? [],
        originLocations: input.originLocations ?? [],
        destinationLocations: input.destinationLocations ?? [],
        preferredRoutes: input.preferredRoutes,
        notes: input.notes,
        status: input.status ?? "Active",
        createdAt: now,
        updatedAt: now,
      });
    }
    logger.error("forwarders.create.failed", { error: error?.message });
    throw new Error("Failed to create forwarder");
  }
  return mapForwarderRow(data);
}

export async function updateForwarder(
  id: string,
  input: Partial<ForwarderUpsertInput>,
): Promise<Forwarder | null> {
  const current = await getForwarder(id);
  if (!current) return null;

  const merged: ForwarderUpsertInput = {
    companyName: input.companyName ?? current.companyName,
    contactPerson: input.contactPerson ?? current.contactPerson,
    email: input.email ?? current.email,
    phone: input.phone ?? current.phone,
    address: input.address ?? current.address,
    country: input.country ?? current.country,
    serviceTypes: input.serviceTypes ?? current.serviceTypes,
    originLocations: input.originLocations ?? current.originLocations,
    destinationLocations:
      input.destinationLocations ?? current.destinationLocations,
    preferredRoutes: input.preferredRoutes ?? current.preferredRoutes,
    notes: input.notes ?? current.notes,
    status: input.status ?? current.status,
  };

  if (!isSupabaseConfigured()) {
    return memorySaveForwarder({
      ...current,
      ...merged,
      updatedAt: new Date().toISOString(),
    });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("forwarders")
    .update(toInsert(merged))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    if (isMissingRelationError(error)) {
      return memorySaveForwarder({
        ...current,
        ...merged,
        updatedAt: new Date().toISOString(),
      });
    }
    logger.error("forwarders.update.failed", { error: error?.message });
    throw new Error("Failed to update forwarder");
  }
  return mapForwarderRow(data);
}

export class ForwarderInUseError extends Error {
  constructor() {
    super(
      "This forwarder is used on existing quotes. Mark it inactive instead of deleting.",
    );
    this.name = "ForwarderInUseError";
  }
}

export async function deleteForwarder(
  id: string,
): Promise<"deleted" | "not_found"> {
  const current = await getForwarder(id);
  if (!current) return "not_found";

  if (!isSupabaseConfigured()) {
    memoryDeleteForwarder(id);
    return "deleted";
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("forwarders").delete().eq("id", id);

  if (error) {
    if (isMissingRelationError(error)) {
      memoryDeleteForwarder(id);
      return "deleted";
    }
    if (isForeignKeyError(error)) {
      throw new ForwarderInUseError();
    }
    logger.error("forwarders.delete.failed", { error: error.message, id });
    throw new Error("Failed to delete forwarder");
  }

  return "deleted";
}
