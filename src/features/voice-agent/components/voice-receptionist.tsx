"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  ChatBubble,
  ChatPromptChips,
  ChatWidgetFrame,
} from "@/features/voice-agent/components/chat-widget-frame";
import { useSpeechReceptionist } from "@/features/voice-agent/hooks/use-speech-receptionist";
import type {
  BookingDraft,
  QuoteDraft,
  TrackingDraft,
  VoiceAgentAction,
} from "@/features/voice-agent/schemas";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME =
  "Hello! I'm Ava, the ExpressWay receptionist. We're on a live call — speak anytime for a quote, tracking, or an appointment.";

export interface VoiceReceptionistPanelProps {
  open: boolean;
  onClose: () => void;
}

export function VoiceReceptionistPanel({ open, onClose }: VoiceReceptionistPanelProps) {
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({});
  const [quoteDraft, setQuoteDraft] = useState<QuoteDraft>({});
  const [trackingDraft, setTrackingDraft] = useState<TrackingDraft>({});
  const [action, setAction] = useState<VoiceAgentAction>({ type: "none" });
  const [typed, setTyped] = useState("");
  const [handsFree, setHandsFree] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false);
  const openRef = useRef(false);
  const busyRef = useRef(false);
  const handsFreeRef = useRef(true);
  const bookingDraftRef = useRef<BookingDraft>({});
  const quoteDraftRef = useRef<QuoteDraft>({});
  const trackingDraftRef = useRef<TrackingDraft>({});
  const messagesRef = useRef<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const pendingRef = useRef<string[]>([]);
  const sendMessageRef = useRef<(raw: string) => Promise<void>>(async () => {});

  const {
    supported,
    listening,
    speaking,
    interim,
    error,
    setError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useSpeechReceptionist({ lang: "en-IN" });

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

  useEffect(() => {
    bookingDraftRef.current = bookingDraft;
  }, [bookingDraft]);

  useEffect(() => {
    quoteDraftRef.current = quoteDraft;
  }, [quoteDraft]);

  useEffect(() => {
    trackingDraftRef.current = trackingDraft;
  }, [trackingDraft]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, interim, open]);

  const resumeListening = useCallback(() => {
    if (!supported || !openRef.current || !handsFreeRef.current) {
      return;
    }

    startListening((transcript) => {
      void sendMessageRef.current(transcript);
    }, 0);
  }, [startListening, supported]);

  const sendMessage = useCallback(
    async (raw: string) => {
      const message = raw.trim();
      if (!message) return;

      if (busyRef.current) {
        pendingRef.current = [message];
        return;
      }

      setBusy(true);
      busyRef.current = true;
      pendingRef.current = [];
      setError(null);
      setAction({ type: "none" });

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: message,
      };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        messagesRef.current = next;
        return next;
      });

      try {
        const history = messagesRef.current
          .filter((m) => m.id !== "welcome")
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/voice-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history,
            bookingDraft: bookingDraftRef.current,
            quoteDraft: quoteDraftRef.current,
            trackingDraft: trackingDraftRef.current,
          }),
          signal: AbortSignal.timeout(12_000),
        });

        const json = (await res.json()) as {
          success?: boolean;
          error?: string;
          data?: {
            reply: string;
            bookingDraft: BookingDraft;
            quoteDraft: QuoteDraft;
            trackingDraft: TrackingDraft;
            action: VoiceAgentAction;
          };
        };

        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.error ?? "Receptionist unavailable");
        }

        setBookingDraft(json.data.bookingDraft);
        bookingDraftRef.current = json.data.bookingDraft;
        setQuoteDraft(json.data.quoteDraft ?? {});
        quoteDraftRef.current = json.data.quoteDraft ?? {};
        setTrackingDraft(json.data.trackingDraft ?? {});
        trackingDraftRef.current = json.data.trackingDraft ?? {};
        setAction(json.data.action);
        setMessages((prev) => {
          const next: ChatMessage[] = [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: "assistant",
              content: json.data!.reply,
            },
          ];
          messagesRef.current = next;
          return next;
        });

        await speak(json.data.reply);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setError(msg);
        const fallback =
          "Sorry, I had trouble with that. Please try again in a moment.";
        setMessages((prev) => {
          const next: ChatMessage[] = [
            ...prev,
            { id: `a-${Date.now()}`, role: "assistant", content: fallback },
          ];
          messagesRef.current = next;
          return next;
        });
        await speak(fallback);
      } finally {
        setBusy(false);
        busyRef.current = false;
        resumeListening();
        const queued = pendingRef.current.shift();
        if (queued) {
          void sendMessageRef.current(queued);
        }
      }
    },
    [resumeListening, setError, speak],
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const handleOpen = useCallback(async () => {
    openRef.current = true;
    setHandsFree(true);
    handsFreeRef.current = true;
    resumeListening();

    if (!greetedRef.current) {
      greetedRef.current = true;
      await speak(WELCOME);
    }
  }, [resumeListening, speak]);

  useEffect(() => {
    if (open) {
      void handleOpen();
    } else {
      stopListening();
      stopSpeaking();
      openRef.current = false;
    }
  }, [open, handleOpen, stopListening, stopSpeaking]);

  const handleClose = () => {
    stopListening();
    stopSpeaking();
    openRef.current = false;
    onClose();
  };

  const toggleMic = () => {
    if (listening || handsFreeRef.current) {
      setHandsFree(false);
      handsFreeRef.current = false;
      stopListening();
      return;
    }
    setHandsFree(true);
    handsFreeRef.current = true;
    startListening((transcript) => {
      void sendMessageRef.current(transcript);
    }, 0);
  };

  const subtitle = !supported
    ? "Type below · voice needs Chrome or Edge"
    : handsFree
      ? speaking
        ? "Speaking — you can interrupt"
        : listening
          ? "Listening…"
          : busy
            ? "Thinking…"
            : "Online · speak or type"
      : "Mic muted · tap to unmute";

  const showPrompts = messages.length === 1 && messages[0]?.id === "welcome";

  return (
    <ChatWidgetFrame
      open={open}
      subtitle={subtitle}
      live={handsFree && supported}
      speaking={speaking}
      onClose={handleClose}
      bodyRef={scrollerRef}
      banner={
        <>
          {action.type === "navigate" ? (
            <div className="border-t border-border/60 bg-background px-3 py-2">
              <Link
                href={action.href}
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                onClick={handleClose}
              >
                {action.label} →
              </Link>
            </div>
          ) : null}
          {action.type === "appointment_booked" ? (
            <div className="border-t border-border/60 bg-background px-3 py-2 text-sm text-foreground">
              Booked · ref {action.referenceId}
            </div>
          ) : null}
          {action.type === "quote_submitted" ? (
            <div className="border-t border-border/60 bg-background px-3 py-2 text-sm text-foreground">
              Quote sent · ref {action.referenceId}
            </div>
          ) : null}
          {action.type === "tracking_result" ? (
            <div className="border-t border-border/60 bg-background px-3 py-2">
              <Link
                href={action.href}
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                onClick={handleClose}
              >
                {action.found
                  ? `Open ${action.trackingId} →`
                  : "Open Track Shipment →"}
              </Link>
            </div>
          ) : null}
          {error ? (
            <p className="border-t border-border/60 bg-background px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          ) : null}
        </>
      }
      composer={
        <div className="border-t border-border/70 bg-background p-3">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const value = typed;
              setTyped("");
              void sendMessage(value);
            }}
          >
            <button
              type="button"
              onClick={toggleMic}
              disabled={!supported}
              aria-pressed={listening}
              aria-label={
                listening || handsFree ? "Mute microphone" : "Unmute microphone"
              }
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full transition",
                listening || handsFree
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
                !supported && "opacity-50",
              )}
            >
              {listening || handsFree ? (
                <Mic className="size-4" />
              ) : (
                <MicOff className="size-4" />
              )}
            </button>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Ask about a quote, tracking, or booking…"
              aria-label="Type a message to Ava"
              className="h-10 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              disabled={busy}
            />
            <Button
              type="submit"
              size="icon"
              rounded="full"
              disabled={busy || !typed.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      }
    >
      {messages.map((m) => (
        <ChatBubble
          key={m.id}
          role={m.role === "assistant" ? "agent" : "user"}
        >
          {m.content}
        </ChatBubble>
      ))}
      {showPrompts ? (
        <ChatPromptChips
          onSelect={(message) => {
            void sendMessage(message);
          }}
        />
      ) : null}
      {interim ? (
        <ChatBubble role="user">{interim}</ChatBubble>
      ) : null}
    </ChatWidgetFrame>
  );
}
