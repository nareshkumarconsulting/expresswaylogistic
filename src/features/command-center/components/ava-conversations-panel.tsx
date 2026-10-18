"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Spinner } from "@/components/atoms/spinner";
import { StateAlert } from "@/components/molecules/state-alert";
import { cn } from "@/lib/utils";
import type { AvaChannel, AvaConversation, AvaMessage, AvaOutcome } from "@/types";

type ChannelFilter = "all" | AvaChannel;

const FILTERS: { id: ChannelFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "browser", label: "On-site" },
  { id: "retell", label: "Live call" },
];

const OUTCOME_LABEL: Record<AvaOutcome, string> = {
  none: "Chat",
  quote: "Quote",
  appointment: "Appointment",
  tracking: "Tracking",
};

async function fetchConversations(): Promise<AvaConversation[]> {
  const res = await fetch("/api/ava-conversations");
  const json = (await res.json()) as {
    success: boolean;
    data?: AvaConversation[];
    error?: string;
  };
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Could not load Ava conversations");
  }
  return json.data;
}

async function fetchConversation(id: string): Promise<{
  conversation: AvaConversation;
  messages: AvaMessage[];
}> {
  const res = await fetch(`/api/ava-conversations/${id}`);
  const json = (await res.json()) as {
    success: boolean;
    data?: { conversation: AvaConversation; messages: AvaMessage[] };
    error?: string;
  };
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Could not load this conversation");
  }
  return json.data;
}

function formatListTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function visitorLabel(conversation: AvaConversation): string {
  return (
    conversation.visitorName ||
    conversation.visitorCompany ||
    conversation.visitorEmail ||
    "Website visitor"
  );
}

function outcomeVariant(
  outcome: AvaOutcome,
): "accent" | "secondary" | "muted" | "outline" {
  switch (outcome) {
    case "quote":
      return "accent";
    case "appointment":
      return "secondary";
    case "tracking":
      return "muted";
    default:
      return "outline";
  }
}

export function AvaConversationsPanel() {
  const [query, setQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ava-conversations"],
    queryFn: fetchConversations,
    refetchInterval: 30_000,
  });

  const selectedSummary = data?.find((item) => item.id === selectedId) ?? null;

  const detail = useQuery({
    queryKey: ["ava-conversation", selectedId],
    queryFn: () => fetchConversation(selectedId!),
    enabled: Boolean(selectedId),
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.filter((conversation) => {
      if (channelFilter !== "all" && conversation.channel !== channelFilter) {
        return false;
      }
      if (!q) return true;
      return (
        visitorLabel(conversation).toLowerCase().includes(q) ||
        (conversation.visitorEmail?.toLowerCase().includes(q) ?? false) ||
        (conversation.visitorCompany?.toLowerCase().includes(q) ?? false) ||
        conversation.preview.toLowerCase().includes(q) ||
        (conversation.referenceId?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data, query, channelFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Loading Ava conversations" />
      </div>
    );
  }

  if (isError) {
    return (
      <StateAlert
        variant="error"
        title="Unable to load Ava conversations"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => void refetch()}
      />
    );
  }

  const messages = detail.data?.messages ?? [];
  const selected = detail.data?.conversation ?? selectedSummary;

  return (
    <div className="flex h-[calc(100dvh-7rem)] min-h-0 flex-col gap-3">
      <div>
        <h2 className="font-display text-xl font-bold">Ava conversations</h2>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{data?.length ?? 0}</span>{" "}
          saved chats from the website receptionist
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-3 md:flex-row md:items-center md:justify-between md:px-4">
          <div
            className="inline-flex rounded-lg border border-border bg-muted/40 p-1"
            role="tablist"
            aria-label="Filter Ava conversations"
          >
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={channelFilter === item.id}
                onClick={() => setChannelFilter(item.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  channelFilter === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, message…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              aria-label="Search Ava conversations"
            />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(18rem,24rem)_1fr]">
          <div
            className={cn(
              "flex min-h-0 flex-col border-b lg:border-r lg:border-b-0",
              selectedId && "hidden lg:flex",
            )}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground">
                <MessageCircle className="size-8 text-muted-foreground/70" />
                <p>No Ava conversations yet.</p>
                <p>Chats appear here after a visitor talks to Ava on the website.</p>
              </div>
            ) : (
              <ul className="min-h-0 flex-1 overflow-y-auto">
                {filtered.map((conversation) => {
                  const active = conversation.id === selectedId;
                  return (
                    <li key={conversation.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(conversation.id)}
                        className={cn(
                          "flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50",
                          active && "bg-muted",
                        )}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-medium">
                            {visitorLabel(conversation)}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatListTime(conversation.lastMessageAt)}
                          </span>
                        </span>
                        <span className="line-clamp-2 text-sm text-muted-foreground">
                          {conversation.preview || "No message yet"}
                        </span>
                        <span className="flex flex-wrap items-center gap-1.5 pt-1">
                          <Badge variant="outline">
                            {conversation.channel === "retell" ? "Live call" : "On-site"}
                          </Badge>
                          {conversation.outcome !== "none" ? (
                            <Badge variant={outcomeVariant(conversation.outcome)}>
                              {OUTCOME_LABEL[conversation.outcome]}
                            </Badge>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div
            className={cn(
              "min-h-0 flex-col bg-surface/40",
              selectedId ? "flex" : "hidden lg:flex",
            )}
          >
            {!selected ? (
              <div className="flex flex-1 items-center justify-center px-6 text-sm text-muted-foreground">
                Select a conversation to read the transcript.
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3 border-b bg-card px-4 py-3">
                  <div className="min-w-0">
                    <button
                      type="button"
                      className="mb-1 inline-flex items-center gap-1 text-sm text-muted-foreground lg:hidden"
                      onClick={() => setSelectedId(null)}
                    >
                      <ArrowLeft className="size-4" />
                      All conversations
                    </button>
                    <h3 className="truncate font-semibold">{visitorLabel(selected)}</h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {[selected.visitorCompany, selected.visitorEmail, selected.visitorPhone]
                        .filter(Boolean)
                        .join(" · ") || "No contact details yet"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(selected.startedAt)}
                      {selected.messageCount
                        ? ` · ${selected.messageCount} messages`
                        : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Badge variant="outline">
                      {selected.channel === "retell" ? "Live call" : "On-site"}
                    </Badge>
                    {selected.referenceId ? (
                      selected.outcome === "quote" ? (
                        <Link
                          href={`/command-center/quotes?quote=${encodeURIComponent(selected.referenceId)}`}
                          className="text-xs font-medium text-accent hover:underline"
                        >
                          {selected.referenceId}
                        </Link>
                      ) : selected.outcome === "tracking" ? (
                        <Link
                          href={`/track?id=${encodeURIComponent(selected.referenceId)}`}
                          className="text-xs font-medium text-accent hover:underline"
                        >
                          {selected.referenceId}
                        </Link>
                      ) : (
                        <span className="text-xs font-medium">{selected.referenceId}</span>
                      )
                    ) : null}
                  </div>
                </div>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {detail.isLoading ? (
                    <div className="flex justify-center py-10">
                      <Spinner label="Loading transcript" />
                    </div>
                  ) : detail.isError ? (
                    <StateAlert
                      variant="error"
                      title="Unable to load this transcript"
                      onRetry={() => void detail.refetch()}
                    />
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No transcript lines were saved for this conversation.
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed",
                          message.role === "assistant"
                            ? "rounded-2xl rounded-bl-md bg-card text-foreground shadow-sm ring-1 ring-border/70"
                            : "ml-auto rounded-2xl rounded-br-md bg-accent text-accent-foreground",
                        )}
                      >
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                          {message.role === "assistant" ? "Ava" : "Visitor"}
                        </p>
                        {message.content}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
