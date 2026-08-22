import { appointmentFormSchema } from "@/features/appointment/schemas";
import { normalizeVoiceBookingArgs } from "@/features/voice-agent/booking-normalize";
import type { QuoteDraft } from "@/features/voice-agent/schemas";
import { notifyLead } from "@/lib/lead-notify";
import { logger } from "@/lib/logger";
import {
  createAppointmentReferenceId,
  createQuoteReferenceId,
} from "@/lib/reference-id";
import { findTrackingById } from "@/services/tracking-repository";
import {
  insertAppointment,
  insertQuoteRequest,
  mapAppointmentToInsert,
  mapVoiceQuoteToInsert,
} from "@/services/leads-repository";

export async function bookAppointment(
  draft: Record<string, unknown>,
): Promise<{ referenceId: string } | { error: string }> {
  const { inProgress: _inProgress, locale: _locale, ...payload } = draft;
  const parsed = appointmentFormSchema.safeParse(
    normalizeVoiceBookingArgs(payload),
  );
  if (!parsed.success) {
    logger.warn("voice-agent.appointment.invalid", {
      issues: parsed.error.issues.map((issue) => issue.path.join(".")),
    });
    return {
      error:
        "I still need a few valid booking details before I can confirm. Please use a Monday–Friday date and a slot such as 10:00 or 15:00.",
    };
  }

  const referenceId = createAppointmentReferenceId();

  try {
    await insertAppointment(
      mapAppointmentToInsert(parsed.data, referenceId, "voice_agent", {
        source: "voice_agent",
      }),
    );
  } catch (error) {
    logger.error("voice-agent.appointment.save_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return {
      error:
        "I could not save that appointment just now. Please try once more, or I can connect you with the team.",
    };
  }

  logger.info("voice-agent.appointment.booked", {
    company: parsed.data.company,
    appointmentType: parsed.data.appointmentType,
    preferredDate: parsed.data.preferredDate,
    preferredTime: parsed.data.preferredTime,
    meetingMode: parsed.data.meetingMode,
    referenceId,
  });

  await notifyLead({
    type: "appointment_request",
    subject: `[Voice Appointment] ${parsed.data.company} · ${referenceId}`,
    summaryLines: [
      `Source: voice agent`,
      `Contact: ${parsed.data.name} <${parsed.data.email}>`,
      `Phone: ${parsed.data.phone}`,
      `Type: ${parsed.data.appointmentType}`,
      `When: ${parsed.data.preferredDate} ${parsed.data.preferredTime}`,
      `Mode: ${parsed.data.meetingMode}`,
    ],
    payload: { source: "voice_agent", ...parsed.data },
    referenceId,
  });

  return { referenceId };
}

function isCompleteVoiceQuote(
  draft: QuoteDraft,
): draft is Required<
  Pick<
    QuoteDraft,
    | "name"
    | "company"
    | "email"
    | "phone"
    | "origin"
    | "destination"
    | "serviceType"
    | "cargo"
  >
> &
  QuoteDraft {
  return (
    Boolean(draft.name) &&
    Boolean(draft.company) &&
    Boolean(draft.email) &&
    Boolean(draft.phone) &&
    Boolean(draft.origin) &&
    Boolean(draft.destination) &&
    Boolean(draft.serviceType) &&
    Boolean(draft.cargo)
  );
}

export async function submitVoiceQuote(
  draft: QuoteDraft,
): Promise<{ referenceId: string } | { error: string }> {
  if (!isCompleteVoiceQuote(draft)) {
    return {
      error:
        "I still need name, company, email, phone, origin, destination, service, and cargo.",
    };
  }

  const referenceId = createQuoteReferenceId();
  const payload = {
    name: draft.name,
    company: draft.company,
    email: draft.email,
    phone: draft.phone,
    origin: draft.origin,
    destination: draft.destination,
    serviceType: draft.serviceType,
    cargo: draft.cargo,
    approxWeight: draft.approxWeight,
  };

  await insertQuoteRequest(mapVoiceQuoteToInsert(payload, referenceId));

  logger.info("voice-agent.quote.submitted", {
    company: payload.company,
    origin: payload.origin,
    destination: payload.destination,
    serviceType: payload.serviceType,
    referenceId,
  });

  await notifyLead({
    type: "quote_request",
    subject: `[Voice Quote] ${payload.company} · ${payload.origin} → ${payload.destination}`,
    summaryLines: [
      `Source: voice agent`,
      `Contact: ${payload.name} <${payload.email}>`,
      `Phone: ${payload.phone}`,
      `Service: ${payload.serviceType}`,
      `Lane: ${payload.origin} → ${payload.destination}`,
      payload.approxWeight ? `Weight: ${payload.approxWeight}` : "Weight: —",
      `Cargo: ${payload.cargo}`,
    ],
    payload: { source: "voice_agent", ...payload },
    referenceId,
  });

  return { referenceId };
}

export function spokenEta(eta: string): string {
  const date = new Date(eta);
  if (Number.isNaN(date.getTime())) return eta;
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export async function lookupTracking(trackingId: string) {
  const found = await findTrackingById(trackingId);
  if (!found) {
    return {
      found: false as const,
      trackingId,
      spoken: `I could not find ${trackingId}. Please check the ID.`,
    };
  }

  return {
    found: true as const,
    trackingId: found.trackingId,
    status: found.status,
    origin: found.origin,
    destination: found.destination,
    mode: found.mode,
    eta: found.eta,
    spoken: `${found.trackingId} is ${found.status}, ${found.mode} from ${found.origin} to ${found.destination}. Estimated arrival ${spokenEta(found.eta)}.`,
  };
}
