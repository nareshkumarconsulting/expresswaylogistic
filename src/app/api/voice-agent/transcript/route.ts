import { NextResponse } from "next/server";
import { z } from "zod";
import { isConversationExternalId } from "@/features/voice-agent/record-conversation";
import { replaceAvaTranscript } from "@/services/ava-conversations-repository";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 40;
const hits = new Map<string, { count: number; resetAt: number }>();

const bodySchema = z.object({
  externalId: z.string().refine(isConversationExternalId, "Invalid conversation id"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(80),
});

function clientIp(request: Request): string {
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

export async function POST(request: Request) {
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid transcript" },
      { status: 400 },
    );
  }

  await replaceAvaTranscript({
    externalId: parsed.data.externalId,
    channel: "retell",
    messages: parsed.data.messages,
  });

  return NextResponse.json({ success: true });
}
