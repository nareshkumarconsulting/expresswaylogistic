import { NextResponse } from "next/server";
import { appointmentFormSchema } from "@/features/appointment/schemas";
import { polishReplyWithLlm } from "@/features/voice-agent/llm";
import { runReceptionistTurn } from "@/features/voice-agent/receptionist";
import {
  voiceAgentRequestSchema,
  type VoiceAgentAction,
  type VoiceAgentResponse,
} from "@/features/voice-agent/schemas";
import { notifyLead } from "@/lib/lead-notify";
import { logger } from "@/lib/logger";
import { createAppointmentReferenceId } from "@/lib/reference-id";
import {
  insertAppointment,
  mapAppointmentToInsert,
} from "@/services/leads-repository";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

async function notifyAppointmentLead(input: {
  payload: Record<string, unknown>;
  referenceId: string;
}) {
  await notifyLead({
    type: "appointment_request",
    subject: `[Voice Appointment] ${String(input.payload.company ?? "Lead")} · ${input.referenceId}`,
    summaryLines: [
      `Source: voice agent`,
      `Contact: ${String(input.payload.name ?? "—")} <${String(input.payload.email ?? "—")}>`,
      `Phone: ${String(input.payload.phone ?? "—")}`,
      `Type: ${String(input.payload.appointmentType ?? "—")}`,
      `When: ${String(input.payload.preferredDate ?? "—")} ${String(input.payload.preferredTime ?? "")}`,
      `Mode: ${String(input.payload.meetingMode ?? "—")}`,
    ],
    payload: {
      source: "voice_agent",
      ...input.payload,
    },
    referenceId: input.referenceId,
  });
}

async function forwardVoiceTurnWebhook(payload: Record<string, unknown>) {
  const webhook =
    process.env.VOICE_AGENT_WEBHOOK_URL?.trim() ||
    process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    logger.warn("voice-agent.webhook.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}

async function bookAppointment(
  draft: Record<string, unknown>,
): Promise<{ referenceId: string } | { error: string }> {
  const { inProgress: _inProgress, ...payload } = draft;
  const parsed = appointmentFormSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error:
        "I still need a few valid booking details before I can confirm. Please check the date is a weekday and the time is one of our slots.",
    };
  }

  const referenceId = createAppointmentReferenceId();

  await insertAppointment(
    mapAppointmentToInsert(parsed.data, referenceId, "voice_agent", {
      source: "voice_agent",
    }),
  );

  logger.info("voice-agent.appointment.booked", {
    company: parsed.data.company,
    appointmentType: parsed.data.appointmentType,
    preferredDate: parsed.data.preferredDate,
    preferredTime: parsed.data.preferredTime,
    meetingMode: parsed.data.meetingMode,
    referenceId,
  });

  await notifyAppointmentLead({
    payload: parsed.data as unknown as Record<string, unknown>,
    referenceId,
  });

  return { referenceId };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again shortly." },
        { status: 429 },
      );
    }

    const body: unknown = await request.json();
    const parsed = voiceAgentRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid voice agent request" },
        { status: 400 },
      );
    }

    const turn = runReceptionistTurn({
      message: parsed.data.message,
      bookingDraft: parsed.data.bookingDraft,
    });

    let reply = turn.reply;
    let action: VoiceAgentAction = turn.action;
    let bookingDraft = turn.bookingDraft;

    if (turn.readyToBook) {
      const booked = await bookAppointment(bookingDraft);
      if ("referenceId" in booked) {
        reply = `You're all set. Your appointment reference is ${booked.referenceId}. You'll receive confirmation details shortly. Anything else I can help with?`;
        action = {
          type: "appointment_booked",
          referenceId: booked.referenceId,
        };
        bookingDraft = {};
      } else {
        reply = booked.error;
      }
    } else {
      const polished = await polishReplyWithLlm({
        message: parsed.data.message,
        draftReply: reply,
        bookingDraft,
        history: parsed.data.history,
      });
      if (polished?.reply) reply = polished.reply;

      await forwardVoiceTurnWebhook({
        type: "voice_agent_turn",
        intent: turn.intent,
        message: parsed.data.message,
        reply,
        bookingDraft,
        receivedAt: new Date().toISOString(),
      });
    }

    logger.info("voice-agent.turn", {
      intent: turn.intent,
      action: action.type,
      readyToBook: turn.readyToBook,
    });

    const response: VoiceAgentResponse = {
      success: true,
      data: {
        reply,
        intent: turn.intent,
        bookingDraft,
        action,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("voice-agent.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Voice agent failed" },
      { status: 500 },
    );
  }
}
