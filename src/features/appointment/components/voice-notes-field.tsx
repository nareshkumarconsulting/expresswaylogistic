"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { FormField } from "@/components/molecules/form-field";
import { cn } from "@/lib/utils";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike> & {
    length: number;
  };
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type VoiceNotesFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  lang?: string;
};

export function VoiceNotesField({
  id = "notes",
  value,
  onChange,
  error,
  placeholder = "Lane, commodity, weight, HS codes, or questions for our team...",
  lang = "en-IN",
}: VoiceNotesFieldProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef(value);
  const shouldListenRef = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognition()));
  }, []);

  useEffect(() => {
    if (!listening) {
      baseTextRef.current = value;
    }
  }, [value, listening]);

  const cleanupRecognition = useCallback(() => {
    shouldListenRef.current = false;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.abort();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => cleanupRecognition, [cleanupRecognition]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }
    setListening(false);
    setInterim("");
  }, []);

  const startListening = useCallback(() => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setVoiceError(
        "Voice input is not supported in this browser. Try Chrome or Edge.",
      );
      return;
    }

    cleanupRecognition();
    setVoiceError(null);
    baseTextRef.current = value;
    shouldListenRef.current = true;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalChunk += `${transcript} `;
        } else {
          interimChunk += transcript;
        }
      }

      if (finalChunk.trim()) {
        const prefix = baseTextRef.current.trimEnd();
        const next = prefix
          ? `${prefix} ${finalChunk.trim()} `
          : `${finalChunk.trim()} `;
        baseTextRef.current = next;
        onChangeRef.current(next.trimEnd());
      }

      setInterim(interimChunk);
    };

    recognition.onerror = (event) => {
      const code = event.error ?? "unknown";
      if (code === "aborted") return;
      if (code === "no-speech") return;

      shouldListenRef.current = false;
      setListening(false);
      setInterim("");

      if (code === "not-allowed" || code === "service-not-allowed") {
        setVoiceError(
          "Microphone is blocked for this site. Allow mic access in browser settings, then try again.",
        );
        return;
      }

      setVoiceError(
        `Voice input failed (${code}). Check your microphone and try again.`,
      );
    };

    recognition.onend = () => {
      if (!shouldListenRef.current) {
        setListening(false);
        setInterim("");
        return;
      }
      // Chrome often ends after a pause; restart while user still wants listening.
      try {
        recognition.start();
      } catch {
        shouldListenRef.current = false;
        setListening(false);
        setInterim("");
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch {
      shouldListenRef.current = false;
      setListening(false);
      setVoiceError("Unable to start voice input. Please try again.");
    }
  }, [cleanupRecognition, lang, value]);

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const displayValue =
    listening && interim
      ? `${value}${value && !/\s$/.test(value) ? " " : ""}${interim}`
      : value;

  return (
    <FormField
      label="Cargo / meeting notes"
      htmlFor={id}
      error={error ?? voiceError ?? undefined}
    >
      <div className="space-y-3">
        <div className="relative">
          <Textarea
            id={id}
            value={displayValue}
            onChange={(e) => {
              if (listening) return;
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className={cn(
              "min-h-[128px] border-border/80 bg-background pr-12",
              listening &&
                "border-accent bg-accent/[0.03] ring-2 ring-accent/25",
            )}
            readOnly={listening}
            aria-describedby={listening ? `${id}-listening` : undefined}
          />
          <Button
            type="button"
            size="icon"
            rounded="none"
            variant={listening ? "default" : "outline"}
            className={cn(
              "absolute top-2.5 right-2.5 size-9",
              listening && "animate-pulse",
            )}
            onClick={toggleListening}
            disabled={!supported}
            aria-pressed={listening}
            aria-label={
              listening ? "Stop voice typing" : "Start voice typing for notes"
            }
            title={
              supported
                ? listening
                  ? "Stop listening"
                  : "Speak your notes"
                : "Voice input not supported in this browser"
            }
          >
            {listening ? (
              <Square className="size-4 fill-current" />
            ) : supported ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </Button>
        </div>

        <div className="flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {listening ? (
            <p id={`${id}-listening`} className="font-medium text-accent">
              Listening… speak clearly. Click stop when finished.
            </p>
          ) : supported ? (
            <p>Optional: tap the mic to dictate cargo details.</p>
          ) : (
            <p>Voice typing needs Chrome or Edge with microphone access.</p>
          )}
          {listening ? (
            <button
              type="button"
              className="font-semibold text-foreground underline-offset-2 hover:underline"
              onClick={stopListening}
            >
              Stop
            </button>
          ) : null}
        </div>
      </div>
    </FormField>
  );
}
