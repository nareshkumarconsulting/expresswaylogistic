import { NextResponse } from "next/server";
import {
  clientIp,
  getRetellWebConfig,
  isRetellRateLimited,
  isRetellWebEnabled,
} from "@/features/voice-agent/retell-config";
import { logger } from "@/lib/logger";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { enabled: isRetellWebEnabled() },
  });
}

export async function POST(request: Request) {
  const config = getRetellWebConfig();
  if (!config) {
    return NextResponse.json(
      { success: false, error: "Retell web voice is not configured" },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  if (isRetellRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  try {
    const retellRes = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: config.agentId }),
      signal: AbortSignal.timeout(10_000),
    });

    const payload: unknown = await retellRes.json().catch(() => null);
    if (!retellRes.ok || !payload || typeof payload !== "object") {
      logger.warn("voice-agent.retell.web-call.failed", {
        status: retellRes.status,
      });
      return NextResponse.json(
        { success: false, error: "Could not start a live voice call" },
        { status: 502 },
      );
    }

    const record = payload as Record<string, unknown>;
    const accessToken =
      typeof record.access_token === "string" ? record.access_token : "";
    const callId = typeof record.call_id === "string" ? record.call_id : "";
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Could not start a live voice call" },
        { status: 502 },
      );
    }

    logger.info("voice-agent.retell.web-call.created", { callId });

    return NextResponse.json({
      success: true,
      data: { accessToken, callId },
    });
  } catch (error) {
    logger.error("voice-agent.retell.web-call.error", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Could not start a live voice call" },
      { status: 502 },
    );
  }
}
