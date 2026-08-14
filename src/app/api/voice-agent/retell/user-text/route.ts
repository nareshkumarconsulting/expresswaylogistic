import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildTypedCallContext,
  clientIp,
  getRetellWebConfig,
  isRetellRateLimited,
} from "@/features/voice-agent/retell-config";
import { logger } from "@/lib/logger";

const bodySchema = z.object({
  callId: z.string().regex(/^call_[A-Za-z0-9_-]+$/),
  message: z.string().trim().min(1).max(2000),
});

export async function POST(request: Request) {
  const config = getRetellWebConfig();
  if (!config) {
    return NextResponse.json(
      { success: false, error: "Retell web voice is not configured" },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  if (isRetellRateLimited(`user-text:${ip}`, 40)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid typed message" },
      { status: 400 },
    );
  }

  try {
    const retellRes = await fetch(
      `https://api.retellai.com/v2/update-live-call/${parsed.data.callId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_control: {
            additional_context: buildTypedCallContext(parsed.data.message),
            trigger_response: true,
          },
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!retellRes.ok) {
      logger.warn("voice-agent.retell.user-text.failed", {
        status: retellRes.status,
      });
      return NextResponse.json(
        { success: false, error: "Could not send that to Ava" },
        { status: 502 },
      );
    }

    logger.info("voice-agent.retell.user-text.sent", {
      callId: parsed.data.callId,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("voice-agent.retell.user-text.error", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Could not send that to Ava" },
      { status: 502 },
    );
  }
}
