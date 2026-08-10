import {
  buildSiteKnowledge,
  RECEPTIONIST_PERSONA,
} from "@/features/voice-agent/knowledge";
import type { BookingDraft } from "@/features/voice-agent/schemas";

type LlmTurn = {
  reply: string;
};

/**
 * Optional low-cost LLM polish (Groq free tier or OpenAI).
 * Returns null when no key is configured — local receptionist handles the turn.
 */
export async function polishReplyWithLlm(input: {
  message: string;
  draftReply: string;
  bookingDraft: BookingDraft;
  history?: { role: "user" | "assistant"; content: string }[];
}): Promise<LlmTurn | null> {
  const groqKey = process.env.GROQ_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!groqKey && !openAiKey) return null;

  const system = `${RECEPTIONIST_PERSONA}

Site knowledge:
${buildSiteKnowledge()}

Current booking draft (JSON): ${JSON.stringify(input.bookingDraft)}

Rewrite the draft reply so it sounds natural when spoken aloud.
Keep the same facts and intent. Do not add new promises.
Reply with only the spoken text — no markdown, no quotes.`;

  const messages = [
    { role: "system" as const, content: system },
    ...(input.history ?? []).slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    {
      role: "user" as const,
      content: `User said: ${input.message}\n\nDraft reply to polish: ${input.draftReply}`,
    },
  ];

  try {
    if (groqKey) {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
            messages,
            temperature: 0.4,
            max_tokens: 220,
          }),
        },
      );
      if (!res.ok) return null;
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      return reply ? { reply } : null;
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages,
        temperature: 0.4,
        max_tokens: 220,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply ? { reply } : null;
  } catch {
    return null;
  }
}
