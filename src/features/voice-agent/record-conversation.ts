import type {
  BookingDraft,
  QuoteDraft,
  VoiceAgentAction,
} from "@/features/voice-agent/schemas";
import { recordAvaTurn } from "@/services/ava-conversations-repository";
import type { AvaChannel, AvaOutcome } from "@/types";

const EXTERNAL_ID = /^[A-Za-z0-9_-]{8,80}$/;

export function createConversationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ava_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isConversationExternalId(value: string): boolean {
  return EXTERNAL_ID.test(value);
}

function outcomeFromAction(
  action: VoiceAgentAction,
): { outcome?: Exclude<AvaOutcome, "none">; referenceId?: string } {
  switch (action.type) {
    case "quote_submitted":
      return { outcome: "quote", referenceId: action.referenceId };
    case "appointment_booked":
      return { outcome: "appointment", referenceId: action.referenceId };
    case "tracking_result":
      return { outcome: "tracking", referenceId: action.trackingId };
    default:
      return {};
  }
}

export async function recordVoiceAgentTurn(input: {
  conversationId?: string;
  channel?: AvaChannel;
  message: string;
  reply: string;
  intent?: string;
  openingMessage?: string;
  bookingDraft?: BookingDraft;
  quoteDraft?: QuoteDraft;
  action: VoiceAgentAction;
}): Promise<string> {
  const externalId =
    input.conversationId && isConversationExternalId(input.conversationId)
      ? input.conversationId
      : createConversationId();

  await recordAvaTurn({
    externalId,
    channel: input.channel ?? "browser",
    userMessage: input.message,
    assistantMessage: input.reply,
    intent: input.intent,
    openingMessage: input.openingMessage,
    visitorName: input.quoteDraft?.name || input.bookingDraft?.name,
    visitorCompany: input.quoteDraft?.company || input.bookingDraft?.company,
    visitorEmail: input.quoteDraft?.email || input.bookingDraft?.email,
    visitorPhone: input.quoteDraft?.phone || input.bookingDraft?.phone,
    ...outcomeFromAction(input.action),
  });

  return externalId;
}
