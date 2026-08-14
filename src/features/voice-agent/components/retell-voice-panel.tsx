"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, X } from "lucide-react";
import type { RetellWebClient } from "retell-client-js-sdk";
import { Button } from "@/components/atoms/button";
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
  const clientRef = useRef<RetellWebClient | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const endCall = useCallback(() => {
    clientRef.current?.stopCall();
    clientRef.current = null;
    setStatus((prev) => (prev === "idle" ? prev : "ended"));
    setSpeaking(false);
    setMuted(false);
  }, []);

  useEffect(() => {
    if (!open) {
      endCall();
      setStatus("idle");
      setTranscript([]);
      setError(null);
    }
  }, [open, endCall]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [transcript]);

  const startCall = async () => {
    setError(null);
    setStatus("connecting");
    setTranscript([]);

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
              data?: { accessToken?: string };
            })
          : null;
      const accessToken = data?.data?.accessToken;
      if (!res.ok || !accessToken) {
        throw new Error(data?.error || "Could not start the live call");
      }

      const { RetellWebClient: Client } = await import("retell-client-js-sdk");
      const client = new Client();
      clientRef.current = client;

      client.on("call_started", () => {
        setStatus("live");
      });
      client.on("call_ended", () => {
        setStatus("ended");
        setSpeaking(false);
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
        setStatus("ended");
      });

      await client.startCall({ accessToken });
    } catch (err) {
      clientRef.current = null;
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

  const handleClose = () => {
    endCall();
    onClose();
  };

  const statusLabel =
    status === "connecting"
      ? "Connecting…"
      : status === "live"
        ? speaking
          ? "Ava is speaking · you can interrupt"
          : muted
            ? "Mic muted"
            : "Live web call · listening"
        : status === "ended"
          ? "Call ended"
          : "Browser voice only — no phone number";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mb-1 w-[min(100vw-2.5rem,22rem)] overflow-hidden rounded-xl border border-border/80 bg-background shadow-[var(--ds-shadow-lg)]"
          role="dialog"
          aria-label="Ava live web call"
        >
          <div className="flex items-center justify-between bg-primary px-3 py-2.5 text-primary-foreground">
            <div>
              <p className="text-sm font-semibold">Ava</p>
              <p className="text-xs text-primary-foreground/80">{statusLabel}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1.5 text-primary-foreground/90 transition hover:bg-primary-foreground/10"
              aria-label="Close live call"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="flex max-h-72 flex-col gap-3 overflow-y-auto px-3 py-3"
          >
            {transcript.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Start a live web call with Ava. She can take a quote, look up
                tracking, or book an appointment. This stays in the browser —
                no phone number is used.
              </p>
            ) : (
              transcript.map((line, index) => (
                <div
                  key={`${line.role}-${index}`}
                  className={cn(
                    "max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                    line.role === "agent"
                      ? "self-start bg-muted text-foreground"
                      : "self-end bg-accent text-accent-foreground",
                  )}
                >
                  {line.content}
                </div>
              ))
            )}
          </div>

          {error ? (
            <p className="px-3 pb-2 text-xs text-destructive">{error}</p>
          ) : null}

          <div className="flex items-center gap-2 border-t border-border/70 p-3">
            {status === "live" ? (
              <>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-pressed={muted}
                  aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full transition",
                    muted
                      ? "bg-primary text-primary-foreground"
                      : "bg-destructive text-destructive-foreground",
                  )}
                >
                  {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={endCall}
                >
                  <PhoneOff className="size-4" />
                  End call
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="flex-1"
                onClick={() => void startCall()}
                disabled={status === "connecting"}
              >
                <Phone className="size-4" />
                {status === "connecting" ? "Connecting…" : "Start live call"}
              </Button>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
