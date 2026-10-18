import { NextResponse } from "next/server";
import {
  clientIp,
  getRetellToolSecret,
  isRetellRateLimited,
} from "@/features/voice-agent/retell-config";
import {
  parseRetellToolCall,
  runRetellTool,
} from "@/features/voice-agent/retell-tools";
import { isConversationExternalId } from "@/features/voice-agent/record-conversation";
import { logger } from "@/lib/logger";
import { noteAvaOutcome } from "@/services/ava-conversations-repository";
import type { AvaOutcome } from "@/types";

function textField(args: Record<string, unknown>, key: string) {
  const value = args[key];
  return typeof value === "string" ? value : undefined;
}

function readCallId(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.call_id === "string") return record.call_id;
  const call = record.call;
  if (call && typeof call === "object") {
    const id = (call as { call_id?: unknown }).call_id;
    if (typeof id === "string") return id;
  }
  return null;
}

function outcomeForTool(
  name: string,
): Exclude<AvaOutcome, "none"> | null {
  if (name === "submit_quote") return "quote";
  if (name === "book_appointment") return "appointment";
  if (name === "track_shipment") return "tracking";
  return null;
}

function authorized(request: Request) {
  const secret = getRetellToolSecret();
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  return token === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const ip = clientIp(request);
  if (isRetellRateLimited(`tools:${ip}`, 60)) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  try {
    const url = new URL(request.url);
    const toolFromQuery = url.searchParams.get("name") ?? "";
    const body: unknown = await request.json();
    const parsed = parseRetellToolCall(body, toolFromQuery);
    if (!parsed) {
      return NextResponse.json(
        { ok: false, spoken: "I could not tell which action to run." },
        { status: 400 },
      );
    }

    const result = await runRetellTool(parsed.name, parsed.args);
    const callId = readCallId(body);
    const outcome = outcomeForTool(parsed.name);
    if (result.ok && callId && isConversationExternalId(callId) && outcome) {
      const referenceId =
        typeof result.referenceId === "string"
          ? result.referenceId
          : typeof result.trackingId === "string"
            ? result.trackingId
            : undefined;
      await noteAvaOutcome({
        externalId: callId,
        channel: "retell",
        outcome,
        referenceId,
        visitorName: textField(parsed.args, "name"),
        visitorCompany: textField(parsed.args, "company"),
        visitorEmail: textField(parsed.args, "email"),
        visitorPhone: textField(parsed.args, "phone"),
        preview: referenceId ? `${outcome} ${referenceId}` : undefined,
      });
    }
    logger.info("voice-agent.retell.tool", {
      name: parsed.name,
      ok: result.ok,
      referenceId:
        typeof result.referenceId === "string" ? result.referenceId : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    logger.error("voice-agent.retell.tool.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { ok: false, spoken: "That action failed. Please try again." },
      { status: 500 },
    );
  }
}
