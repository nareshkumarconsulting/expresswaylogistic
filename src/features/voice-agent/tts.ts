const GROQ_TTS_MAX_CHARS = 200;

const GROQ_VOICES = [
  "autumn",
  "diana",
  "hannah",
  "austin",
  "daniel",
  "troy",
] as const;

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

export type TtsProvider = "groq" | "openai";

export type TtsConfig = {
  provider: TtsProvider;
  voice: string;
  model: string;
} | null;

export function getTtsConfig(): TtsConfig {
  if (process.env.GROQ_API_KEY) {
    const requested = process.env.GROQ_TTS_VOICE ?? "hannah";
    return {
      provider: "groq",
      voice: (GROQ_VOICES as readonly string[]).includes(requested)
        ? requested
        : "hannah",
      model: process.env.GROQ_TTS_MODEL ?? "canopylabs/orpheus-v1-english",
    };
  }

  if (process.env.OPENAI_API_KEY) {
    const requested = process.env.OPENAI_TTS_VOICE ?? "nova";
    return {
      provider: "openai",
      voice: (OPENAI_VOICES as readonly string[]).includes(requested)
        ? requested
        : "nova",
      model: process.env.OPENAI_TTS_MODEL ?? "tts-1-hd",
    };
  }

  return null;
}

export function chunkForTts(
  text: string,
  maxChars = GROQ_TTS_MAX_CHARS,
): string[] {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const chunks: string[] = [];
  let remaining = normalized;

  while (remaining.length > maxChars) {
    const slice = remaining.slice(0, maxChars);
    const breakAt = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("; "),
      slice.lastIndexOf(", "),
      slice.lastIndexOf(" "),
    );
    const take = breakAt > 40 ? breakAt + 1 : maxChars;
    chunks.push(remaining.slice(0, take).trim());
    remaining = remaining.slice(take).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

function fourCC(view: DataView, offset: number): string {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3),
  );
}

function writeFourCC(view: DataView, offset: number, value: string) {
  view.setUint8(offset, value.charCodeAt(0));
  view.setUint8(offset + 1, value.charCodeAt(1));
  view.setUint8(offset + 2, value.charCodeAt(2));
  view.setUint8(offset + 3, value.charCodeAt(3));
}

type WavPcm = {
  channels: number;
  sampleRate: number;
  bitsPerSample: number;
  data: Uint8Array;
};

function chunkPayloadSize(
  buffer: ArrayBuffer,
  start: number,
  declared: number,
): number {
  const remaining = buffer.byteLength - start;
  if (declared === 0xffffffff || declared > remaining) return remaining;
  return declared;
}

function extractWavPcm(buffer: ArrayBuffer): WavPcm {
  const view = new DataView(buffer);
  if (fourCC(view, 0) !== "RIFF" || fourCC(view, 8) !== "WAVE") {
    throw new Error("not wav");
  }

  let offset = 12;
  let fmt: Omit<WavPcm, "data"> | null = null;
  let data: Uint8Array | null = null;

  while (offset + 8 <= buffer.byteLength) {
    const id = fourCC(view, offset);
    const declared = view.getUint32(offset + 4, true);
    const start = offset + 8;
    const size = chunkPayloadSize(buffer, start, declared);

    if (id === "fmt ") {
      fmt = {
        channels: view.getUint16(start + 2, true),
        sampleRate: view.getUint32(start + 4, true),
        bitsPerSample: view.getUint16(start + 14, true),
      };
    } else if (id === "data") {
      data = new Uint8Array(buffer.slice(start, start + size));
    }

    if (declared === 0xffffffff) break;
    offset = start + size + (size % 2);
  }

  if (!fmt || !data) throw new Error("invalid wav");
  return { ...fmt, data };
}

function buildWav(pcm: WavPcm): ArrayBuffer {
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + pcm.data.byteLength);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const byteRate = (pcm.sampleRate * pcm.channels * pcm.bitsPerSample) / 8;
  const blockAlign = (pcm.channels * pcm.bitsPerSample) / 8;

  writeFourCC(view, 0, "RIFF");
  view.setUint32(4, 36 + pcm.data.byteLength, true);
  writeFourCC(view, 8, "WAVE");
  writeFourCC(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, pcm.channels, true);
  view.setUint32(24, pcm.sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, pcm.bitsPerSample, true);
  writeFourCC(view, 36, "data");
  view.setUint32(40, pcm.data.byteLength, true);
  bytes.set(pcm.data, headerSize);
  return buffer;
}

export function concatWavBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  if (buffers.length === 0) throw new Error("no wav");

  const parts = buffers.map(extractWavPcm);
  const first = parts[0];
  const compatible = parts.every(
    (part) =>
      part.channels === first.channels &&
      part.sampleRate === first.sampleRate &&
      part.bitsPerSample === first.bitsPerSample,
  );
  if (!compatible) throw new Error("wav format mismatch");

  const total = parts.reduce((sum, part) => sum + part.data.byteLength, 0);
  const data = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    data.set(part.data, offset);
    offset += part.data.byteLength;
  }

  return buildWav({
    channels: first.channels,
    sampleRate: first.sampleRate,
    bitsPerSample: first.bitsPerSample,
    data,
  });
}

async function groqSpeech(input: {
  apiKey: string;
  model: string;
  voice: string;
  text: string;
}): Promise<ArrayBuffer> {
  const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: input.model,
      voice: input.voice,
      input: input.text,
      response_format: "wav",
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq TTS ${res.status}: ${detail.slice(0, 200)}`);
  }

  return res.arrayBuffer();
}

export async function synthesizeSpeech(
  text: string,
  config: Exclude<TtsConfig, null>,
): Promise<{ audio: ArrayBuffer; contentType: string; chunks: number }> {
  if (config.provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY missing");

    const chunks = chunkForTts(text);
    const buffers: ArrayBuffer[] = [];
    for (const chunk of chunks) {
      buffers.push(
        await groqSpeech({
          apiKey,
          model: config.model,
          voice: config.voice,
          text: chunk,
        }),
      );
    }

    return {
      audio: concatWavBuffers(buffers),
      contentType: "audio/wav",
      chunks: chunks.length,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      voice: config.voice,
      input: text,
      response_format: "mp3",
      speed: 1,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OpenAI TTS ${res.status}: ${detail.slice(0, 200)}`);
  }

  return {
    audio: await res.arrayBuffer(),
    contentType: "audio/mpeg",
    chunks: 1,
  };
}
