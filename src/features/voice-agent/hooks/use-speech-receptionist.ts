"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike> & { length: number };
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

function normalizeHeard(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isLikelyEcho(transcript: string, lastSpoken: string): boolean {
  const heard = normalizeHeard(transcript);
  const spoken = normalizeHeard(lastSpoken);
  if (!heard || !spoken) return false;
  if (spoken.includes(heard) || heard.includes(spoken.slice(0, 48))) return true;
  const heardWords = new Set(heard.split(" ").filter((w) => w.length > 3));
  if (heardWords.size === 0) return false;
  let overlap = 0;
  for (const word of heardWords) {
    if (spoken.includes(word)) overlap += 1;
  }
  return overlap / heardWords.size >= 0.6;
}

export function useSpeechReceptionist(options?: { lang?: string }) {
  const lang = options?.lang ?? "en-IN";
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [neuralVoice, setNeuralVoice] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFinalRef = useRef<((transcript: string) => void) | null>(null);
  const startingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const neuralVoiceRef = useRef(false);
  const speakingRef = useRef(false);
  const lastSpokenRef = useRef("");
  const ignoreUntilRef = useRef(0);

  useEffect(() => {
    setSupported(
      Boolean(getSpeechRecognition()) && "speechSynthesis" in window,
    );

    void fetch("/api/voice-agent/speak")
      .then((res) => res.json())
      .then((json: { data?: { neural?: boolean } }) => {
        const enabled = Boolean(json.data?.neural);
        neuralVoiceRef.current = enabled;
        setNeuralVoice(enabled);
      })
      .catch(() => {
        neuralVoiceRef.current = false;
        setNeuralVoice(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      recognitionRef.current?.abort();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    clearRestartTimer();
    startingRef.current = false;
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
    setListening(false);
    setInterim("");
  }, [clearRestartTimer]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    speakingRef.current = false;
    setSpeaking(false);
  }, []);

  const finishSpeaking = useCallback(() => {
    speakingRef.current = false;
    setSpeaking(false);
    ignoreUntilRef.current = Date.now() + 450;
  }, []);

  const speakBrowser = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        let started = false;
        const run = () => {
          if (started) return;
          started = true;
          window.speechSynthesis.onvoiceschanged = null;

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.96;
          utterance.pitch = 1.02;

          const voices = window.speechSynthesis.getVoices();
          const preferred =
            voices.find(
              (v) =>
                v.lang.toLowerCase().startsWith("en") &&
                /google uk english female|microsoft zira|samantha|female|woman/i.test(
                  v.name,
                ),
            ) ||
            voices.find((v) => v.lang.toLowerCase().startsWith("en-in")) ||
            voices.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ||
            voices.find((v) => v.lang.toLowerCase().startsWith("en"));

          if (preferred) utterance.voice = preferred;

          utterance.onstart = () => {
            speakingRef.current = true;
            setSpeaking(true);
          };
          utterance.onend = () => {
            finishSpeaking();
            resolve();
          };
          utterance.onerror = () => {
            finishSpeaking();
            resolve();
          };

          window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => run();
          setTimeout(run, 250);
        } else {
          run();
        }
      }),
    [finishSpeaking, lang],
  );

  const speakNeural = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/voice-agent/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) return false;
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("audio")) return false;

        const blob = await res.blob();
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;

        await new Promise<void>((resolve) => {
          const audio = new Audio(url);
          audioRef.current = audio;
          speakingRef.current = true;
          setSpeaking(true);
          let settled = false;
          const settle = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(watchdog);
            audioRef.current = null;
            if (audioUrlRef.current) {
              URL.revokeObjectURL(audioUrlRef.current);
              audioUrlRef.current = null;
            }
            finishSpeaking();
            resolve();
          };
          const watchdog = window.setTimeout(settle, 20_000);
          audio.onended = settle;
          audio.onerror = settle;
          void audio.play().catch(settle);
        });

        return true;
      } catch {
        finishSpeaking();
        return false;
      }
    },
    [finishSpeaking],
  );

  const speak = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;
      lastSpokenRef.current = text;
      stopSpeaking();

      if (neuralVoiceRef.current) {
        const ok = await speakNeural(text);
        if (ok) return;
      }

      await speakBrowser(text);
    },
    [speakBrowser, speakNeural, stopSpeaking],
  );

  const deliverTranscript = useCallback((transcript: string) => {
    const heard = transcript.trim();
    if (!heard) return;

    const echoing = isLikelyEcho(heard, lastSpokenRef.current);
    if (echoing) return;
    if (speakingRef.current && heard.length < 3) return;

    if (speakingRef.current) {
      stopSpeaking();
    }

    setInterim("");
    onFinalRef.current?.(heard);
  }, [stopSpeaking]);

  const beginRecognition = useCallback(() => {
    const Recognition = getSpeechRecognition();
    if (!Recognition || !shouldListenRef.current || startingRef.current) {
      return;
    }

    startingRef.current = true;
    setError(null);

    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result) continue;
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (
        !speakingRef.current &&
        Date.now() >= ignoreUntilRef.current
      ) {
        setInterim(interimText);
      }
      if (finalText.trim()) deliverTranscript(finalText);
    };

    recognition.onerror = (event) => {
      const code = event.error ?? "unknown";
      startingRef.current = false;

      if (code === "aborted") return;

      if (code === "no-speech") {
        return;
      }

      if (code === "not-allowed") {
        setError(
          "Microphone permission denied. Allow mic access and try again.",
        );
        shouldListenRef.current = false;
        setListening(false);
        return;
      }

      if (code === "network") {
        setError("Speech recognition needs an internet connection in Chrome.");
      }
    };

    recognition.onend = () => {
      startingRef.current = false;
      recognitionRef.current = null;

      if (shouldListenRef.current) {
        clearRestartTimer();
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current) beginRecognition();
        }, 120);
      } else {
        setListening(false);
        setInterim("");
      }
    };

    try {
      recognition.start();
      setListening(true);
      startingRef.current = false;
    } catch {
      startingRef.current = false;
      if (shouldListenRef.current) {
        clearRestartTimer();
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current) beginRecognition();
        }, 300);
      }
    }
  }, [clearRestartTimer, deliverTranscript, lang]);

  const startListening = useCallback(
    (onFinal: (transcript: string) => void, delayMs = 0) => {
      const Recognition = getSpeechRecognition();
      if (!Recognition) {
        setError("Voice input needs Chrome or Edge with microphone access.");
        return;
      }

      onFinalRef.current = onFinal;
      if (shouldListenRef.current && recognitionRef.current) {
        setListening(true);
        return;
      }

      shouldListenRef.current = true;
      clearRestartTimer();

      restartTimerRef.current = setTimeout(() => {
        if (shouldListenRef.current) beginRecognition();
      }, delayMs);
    },
    [beginRecognition, clearRestartTimer],
  );

  return {
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
  };
}
