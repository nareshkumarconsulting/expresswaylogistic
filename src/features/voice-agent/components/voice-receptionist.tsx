"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
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
    neuralVoice,
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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-border/80 bg-background/95 shadow-[var(--ds-shadow-lg)] backdrop-blur-md"
          role="dialog"
          aria-label="ExpressWay voice receptionist"
        >
            <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-primary px-4 py-3 text-primary-foreground">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Ava · Receptionist
                  {neuralVoice ? (
                    <span className="ml-2 align-middle text-[10px] font-medium tracking-wide text-primary-foreground/75">
                      NATURAL VOICE
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-primary-foreground/80">
                  {handsFree
                    ? speaking
                      ? "Live call · you can interrupt"
                      : listening
                        ? "Live call · listening"
                        : busy
                          ? "Live call · thinking"
                          : "Live call · mic on"
                    : "Mic muted · tap to unmute"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-1.5 text-primary-foreground/90 transition hover:bg-primary-foreground/10"
                aria-label="Close receptionist"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              ref={scrollerRef}
              className="flex max-h-72 flex-col gap-3 overflow-y-auto px-3 py-3"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                    m.role === "assistant"
                      ? "self-start bg-muted text-foreground"
                      : "self-end bg-accent text-accent-foreground",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {interim ? (
                <div className="self-end max-w-[90%] rounded-lg bg-accent/70 px-3 py-2 text-sm text-accent-foreground/90">
                  {interim}
                </div>
              ) : null}
            </div>

            {action.type === "navigate" ? (
              <div className="border-t border-border/60 px-3 py-2">
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
              <div className="border-t border-border/60 px-3 py-2 text-sm text-foreground">
                Booked · ref {action.referenceId}
              </div>
            ) : null}

            {action.type === "quote_submitted" ? (
              <div className="border-t border-border/60 px-3 py-2 text-sm text-foreground">
                Quote sent · ref {action.referenceId}
              </div>
            ) : null}

            {action.type === "tracking_result" ? (
              <div className="border-t border-border/60 px-3 py-2">
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
              <p className="px-3 pb-1 text-xs text-destructive">{error}</p>
            ) : null}

            {!supported ? (
              <p className="px-3 pb-2 text-xs text-muted-foreground">
                Voice needs Chrome or Edge. You can still type below.
              </p>
            ) : neuralVoice ? (
              <p className="px-3 pb-1 text-xs text-muted-foreground">
                Natural neural voice on. Mic stays live — speak anytime.
              </p>
            ) : (
              <p className="px-3 pb-1 text-xs text-muted-foreground">
                Using browser voice. Add GROQ_API_KEY for a more natural
                receptionist voice.
              </p>
            )}

            <form
              className="flex items-center gap-2 border-t border-border/70 p-3"
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
                placeholder="Or type if needed…"
                className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={busy}
              />
              <Button type="submit" size="sm" disabled={busy || !typed.trim()}>
                Send
              </Button>
            </form>
          </motion.div>
        ) : null}
    </AnimatePresence>
  );
}
