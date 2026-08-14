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
import { logger } from "@/lib/logger";

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
