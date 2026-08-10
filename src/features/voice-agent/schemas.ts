import { z } from "zod";
import {
  APPOINTMENT_TYPES,
  MEETING_MODES,
  TIME_SLOTS,
} from "@/features/appointment/schemas";

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
});

export type BookingDraft = z.infer<typeof bookingDraftSchema>;

export const voiceAgentMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const voiceAgentRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(voiceAgentMessageSchema).max(20).optional(),
  bookingDraft: bookingDraftSchema.optional(),
});

export type VoiceAgentRequest = z.infer<typeof voiceAgentRequestSchema>;

export type VoiceAgentAction =
  | { type: "none" }
  | { type: "navigate"; href: string; label: string }
  | {
      type: "appointment_booked";
      referenceId: string;
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
    action: VoiceAgentAction;
  };
};
