import { logger } from "@/lib/logger";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

function parseJsonContent(content: string): unknown {
  const cleaned = content
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned) as unknown;
}

async function groqJson(
  apiKey: string,
  messages: ChatMessage[],
  timeoutMs: number,
): Promise<unknown> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return parseJsonContent(data.choices?.[0]?.message?.content ?? "");
}

async function geminiJson(
  apiKey: string,
  messages: ChatMessage[],
  timeoutMs: number,
): Promise<unknown> {
  const prompt = messages.map((item) => item.content).join("\n\n");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    },
  );
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return parseJsonContent(
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
  );
}

async function openAiJson(
  apiKey: string,
  messages: ChatMessage[],
  timeoutMs: number,
): Promise<unknown> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return parseJsonContent(data.choices?.[0]?.message?.content ?? "");
}

/**
 * JSON chat completion. Groq → Gemini → OpenAI. Returns null when no key
 * is configured or every provider fails.
 */
export async function completeJsonObject(input: {
  system: string;
  user: string;
  timeoutMs?: number;
}): Promise<unknown | null> {
  const timeoutMs = input.timeoutMs ?? 12_000;
  const messages: ChatMessage[] = [
    { role: "system", content: input.system },
    { role: "user", content: input.user },
  ];

  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (!groqKey && !geminiKey && !openAiKey) return null;

  const attempts: Array<() => Promise<unknown>> = [];
  if (groqKey) attempts.push(() => groqJson(groqKey, messages, timeoutMs));
  if (geminiKey) attempts.push(() => geminiJson(geminiKey, messages, timeoutMs));
  if (openAiKey) attempts.push(() => openAiJson(openAiKey, messages, timeoutMs));

  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (error) {
      logger.warn("llm.json.provider_failed", {
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return null;
}
