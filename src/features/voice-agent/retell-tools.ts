import { z } from "zod";
import {
  APPOINTMENT_TYPES,
  MEETING_MODES,
  TIME_SLOTS,
} from "@/features/appointment/schemas";
import {
  bookAppointment,
  lookupTracking,
  submitVoiceQuote,
} from "@/features/voice-agent/actions";
import { normalizeVoiceBookingArgs } from "@/features/voice-agent/booking-normalize";
import { logger } from "@/lib/logger";
import {
  VOICE_QUOTE_SERVICES,
  type QuoteDraft,
} from "@/features/voice-agent/schemas";
import { buildSiteKnowledge } from "@/features/voice-agent/knowledge";

const bookSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  appointmentType: z.enum(APPOINTMENT_TYPES),
  preferredDate: z.string().min(8),
  preferredTime: z.enum(TIME_SLOTS),
  meetingMode: z.enum(MEETING_MODES),
  notes: z.string().optional(),
});

const quoteSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  origin: z.string().min(2),
  destination: z.string().min(2),
  serviceType: z.enum(VOICE_QUOTE_SERVICES),
  cargo: z.string().min(4),
  approxWeight: z.string().optional(),
});

const trackSchema = z.object({
  trackingId: z.string().min(4),
});

export function parseRetellToolCall(
  body: unknown,
  fallbackName = "",
): {
  name: string;
  args: Record<string, unknown>;
} | null {
  if (!body || typeof body !== "object") {
    return fallbackName ? { name: fallbackName, args: {} } : null;
  }
  const record = body as Record<string, unknown>;
  const name =
    (typeof record.name === "string" && record.name) ||
    (typeof record.function_name === "string" && record.function_name) ||
    fallbackName;

  const nested = record.args ?? record.arguments ?? record.parameters;
  let args: Record<string, unknown> = {};
  if (typeof nested === "string") {
    try {
      const parsedJson: unknown = JSON.parse(nested);
      if (
        parsedJson &&
        typeof parsedJson === "object" &&
        !Array.isArray(parsedJson)
      ) {
        args = parsedJson as Record<string, unknown>;
      }
    } catch {
      args = {};
    }
  } else if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    args = nested as Record<string, unknown>;
  } else {
    args = { ...record };
    delete args.call;
    delete args.function_name;
    delete args.args;
    delete args.arguments;
    if (args.name === name) delete args.name;
  }
  if (!name) return null;
  return { name, args };
}

export async function runRetellTool(
  name: string,
  args: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (name === "get_site_info") {
    return {
      ok: true,
      spoken:
        "ExpressWay Logistic is a neutral NVOCC for air, ocean, customs, warehousing, and door-to-door cargo.",
      knowledge: buildSiteKnowledge().slice(0, 3500),
    };
  }

  if (name === "book_appointment") {
    const parsed = bookSchema.safeParse(normalizeVoiceBookingArgs(args));
    if (!parsed.success) {
      logger.warn("voice-agent.retell.book.invalid", {
        issues: parsed.error.issues.map((issue) => issue.path.join(".")),
      });
      return {
        ok: false,
        spoken:
          "I still need a complete weekday booking: name, company, email, phone, meeting type, a Monday–Friday date as YYYY-MM-DD, a slot such as 10:00 or 15:00, and video, phone, or in-person.",
      };
    }
    const booked = await bookAppointment(parsed.data);
    if ("error" in booked) return { ok: false, spoken: booked.error };
    return {
      ok: true,
      referenceId: booked.referenceId,
      spoken: `Appointment booked. Reference ${booked.referenceId}. Confirmation will follow by email.`,
    };
  }

  if (name === "submit_quote") {
    const parsed = quoteSchema.safeParse(args);
    if (!parsed.success) {
      return {
        ok: false,
        spoken:
          "I still need name, company, email, phone, origin, destination, service type, and cargo details.",
      };
    }
    const quoted = await submitVoiceQuote(parsed.data as QuoteDraft);
    if ("error" in quoted) return { ok: false, spoken: quoted.error };
    return {
      ok: true,
      referenceId: quoted.referenceId,
      spoken: `Quote request submitted. Reference ${quoted.referenceId}. The team typically replies within two business hours. I did not quote a price.`,
    };
  }

  if (name === "track_shipment") {
    const parsed = trackSchema.safeParse(args);
    if (!parsed.success) {
      return {
        ok: false,
        spoken: "Please share a tracking ID such as EW-10846.",
      };
    }
    const tracked = lookupTracking(parsed.data.trackingId);
    return {
      ok: tracked.found,
      trackingId: tracked.trackingId,
      spoken: tracked.spoken,
    };
  }

  return { ok: false, spoken: "I do not have that tool." };
}
