import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type {
  AvaChannel,
  AvaConversation,
  AvaMessage,
  AvaOutcome,
} from "@/types";

type ConversationRow = Database["public"]["Tables"]["ava_conversations"]["Row"];
type ConversationInsert =
  Database["public"]["Tables"]["ava_conversations"]["Insert"];
type ConversationUpdate =
  Database["public"]["Tables"]["ava_conversations"]["Update"];
type MessageRow = Database["public"]["Tables"]["ava_messages"]["Row"];
type MessageInsert = Database["public"]["Tables"]["ava_messages"]["Insert"];

export class AvaConversationStoreError extends Error {
  constructor(
    message: string,
    readonly missingTable = false,
  ) {
    super(message);
  }
}

type MemoryConversation = AvaConversation & { messages: AvaMessage[] };

const memoryByExternal = new Map<string, MemoryConversation>();
const memoryById = new Map<string, MemoryConversation>();

function externalKey(channel: AvaChannel, externalId: string) {
  return `${channel}:${externalId}`;
}

function textOrUndefined(value: string | null | undefined, max = 200) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function previewFrom(
  messages: { role: string; content: string }[],
  fallback = "",
) {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const text = (lastUser?.content || messages.at(-1)?.content || fallback).trim();
  return text.slice(0, 180);
}

function mapConversation(row: ConversationRow): AvaConversation {
  return {
    id: row.id,
    channel: row.channel,
    externalId: row.external_id,
    visitorName: row.visitor_name ?? undefined,
    visitorCompany: row.visitor_company ?? undefined,
    visitorEmail: row.visitor_email ?? undefined,
    visitorPhone: row.visitor_phone ?? undefined,
    lastIntent: row.last_intent ?? undefined,
    outcome: row.outcome,
    referenceId: row.reference_id ?? undefined,
    preview: row.preview,
    messageCount: row.message_count,
    startedAt: row.started_at,
    lastMessageAt: row.last_message_at,
  };
}

function toPublicConversation(conversation: MemoryConversation): AvaConversation {
  return {
    id: conversation.id,
    channel: conversation.channel,
    externalId: conversation.externalId,
    visitorName: conversation.visitorName,
    visitorCompany: conversation.visitorCompany,
    visitorEmail: conversation.visitorEmail,
    visitorPhone: conversation.visitorPhone,
    lastIntent: conversation.lastIntent,
    outcome: conversation.outcome,
    referenceId: conversation.referenceId,
    preview: conversation.preview,
    messageCount: conversation.messageCount,
    startedAt: conversation.startedAt,
    lastMessageAt: conversation.lastMessageAt,
  };
}

function mapMessage(row: MessageRow): AvaMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    intent: row.intent ?? undefined,
    sequence: row.sequence,
    createdAt: row.created_at,
  };
}

function isMissingTable(error: { code?: string; message?: string }) {
  const message = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    (/ava_conversations|ava_messages/i.test(message) &&
      /does not exist|schema cache|could not find/i.test(message))
  );
}

function storeError(error: { code?: string; message?: string }, fallback: string) {
  if (isMissingTable(error)) {
    return new AvaConversationStoreError(
      "Ava conversation storage is not set up yet.",
      true,
    );
  }
  return new AvaConversationStoreError(error.message || fallback);
}

export type AvaVisitorPatch = {
  visitorName?: string;
  visitorCompany?: string;
  visitorEmail?: string;
  visitorPhone?: string;
};

export type AvaTurnInput = AvaVisitorPatch & {
  externalId: string;
  channel: AvaChannel;
  userMessage: string;
  assistantMessage: string;
  intent?: string;
  openingMessage?: string;
  outcome?: AvaOutcome;
  referenceId?: string;
};

export type AvaTranscriptInput = AvaVisitorPatch & {
  externalId: string;
  channel: AvaChannel;
  messages: { role: "user" | "assistant"; content: string }[];
  outcome?: AvaOutcome;
  referenceId?: string;
};

export type AvaOutcomeInput = AvaVisitorPatch & {
  externalId: string;
  channel: AvaChannel;
  outcome: Exclude<AvaOutcome, "none">;
  referenceId?: string;
  preview?: string;
};

function visitorColumns(input: AvaVisitorPatch): ConversationUpdate {
  const patch: ConversationUpdate = {};
  const name = textOrUndefined(input.visitorName);
  const company = textOrUndefined(input.visitorCompany);
  const email = textOrUndefined(input.visitorEmail);
  const phone = textOrUndefined(input.visitorPhone, 40);
  if (name) patch.visitor_name = name;
  if (company) patch.visitor_company = company;
  if (email) patch.visitor_email = email;
  if (phone) patch.visitor_phone = phone;
  return patch;
}

function memoryGetOrCreate(
  channel: AvaChannel,
  externalId: string,
  seed: ConversationUpdate,
): MemoryConversation {
  const key = externalKey(channel, externalId);
  const existing = memoryByExternal.get(key);
  if (existing) return existing;
  const now = new Date().toISOString();
  const created: MemoryConversation = {
    id: crypto.randomUUID(),
    channel,
    externalId,
    visitorName: typeof seed.visitor_name === "string" ? seed.visitor_name : undefined,
    visitorCompany:
      typeof seed.visitor_company === "string" ? seed.visitor_company : undefined,
    visitorEmail:
      typeof seed.visitor_email === "string" ? seed.visitor_email : undefined,
    visitorPhone:
      typeof seed.visitor_phone === "string" ? seed.visitor_phone : undefined,
    outcome: seed.outcome ?? "none",
    referenceId:
      typeof seed.reference_id === "string" ? seed.reference_id : undefined,
    preview: typeof seed.preview === "string" ? seed.preview : "",
    messageCount: 0,
    startedAt: now,
    lastMessageAt: now,
    messages: [],
  };
  memoryByExternal.set(key, created);
  memoryById.set(created.id, created);
  return created;
}

function applyVisitor(target: MemoryConversation, input: AvaVisitorPatch) {
  const name = textOrUndefined(input.visitorName);
  const company = textOrUndefined(input.visitorCompany);
  const email = textOrUndefined(input.visitorEmail);
  const phone = textOrUndefined(input.visitorPhone, 40);
  if (name) target.visitorName = name;
  if (company) target.visitorCompany = company;
  if (email) target.visitorEmail = email;
  if (phone) target.visitorPhone = phone;
}

async function findOrCreateConversation(
  channel: AvaChannel,
  externalId: string,
  seed: ConversationUpdate,
): Promise<string> {
  if (!isSupabaseConfigured()) {
    return memoryGetOrCreate(channel, externalId, seed).id;
  }

  const supabase = createSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .from("ava_conversations")
    .select("id")
    .eq("channel", channel)
    .eq("external_id", externalId)
    .maybeSingle();

  if (readError) throw storeError(readError, "Could not read Ava conversation");
  if (existing) return existing.id;

  const insert: ConversationInsert = {
    channel,
    external_id: externalId,
    preview: typeof seed.preview === "string" ? seed.preview : "",
    outcome: seed.outcome ?? "none",
    reference_id: seed.reference_id ?? null,
    last_intent: seed.last_intent ?? null,
    visitor_name: seed.visitor_name ?? null,
    visitor_company: seed.visitor_company ?? null,
    visitor_email: seed.visitor_email ?? null,
    visitor_phone: seed.visitor_phone ?? null,
  };

  const { data: created, error: insertError } = await supabase
    .from("ava_conversations")
    .insert(insert)
    .select("id")
    .single();

  if (!insertError && created) return created.id;
  if (insertError?.code === "23505") {
    const { data: again, error: againError } = await supabase
      .from("ava_conversations")
      .select("id")
      .eq("channel", channel)
      .eq("external_id", externalId)
      .maybeSingle();
    if (againError) throw storeError(againError, "Could not read Ava conversation");
    if (again) return again.id;
  }
  throw storeError(insertError ?? { message: "insert failed" }, "Could not save Ava conversation");
}

async function updateConversation(id: string, patch: ConversationUpdate) {
  if (!isSupabaseConfigured()) {
    const current = memoryById.get(id);
    if (!current) return;
    if (typeof patch.preview === "string") current.preview = patch.preview;
    if (typeof patch.message_count === "number") current.messageCount = patch.message_count;
    if (typeof patch.last_intent === "string") current.lastIntent = patch.last_intent;
    if (patch.outcome && patch.outcome !== "none") current.outcome = patch.outcome;
    if (typeof patch.reference_id === "string") current.referenceId = patch.reference_id;
    if (typeof patch.visitor_name === "string") current.visitorName = patch.visitor_name;
    if (typeof patch.visitor_company === "string") {
      current.visitorCompany = patch.visitor_company;
    }
    if (typeof patch.visitor_email === "string") current.visitorEmail = patch.visitor_email;
    if (typeof patch.visitor_phone === "string") current.visitorPhone = patch.visitor_phone;
    if (typeof patch.last_message_at === "string") {
      current.lastMessageAt = patch.last_message_at;
    }
    return;
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("ava_conversations").update(patch).eq("id", id);
  if (error) throw storeError(error, "Could not update Ava conversation");
}

export async function recordAvaTurn(input: AvaTurnInput): Promise<void> {
  const userMessage = input.userMessage.trim().slice(0, 2000);
  const assistantMessage = input.assistantMessage.trim().slice(0, 2000);
  if (!userMessage || !assistantMessage) return;

  try {
    if (!isSupabaseConfigured()) {
      const conversation = memoryGetOrCreate(input.channel, input.externalId, {
        ...visitorColumns(input),
        outcome: input.outcome,
        reference_id: input.referenceId,
      });
      applyVisitor(conversation, input);
      const rows: { role: "user" | "assistant"; content: string; intent?: string }[] =
        [];
      if (conversation.messages.length === 0 && input.openingMessage?.trim()) {
        rows.push({
          role: "assistant",
          content: input.openingMessage.trim().slice(0, 500),
        });
      }
      rows.push({ role: "user", content: userMessage, intent: input.intent });
      rows.push({ role: "assistant", content: assistantMessage, intent: input.intent });
      for (const row of rows) {
        conversation.messages.push({
          id: crypto.randomUUID(),
          role: row.role,
          content: row.content,
          intent: row.intent,
          sequence: conversation.messages.length + 1,
          createdAt: new Date().toISOString(),
        });
      }
      conversation.messageCount = conversation.messages.length;
      conversation.preview = previewFrom(conversation.messages);
      conversation.lastMessageAt = new Date().toISOString();
      if (input.intent) conversation.lastIntent = input.intent;
      if (input.outcome && input.outcome !== "none") conversation.outcome = input.outcome;
      if (input.referenceId) conversation.referenceId = input.referenceId;
      return;
    }

    const id = await findOrCreateConversation(input.channel, input.externalId, {
      ...visitorColumns(input),
      outcome: input.outcome,
      reference_id: input.referenceId ?? null,
      last_intent: input.intent ?? null,
      preview: previewFrom(
        [{ role: "user", content: userMessage }],
        assistantMessage,
      ),
    });

    const supabase = createSupabaseAdmin();
    const { data: last, error: lastError } = await supabase
      .from("ava_messages")
      .select("sequence")
      .eq("conversation_id", id)
      .order("sequence", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastError) throw storeError(lastError, "Could not read Ava messages");

    let sequence = last?.sequence ?? 0;
    const rows: MessageInsert[] = [];
    if (sequence === 0 && input.openingMessage?.trim()) {
      sequence += 1;
      rows.push({
        conversation_id: id,
        role: "assistant",
        content: input.openingMessage.trim().slice(0, 500),
        sequence,
      });
    }
    sequence += 1;
    rows.push({
      conversation_id: id,
      role: "user",
      content: userMessage,
      intent: input.intent ?? null,
      sequence,
    });
    sequence += 1;
    rows.push({
      conversation_id: id,
      role: "assistant",
      content: assistantMessage,
      intent: input.intent ?? null,
      sequence,
    });

    const { error: insertError } = await supabase.from("ava_messages").insert(rows);
    if (insertError) throw storeError(insertError, "Could not save Ava messages");

    await updateConversation(id, {
      ...visitorColumns(input),
      preview: userMessage.slice(0, 180),
      message_count: sequence,
      last_intent: input.intent ?? null,
      last_message_at: new Date().toISOString(),
      ...(input.outcome && input.outcome !== "none"
        ? { outcome: input.outcome }
        : {}),
      ...(input.referenceId ? { reference_id: input.referenceId } : {}),
    });
  } catch (error) {
    logger.error("ava.conversation.record_failed", {
      error: error instanceof Error ? error.message : "unknown",
      channel: input.channel,
    });
  }
}

export async function replaceAvaTranscript(input: AvaTranscriptInput): Promise<void> {
  const messages = input.messages
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 2000),
    }))
    .filter((message) => message.content.length > 0)
    .slice(0, 80);
  if (messages.length === 0) return;

  try {
    if (!isSupabaseConfigured()) {
      const conversation = memoryGetOrCreate(input.channel, input.externalId, {
        ...visitorColumns(input),
        preview: previewFrom(messages),
      });
      applyVisitor(conversation, input);
      const now = new Date().toISOString();
      conversation.messages = messages.map((message, index) => ({
        id: crypto.randomUUID(),
        role: message.role,
        content: message.content,
        sequence: index + 1,
        createdAt: now,
      }));
      conversation.messageCount = conversation.messages.length;
      conversation.preview = previewFrom(conversation.messages);
      conversation.lastMessageAt = now;
      if (input.outcome && input.outcome !== "none") conversation.outcome = input.outcome;
      if (input.referenceId) conversation.referenceId = input.referenceId;
      return;
    }

    const id = await findOrCreateConversation(input.channel, input.externalId, {
      ...visitorColumns(input),
      preview: previewFrom(messages),
      outcome: input.outcome,
      reference_id: input.referenceId ?? null,
    });

    const supabase = createSupabaseAdmin();
    const { error: deleteError } = await supabase
      .from("ava_messages")
      .delete()
      .eq("conversation_id", id);
    if (deleteError) throw storeError(deleteError, "Could not refresh Ava transcript");

    const rows: MessageInsert[] = messages.map((message, index) => ({
      conversation_id: id,
      role: message.role,
      content: message.content,
      sequence: index + 1,
    }));
    const { error: insertError } = await supabase.from("ava_messages").insert(rows);
    if (insertError) throw storeError(insertError, "Could not save Ava transcript");

    await updateConversation(id, {
      ...visitorColumns(input),
      preview: previewFrom(messages),
      message_count: messages.length,
      last_message_at: new Date().toISOString(),
      ...(input.outcome && input.outcome !== "none"
        ? { outcome: input.outcome }
        : {}),
      ...(input.referenceId ? { reference_id: input.referenceId } : {}),
    });
  } catch (error) {
    logger.error("ava.conversation.transcript_failed", {
      error: error instanceof Error ? error.message : "unknown",
      channel: input.channel,
    });
  }
}

export async function noteAvaOutcome(input: AvaOutcomeInput): Promise<void> {
  const preview =
    textOrUndefined(input.preview, 180) ??
    `${input.outcome} ${input.referenceId ?? ""}`.trim();

  try {
    if (!isSupabaseConfigured()) {
      const conversation = memoryGetOrCreate(input.channel, input.externalId, {
        ...visitorColumns(input),
        outcome: input.outcome,
        reference_id: input.referenceId,
        preview,
      });
      applyVisitor(conversation, input);
      conversation.outcome = input.outcome;
      if (input.referenceId) conversation.referenceId = input.referenceId;
      if (!conversation.preview) conversation.preview = preview;
      conversation.lastMessageAt = new Date().toISOString();
      return;
    }

    const id = await findOrCreateConversation(input.channel, input.externalId, {
      ...visitorColumns(input),
      outcome: input.outcome,
      reference_id: input.referenceId ?? null,
      preview,
    });

    await updateConversation(id, {
      ...visitorColumns(input),
      outcome: input.outcome,
      ...(input.referenceId ? { reference_id: input.referenceId } : {}),
      last_message_at: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("ava.conversation.outcome_failed", {
      error: error instanceof Error ? error.message : "unknown",
      channel: input.channel,
    });
  }
}

export async function listAvaConversations(): Promise<AvaConversation[]> {
  if (!isSupabaseConfigured()) {
    return [...memoryById.values()]
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
      )
      .map(toPublicConversation);
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("ava_conversations")
    .select("*")
    .order("last_message_at", { ascending: false })
    .limit(200);

  if (error) throw storeError(error, "Could not load Ava conversations");
  return (data ?? []).map(mapConversation);
}

export async function getAvaConversation(
  id: string,
): Promise<{ conversation: AvaConversation; messages: AvaMessage[] } | null> {
  if (!isSupabaseConfigured()) {
    const conversation = memoryById.get(id);
    if (!conversation) return null;
    return {
      conversation: toPublicConversation(conversation),
      messages: conversation.messages,
    };
  }

  const supabase = createSupabaseAdmin();
  const { data: conversation, error } = await supabase
    .from("ava_conversations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw storeError(error, "Could not load Ava conversation");
  if (!conversation) return null;

  const { data: messages, error: messageError } = await supabase
    .from("ava_messages")
    .select("*")
    .eq("conversation_id", id)
    .order("sequence", { ascending: true });
  if (messageError) throw storeError(messageError, "Could not load Ava messages");

  return {
    conversation: mapConversation(conversation),
    messages: (messages ?? []).map(mapMessage),
  };
}
