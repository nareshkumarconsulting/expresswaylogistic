import { NextResponse } from "next/server";
import { z } from "zod";
import { getTtsConfig, synthesizeSpeech } from "@/features/voice-agent/tts";
import { logger } from "@/lib/logger";

const speakSchema = z.object({
  text: z.string().min(1).max(1200),
});

export async function GET() {
  const config = getTtsConfig();
  return NextResponse.json({
    success: true,
    data: {
      neural: Boolean(config),
      provider: config?.provider ?? "browser",
      voice: config?.voice ?? null,
    },
  });
}

export async function POST(request: Request) {
  const config = getTtsConfig();
  if (!config) {
    return NextResponse.json(
      {
        success: false,
        error: "Neural voice not configured",
        code: "NEURAL_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = speakSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid speak request" },
        { status: 400 },
      );
    }

    const result = await synthesizeSpeech(parsed.data.text, config);

    logger.info("voice-agent.tts", {
      bytes: result.audio.byteLength,
      voice: config.voice,
      model: config.model,
      provider: config.provider,
      chunks: result.chunks,
      chars: parsed.data.text.length,
    });

    return new NextResponse(result.audio, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error("voice-agent.tts.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Neural TTS failed" },
      { status: 502 },
    );
  }
}
