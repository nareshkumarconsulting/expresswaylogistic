import type { QuoteFormValues } from "@/features/contact/schemas";
import type {
  AppointmentFormValues,
  AppointmentType,
  MeetingMode,
} from "@/features/appointment/schemas";
import {
  APPOINTMENT_TYPE_LABELS,
  APPOINTMENT_TYPES,
  MEETING_MODES,
} from "@/features/appointment/schemas";
import { siteConfig } from "@/config/site";
import {
  formatQuoteAddOns,
  formatCargoTotals,
  TRANSPORT_MODE_LABELS,
  type QuoteWizardValues,
  type TransportMode,
} from "@/features/quote/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type {
  CalendarEvent,
  CalendarEventStatus,
  ProductType,
  QuoteRequest,
  QuoteServiceType,
} from "@/types";

type QuoteRequestRow = Database["public"]["Tables"]["quote_requests"]["Row"];
type QuoteRequestInsert =
  Database["public"]["Tables"]["quote_requests"]["Insert"];
type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type AppointmentInsert = Database["public"]["Tables"]["appointments"]["Insert"];
type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

function isAppointmentType(value: string): value is AppointmentType {
  return (APPOINTMENT_TYPES as readonly string[]).includes(value);
}

function isMeetingMode(value: string): value is MeetingMode {
  return (MEETING_MODES as readonly string[]).includes(value);
}

function mapAppointmentStatusToCalendarStatus(
  status: AppointmentStatus,
): CalendarEventStatus {
  switch (status) {
    case "pending":
    case "confirmed":
    case "completed":
      return status;
    default:
      return "pending";
  }
}

export function mapAppointmentRowToCalendarEvent(
  row: AppointmentRow,
): CalendarEvent {
  const appointmentType = isAppointmentType(row.appointment_type)
    ? row.appointment_type
    : undefined;
  const typeLabel =
    appointmentType != null
      ? APPOINTMENT_TYPE_LABELS[appointmentType]
      : row.appointment_type;
  const meetingMode = isMeetingMode(row.meeting_mode)
    ? row.meeting_mode
    : undefined;

  return {
    id: row.id,
    title: `${typeLabel} — ${row.company}`,
    kind: "appointment",
    date: row.preferred_date,
    startTime: row.preferred_time,
    status: mapAppointmentStatusToCalendarStatus(row.status),
    company: row.company,
    location:
      meetingMode === "in-person" || row.appointment_type === "warehouse-visit"
        ? siteConfig.contact.address
        : undefined,
    meetingMode,
    appointmentType,
    relatedId: row.id,
    notes: row.notes ?? undefined,
  };
}

export function mapTransportModeToServiceType(
  mode: TransportMode,
): QuoteServiceType {
  switch (mode) {
    case "air":
      return "air";
    case "lcl":
      return "ocean-lcl";
    case "fcl":
      return "ocean-fcl";
  }
}

export function buildQuoteWizardMessage(data: QuoteWizardValues): string {
  const totals = formatCargoTotals(data.cargoItems);
  const addOns = formatQuoteAddOns(data);

  return [
    `Transport: ${TRANSPORT_MODE_LABELS[data.transportMode]}`,
    `Cargo ready: ${data.cargoReadyDate}`,
    `Line items: ${data.cargoItems.length} · ${totals.weightKg} kg · ${totals.cbm} CBM`,
    addOns.length > 0 ? `Add-ons: ${addOns.join(", ")}` : null,
    data.dangerousCargoNotes
      ? `Special notes: ${data.dangerousCargoNotes}`
      : null,
  ]
    .filter((line): line is string => line != null)
    .join("\n");
}

export function mapContactFormToQuoteInsert(
  data: QuoteFormValues,
  referenceId: string,
): QuoteRequestInsert {
  return {
    id: referenceId,
    source: "contact_form",
    name: data.name,
    company: data.company,
    company_address: data.companyAddress,
    email: data.email,
    phone: data.phone ?? null,
    origin: data.origin,
    destination: data.destination,
    service_type: data.serviceType,
    product_type: data.productType,
    total_packages: data.totalPackages,
    approx_weight: data.approxWeight,
    container_size: data.containerSize ?? null,
    container_type: data.containerType ?? null,
    value_inr: data.valueInr,
    message: data.message,
    payload: data as unknown as QuoteRequestInsert["payload"],
  };
}

export function mapQuoteWizardToQuoteInsert(
  data: QuoteWizardValues,
  referenceId: string,
): QuoteRequestInsert {
  return {
    id: referenceId,
    source: "quote_wizard",
    name: `${data.firstName} ${data.lastName}`.trim(),
    company: data.company,
    email: data.email,
    phone: data.phone ?? null,
    origin: data.origin,
    destination: data.destination,
    service_type: mapTransportModeToServiceType(data.transportMode),
    message: buildQuoteWizardMessage(data),
    payload: data as unknown as QuoteRequestInsert["payload"],
  };
}

export function mapAppointmentToInsert(
  data: AppointmentFormValues,
  referenceId: string,
  source: "form" | "voice_agent" = "form",
  extraPayload: Record<string, unknown> = {},
): AppointmentInsert {
  return {
    id: referenceId,
    source,
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    appointment_type: data.appointmentType,
    preferred_date: data.preferredDate,
    preferred_time: data.preferredTime,
    meeting_mode: data.meetingMode,
    notes: data.notes ?? null,
    payload: {
      ...extraPayload,
      ...data,
    } as AppointmentInsert["payload"],
  };
}

export function mapQuoteRowToQuoteRequest(row: QuoteRequestRow): QuoteRequest {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    companyAddress: row.company_address ?? undefined,
    email: row.email,
    phone: row.phone ?? undefined,
    origin: row.origin,
    destination: row.destination,
    serviceType: (row.service_type ?? "air") as QuoteServiceType,
    productType: row.product_type
      ? (row.product_type as ProductType)
      : undefined,
    totalPackages: row.total_packages ?? undefined,
    approxWeight: row.approx_weight ?? undefined,
    containerSize:
      row.container_size === "20ft" || row.container_size === "40ft"
        ? row.container_size
        : undefined,
    containerType:
      row.container_type === "general-purpose" ||
      row.container_type === "high-cube" ||
      row.container_type === "reefer" ||
      row.container_type === "open-top" ||
      row.container_type === "flat-rack"
        ? row.container_type
        : undefined,
    valueInr: row.value_inr != null ? Number(row.value_inr) : undefined,
    message: row.message,
    status: row.status,
    submittedAt: row.submitted_at,
    internalNotes: row.internal_notes ?? undefined,
    quotedAmount: row.quoted_amount ?? undefined,
    updatedAt: row.updated_at,
  };
}

export async function insertQuoteRequest(
  row: QuoteRequestInsert,
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("quote_requests").insert(row);

  if (error) {
    logger.error("supabase.quote.insert.failed", {
      referenceId: row.id,
      error: error.message,
    });
    throw new Error("Failed to save quote request");
  }

  logger.info("supabase.quote.inserted", { referenceId: row.id });
}

export async function insertAppointment(
  row: AppointmentInsert,
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("appointments").insert(row);

  if (error) {
    logger.error("supabase.appointment.insert.failed", {
      referenceId: row.id,
      error: error.message,
    });
    throw new Error("Failed to save appointment");
  }

  logger.info("supabase.appointment.inserted", { referenceId: row.id });
}

export async function listQuoteRequests(): Promise<QuoteRequest[] | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    logger.error("supabase.quote.list.failed", { error: error.message });
    throw new Error("Failed to load quote requests");
  }

  return (data ?? []).map(mapQuoteRowToQuoteRequest);
}

export async function listAppointments(): Promise<CalendarEvent[] | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .neq("status", "cancelled")
    .order("preferred_date", { ascending: true })
    .order("preferred_time", { ascending: true });

  if (error) {
    logger.error("supabase.appointment.list.failed", { error: error.message });
    throw new Error("Failed to load appointments");
  }

  return (data ?? []).map(mapAppointmentRowToCalendarEvent);
}
