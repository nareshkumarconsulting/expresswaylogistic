import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const speakSchema = z.object({
  text: z.string().min(1).max(1200),
});

const OPENAI_VOICES = [
  "nova",
  "shimmer",
  "alloy",
  "echo",
  "fable",
  "onyx",
  "coral",
  "sage",
] as const;

export async function GET() {
  const configured = Boolean(process.env.OPENAI_API_KEY);
  return NextResponse.json({
    success: true,
    data: {
      neural: configured,
      provider: configured ? "openai" : "browser",
      voice: process.env.OPENAI_TTS_VOICE ?? "nova",
    },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
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

    const requestedVoice = process.env.OPENAI_TTS_VOICE ?? "nova";
    const voice = (OPENAI_VOICES as readonly string[]).includes(requestedVoice)
      ? requestedVoice
      : "nova";
    const model = process.env.OPENAI_TTS_MODEL ?? "tts-1-hd";

    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice,
        input: parsed.data.text,
        response_format: "mp3",
        speed: 1,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      logger.error("voice-agent.tts.failed", {
        status: res.status,
        detail: detail.slice(0, 200),
      });
      return NextResponse.json(
        { success: false, error: "Neural TTS failed" },
        { status: 502 },
      );
    }

    const audio = await res.arrayBuffer();
    logger.info("voice-agent.tts", {
      bytes: audio.byteLength,
      voice,
      model,
      chars: parsed.data.text.length,
    });

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error("voice-agent.tts.exception", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Neural TTS unavailable" },
      { status: 500 },
    );
  }
}
