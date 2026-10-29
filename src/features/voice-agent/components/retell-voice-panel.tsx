"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Send } from "lucide-react";
import type {
  RetellWebClient,
  StartCallConfig,
  TransportKind,
} from "retell-client-js-sdk";
import { Button } from "@/components/atoms/button";
import {
  ChatBubble,
  ChatPromptChips,
  ChatWidgetFrame,
} from "@/features/voice-agent/components/chat-widget-frame";
import { createConversationId } from "@/features/voice-agent/record-conversation";
import type {
  BookingDraft,
  QuoteDraft,
  TrackingDraft,
} from "@/features/voice-agent/schemas";
import { cn } from "@/lib/utils";

type TranscriptLine = {
  role: "agent" | "user";
  content: string;
};

type CallStatus = "idle" | "connecting" | "live" | "ended";

export interface RetellVoicePanelProps {
  open: boolean;
  onClose: () => void;
}

export function RetellVoicePanel({ open, onClose }: RetellVoicePanelProps) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [typedLines, setTypedLines] = useState<TranscriptLine[]>([]);
  const [typed, setTyped] = useState("");
  const [sending, setSending] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({});
  const [quoteDraft, setQuoteDraft] = useState<QuoteDraft>({});
  const [trackingDraft, setTrackingDraft] = useState<TrackingDraft>({});
  const clientRef = useRef<RetellWebClient | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationIdRef = useRef(createConversationId());
  const callIdRef = useRef<string | null>(null);
  const transcriptRef = useRef<TranscriptLine[]>([]);
  const typedLinesRef = useRef<TranscriptLine[]>([]);
  const syncTimerRef = useRef<number | null>(null);

  const postLiveTranscript = useCallback((externalId: string, lines: TranscriptLine[]) => {
    const messages = lines
      .filter((line) => line.content.trim())
      .slice(-80)
      .map((line) => ({
        role: line.role === "user" ? ("user" as const) : ("assistant" as const),
        content: line.content.slice(0, 2000),
      }));
    if (messages.length === 0) return;
    void fetch("/api/voice-agent/transcript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ externalId, messages }),
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  const flushLiveTranscript = useCallback(() => {
    const externalId = callIdRef.current;
    if (!externalId) return;
    postLiveTranscript(externalId, [
      ...transcriptRef.current,
      ...typedLinesRef.current,
    ]);
  }, [postLiveTranscript]);

  const endCall = useCallback(() => {
    flushLiveTranscript();
    clientRef.current?.stopCall();
    clientRef.current = null;
    callIdRef.current = null;
    setCallId(null);
    setStatus((prev) => (prev === "idle" ? prev : "ended"));
    setSpeaking(false);
    setMuted(false);
  }, [flushLiveTranscript]);

  useEffect(() => {
    if (!open) {
      endCall();
      conversationIdRef.current = createConversationId();
      transcriptRef.current = [];
      typedLinesRef.current = [];
      setStatus("idle");
      setTranscript([]);
      setTypedLines([]);
      setTyped("");
      setError(null);
      setBookingDraft({});
      setQuoteDraft({});
      setTrackingDraft({});
    }
  }, [open, endCall]);

  const visibleLines = [...transcript, ...typedLines];

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    typedLinesRef.current = typedLines;
  }, [typedLines]);

  useEffect(() => {
    if (!callId || status !== "live") return;
    if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    syncTimerRef.current = window.setTimeout(() => {
      postLiveTranscript(callId, [...transcript, ...typedLines]);
    }, 2500);
    return () => {
      if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    };
  }, [callId, status, transcript, typedLines, postLiveTranscript]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleLines.length]);

  const startCall = async () => {
    setError(null);
    setStatus("connecting");
    transcriptRef.current = [];
    typedLinesRef.current = [];
    setTranscript([]);
    setTypedLines([]);

    try {
      const res = await fetch("/api/voice-agent/retell/web-call", {
        method: "POST",
      });
      const json: unknown = await res.json();
      const data =
        json && typeof json === "object"
          ? (json as {
              success?: boolean;
              error?: string;
              data?: {
                accessToken?: string;
                callId?: string;
                transport?: TransportKind;
                iceServers?: RTCIceServer[];
              };
            })
          : null;
      const accessToken = data?.data?.accessToken;
      const nextCallId = data?.data?.callId;
      if (!res.ok || !accessToken || !nextCallId) {
        throw new Error(data?.error || "Could not start the live call");
      }

      const { RetellWebClient: Client } = await import("retell-client-js-sdk");
      const client = new Client();
      clientRef.current = client;
      conversationIdRef.current = nextCallId;
      callIdRef.current = nextCallId;
      setCallId(nextCallId);

      client.on("call_started", () => {
        setStatus("live");
        inputRef.current?.focus();
      });
      client.on("call_ended", () => {
        flushLiveTranscript();
        callIdRef.current = null;
        setStatus("ended");
        setSpeaking(false);
        setCallId(null);
        clientRef.current = null;
      });
      client.on("agent_start_talking", () => setSpeaking(true));
      client.on("agent_stop_talking", () => setSpeaking(false));
      client.on("update", (update: unknown) => {
        const payload = update as { transcript?: TranscriptLine[] };
        if (Array.isArray(payload.transcript)) {
          const next = payload.transcript
            .filter((line) => line.content?.trim())
            .map((line) => ({
              role: line.role === "user" ? ("user" as const) : ("agent" as const),
              content: line.content,
            }));
          transcriptRef.current = next;
          setTranscript(next);
        }
      });
      client.on("error", (err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : "Live call error";
        setError(message);
        flushLiveTranscript();
        client.stopCall();
        clientRef.current = null;
        callIdRef.current = null;
        setCallId(null);
        setStatus("ended");
      });

      const startCallConfig: StartCallConfig = {
        accessToken,
        callId: nextCallId,
      };
      if (data?.data?.transport) {
        startCallConfig.transport = data.data.transport;
      }
      if (data?.data?.iceServers?.length) {
        startCallConfig.iceServers = data.data.iceServers;
      }
      await client.startCall(startCallConfig);
    } catch (err) {
      clientRef.current = null;
      callIdRef.current = null;
      setCallId(null);
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Could not start the live call",
      );
    }
  };

  const toggleMute = () => {
    const client = clientRef.current;
    if (!client || status !== "live") return;
    if (muted) {
      client.unmute();
      setMuted(false);
    } else {
      client.mute();
      setMuted(true);
    }
  };

  const sendTyped = async (raw?: string) => {
    const message = (raw ?? typed).trim();
    if (!message || sending) return;
    setTyped("");
    setSending(true);
    setError(null);

    try {
      if (status === "live" && callId) {
        const res = await fetch("/api/voice-agent/retell/user-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callId, message }),
        });
        const json: unknown = await res.json().catch(() => null);
        if (!res.ok) {
          const err =
            json && typeof json === "object" && "error" in json
              ? String((json as { error?: string }).error)
              : "Could not send that to Ava";
          throw new Error(err);
        }
        setTypedLines((prev) => {
          const next = [...prev, { role: "user" as const, content: message }];
          typedLinesRef.current = next;
          return next;
        });
        return;
      }

      const history = visibleLines
        .filter((line) => line.content.trim())
        .slice(-12)
        .map((line) => ({
          role: line.role === "user" ? ("user" as const) : ("assistant" as const),
          content: line.content.slice(0, 2000),
        }));

      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history,
          bookingDraft,
          quoteDraft,
          trackingDraft,
          conversationId: conversationIdRef.current,
          channel: "retell",
        }),
      });
      const json: unknown = await res.json();
      const payload =
        json && typeof json === "object"
          ? (json as {
              success?: boolean;
              error?: string;
              data?: {
                reply?: string;
                bookingDraft?: BookingDraft;
                quoteDraft?: QuoteDraft;
                trackingDraft?: TrackingDraft;
              };
            })
          : null;
      if (!res.ok || !payload?.data?.reply) {
        throw new Error(payload?.error || "Could not send that message");
      }
      setTypedLines((prev) => {
        const next = [
          ...prev,
          { role: "user" as const, content: message },
          { role: "agent" as const, content: payload.data!.reply! },
        ];
        typedLinesRef.current = next;
        return next;
      });
      if (payload.data.bookingDraft) setBookingDraft(payload.data.bookingDraft);
      if (payload.data.quoteDraft) setQuoteDraft(payload.data.quoteDraft);
      if (payload.data.trackingDraft) setTrackingDraft(payload.data.trackingDraft);
    } catch (err) {
      setTyped(message);
      setError(err instanceof Error ? err.message : "Could not send that message");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleClose = () => {
    endCall();
    onClose();
  };

  const statusLabel =
    status === "connecting"
      ? "Connecting…"
      : status === "live"
        ? speaking
          ? "Speaking — you can interrupt"
          : muted
            ? "Mic muted · typing still works"
            : "Online · speak or type"
        : status === "ended"
          ? "Call ended · keep chatting"
          : "Usually replies instantly";

  return (
    <ChatWidgetFrame
      open={open}
      subtitle={statusLabel}
      live={status === "live"}
      speaking={speaking}
      onClose={handleClose}
      bodyRef={scrollerRef}
      banner={
        error ? (
          <p className="border-t border-border/60 bg-background px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        ) : null
      }
      composer={
        <div className="border-t border-border/70 bg-background p-3">
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void sendTyped();
            }}
          >
            {status === "live" ? (
              <button
                type="button"
                onClick={toggleMute}
                aria-pressed={muted}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full transition",
                  muted
                    ? "bg-muted text-foreground"
                    : "bg-destructive text-destructive-foreground",
                )}
              >
                {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void startCall()}
                disabled={status === "connecting"}
                aria-label={
                  status === "connecting" ? "Connecting live call" : "Start live call"
                }
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                <Phone className="size-4" />
              </button>
            )}
            <input
              ref={inputRef}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder="Ask about a quote, tracking, or booking…"
              aria-label="Type a message to Ava"
              disabled={sending || status === "connecting"}
              className="h-10 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="submit"
              size="icon"
              rounded="full"
              disabled={sending || status === "connecting" || !typed.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </form>
          {status === "live" ? (
            <button
              type="button"
              onClick={endCall}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-destructive"
            >
              <PhoneOff className="size-3.5" />
              End live call
            </button>
          ) : (
            <p className="mt-2 px-1 text-[11px] text-muted-foreground">
              Tap the phone to talk live. Names and tracking IDs are clearer typed.
            </p>
          )}
        </div>
      }
    >
      {visibleLines.length === 0 ? (
        <>
          <ChatBubble role="agent">
            Hi — I&apos;m Ava, ExpressWay&apos;s receptionist. I can quote a
            shipment, look up tracking, or book an appointment.
          </ChatBubble>
          <ChatPromptChips onSelect={(message) => void sendTyped(message)} />
        </>
      ) : (
        visibleLines.map((line, index) => (
          <ChatBubble
            key={`${line.role}-${index}-${line.content.slice(0, 24)}`}
            role={line.role}
          >
            {line.content}
          </ChatBubble>
        ))
      )}
      {sending ? (
        <p className="px-1 text-xs text-muted-foreground">Ava is typing…</p>
      ) : null}
    </ChatWidgetFrame>
  );
}
