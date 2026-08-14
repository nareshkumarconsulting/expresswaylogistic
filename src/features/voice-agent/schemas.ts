import { z } from "zod";
import {
  APPOINTMENT_TYPES,
  MEETING_MODES,
  TIME_SLOTS,
} from "@/features/appointment/schemas";

export const VOICE_QUOTE_SERVICES = [
  "air",
  "ocean-fcl",
  "ocean-lcl",
  "consolidation",
  "customs",
  "warehousing",
  "door-to-door",
  "project-cargo",
  "cargo-insurance",
  "exim-advisory",
  "packing",
] as const;

export const bookingDraftSchema = z.object({
  inProgress: z.boolean().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  appointmentType: z.enum(APPOINTMENT_TYPES).optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.enum(TIME_SLOTS).optional(),
  meetingMode: z.enum(MEETING_MODES).optional(),
  notes: z.string().optional(),
  locale: z.enum(["en", "hi"]).optional(),
});

export type BookingDraft = z.infer<typeof bookingDraftSchema>;

export const quoteDraftSchema = z.object({
  inProgress: z.boolean().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  serviceType: z.enum(VOICE_QUOTE_SERVICES).optional(),
  cargo: z.string().optional(),
  approxWeight: z.string().optional(),
  locale: z.enum(["en", "hi"]).optional(),
});

export type QuoteDraft = z.infer<typeof quoteDraftSchema>;

export const trackingDraftSchema = z.object({
  inProgress: z.boolean().optional(),
  trackingId: z.string().optional(),
});

export type TrackingDraft = z.infer<typeof trackingDraftSchema>;

export const voiceAgentMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const voiceAgentRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(voiceAgentMessageSchema).max(20).optional(),
  bookingDraft: bookingDraftSchema.optional(),
  quoteDraft: quoteDraftSchema.optional(),
  trackingDraft: trackingDraftSchema.optional(),
});

export type VoiceAgentRequest = z.infer<typeof voiceAgentRequestSchema>;

export type VoiceAgentAction =
  | { type: "none" }
  | { type: "navigate"; href: string; label: string }
  | {
      type: "appointment_booked";
      referenceId: string;
    }
  | {
      type: "quote_submitted";
      referenceId: string;
    }
  | {
      type: "tracking_result";
      trackingId: string;
      found: boolean;
      href: string;
    };

export type VoiceAgentResponse = {
  success: true;
  data: {
    reply: string;
    intent:
      | "greeting"
      | "services"
      | "process"
      | "industries"
      | "contact"
      | "quote"
      | "tracking"
      | "appointment"
      | "about"
      | "faq"
      | "unknown"
      | "goodbye";
    bookingDraft: BookingDraft;
    quoteDraft: QuoteDraft;
    trackingDraft: TrackingDraft;
    action: VoiceAgentAction;
  };
};
