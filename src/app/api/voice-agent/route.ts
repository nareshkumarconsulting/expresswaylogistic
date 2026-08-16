import { NextResponse } from "next/server";
import {
  bookAppointment,
  lookupTracking,
  submitVoiceQuote,
} from "@/features/voice-agent/actions";
import { polishReplyWithLlm } from "@/features/voice-agent/llm";
import { runReceptionistTurn } from "@/features/voice-agent/receptionist";
import {
  voiceAgentRequestSchema,
  type VoiceAgentAction,
  type VoiceAgentResponse,
} from "@/features/voice-agent/schemas";
import { logger } from "@/lib/logger";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";

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
      signal: AbortSignal.timeout(2000),
    });
  } catch (error) {
    logger.warn("voice-agent.webhook.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }
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
      quoteDraft: parsed.data.quoteDraft,
      trackingDraft: parsed.data.trackingDraft,
    });

    let reply = turn.reply;
    let action: VoiceAgentAction = turn.action;
    let bookingDraft = turn.bookingDraft;
    let quoteDraft = turn.quoteDraft;
    let trackingDraft = turn.trackingDraft;
    let skipPolish = false;

    if (turn.readyToBook) {
      skipPolish = true;
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
    } else if (turn.readyToQuote) {
      skipPolish = true;
      const quoted = await submitVoiceQuote(quoteDraft);
      if ("referenceId" in quoted) {
        reply = `You're all set. Your quote reference is ${quoted.referenceId}. ${QUOTE_RESPONSE_STATEMENT} Anything else I can help with?`;
        action = {
          type: "quote_submitted",
          referenceId: quoted.referenceId,
        };
        quoteDraft = {};
      } else {
        reply = quoted.error;
      }
    } else if (turn.lookupTrackingId) {
      skipPolish = true;
      const tracked = lookupTracking(turn.lookupTrackingId);
      const href = tracked.found
        ? `/track?id=${encodeURIComponent(tracked.trackingId)}`
        : "/track";
      reply = tracked.spoken;
      action = {
        type: "tracking_result",
        trackingId: tracked.trackingId,
        found: tracked.found,
        href,
      };
      if (tracked.found) trackingDraft = {};
    }

    const spokenHindi = /\b(kya|aap|hai|hain|chahie|chahiye|naam|mein)\b/i.test(
      parsed.data.message,
    );

    if (
      !skipPolish &&
      spokenHindi &&
      !bookingDraft.inProgress &&
      !quoteDraft.inProgress
    ) {
      const polished = await polishReplyWithLlm({
        message: parsed.data.message,
        draftReply: reply,
        bookingDraft,
        quoteDraft,
        history: parsed.data.history,
      });
      if (polished?.reply) reply = polished.reply;
    }

    void forwardVoiceTurnWebhook({
      type: "voice_agent_turn",
      intent: turn.intent,
      message: parsed.data.message,
      reply,
      bookingDraft,
      quoteDraft,
      trackingDraft,
      receivedAt: new Date().toISOString(),
    });

    logger.info("voice-agent.turn", {
      intent: turn.intent,
      action: action.type,
      readyToBook: turn.readyToBook,
      readyToQuote: turn.readyToQuote,
      lookupTrackingId: turn.lookupTrackingId,
    });

    const response: VoiceAgentResponse = {
      success: true,
      data: {
        reply,
        intent: turn.intent,
        bookingDraft,
        quoteDraft,
        trackingDraft,
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
