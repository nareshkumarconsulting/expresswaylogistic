"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Send } from "lucide-react";
import type { RetellWebClient } from "retell-client-js-sdk";
import { Button } from "@/components/atoms/button";
import {
  ChatBubble,
  ChatPromptChips,
  ChatWidgetFrame,
} from "@/features/voice-agent/components/chat-widget-frame";
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

  const endCall = useCallback(() => {
    clientRef.current?.stopCall();
    clientRef.current = null;
    setCallId(null);
    setStatus((prev) => (prev === "idle" ? prev : "ended"));
    setSpeaking(false);
    setMuted(false);
  }, []);

  useEffect(() => {
    if (!open) {
      endCall();
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
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleLines.length]);

  const startCall = async () => {
    setError(null);
    setStatus("connecting");
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
              data?: { accessToken?: string; callId?: string };
            })
          : null;
      const accessToken = data?.data?.accessToken;
      if (!res.ok || !accessToken) {
        throw new Error(data?.error || "Could not start the live call");
      }

      const { RetellWebClient: Client } = await import("retell-client-js-sdk");
      const client = new Client();
      clientRef.current = client;
      setCallId(data.data?.callId ?? null);

      client.on("call_started", () => {
        setStatus("live");
        inputRef.current?.focus();
      });
      client.on("call_ended", () => {
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
          setTranscript(
            payload.transcript
              .filter((line) => line.content?.trim())
              .map((line) => ({
                role: line.role === "user" ? "user" : "agent",
                content: line.content,
              })),
          );
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
        client.stopCall();
        clientRef.current = null;
        setCallId(null);
        setStatus("ended");
      });

      await client.startCall({ accessToken });
    } catch (err) {
      clientRef.current = null;
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
        setTypedLines((prev) => [...prev, { role: "user", content: message }]);
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
      setTypedLines((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "agent", content: payload.data!.reply! },
      ]);
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
