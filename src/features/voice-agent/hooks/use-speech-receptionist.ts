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

function prepareForSpeech(
  shouldListenRef: { current: boolean },
  clearRestartTimer: () => void,
  recognitionRef: { current: SpeechRecognitionLike | null },
  setListening: (v: boolean) => void,
  setInterim: (v: string) => void,
) {
  shouldListenRef.current = false;
  clearRestartTimer();
  try {
    recognitionRef.current?.abort();
  } catch {
    /* ignore */
  }
  recognitionRef.current = null;
  setListening(false);
  setInterim("");
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
    setSpeaking(false);
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

          utterance.onstart = () => setSpeaking(true);
          utterance.onend = () => {
            setSpeaking(false);
            resolve();
          };
          utterance.onerror = () => {
            setSpeaking(false);
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
    [lang],
  );

  const speakNeural = useCallback(async (text: string): Promise<boolean> => {
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

      await new Promise<void>((resolve, reject) => {
        const audio = new Audio(url);
        audioRef.current = audio;
        setSpeaking(true);
        audio.onended = () => {
          setSpeaking(false);
          audioRef.current = null;
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
          }
          resolve();
        };
        audio.onerror = () => {
          setSpeaking(false);
          reject(new Error("audio playback failed"));
        };
        void audio.play().catch(reject);
      });

      return true;
    } catch {
      return false;
    }
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;

      prepareForSpeech(
        shouldListenRef,
        clearRestartTimer,
        recognitionRef,
        setListening,
        setInterim,
      );
      stopSpeaking();

      if (neuralVoiceRef.current) {
        const ok = await speakNeural(text);
        if (ok) return;
      }

      await speakBrowser(text);
    },
    [clearRestartTimer, speakBrowser, speakNeural, stopSpeaking],
  );

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
    recognition.continuous = false;
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
      setInterim(interimText);
      if (finalText.trim()) {
        shouldListenRef.current = false;
        clearRestartTimer();
        onFinalRef.current?.(finalText.trim());
      }
    };

    recognition.onerror = (event) => {
      const code = event.error ?? "unknown";
      startingRef.current = false;

      if (code === "aborted") return;

      if (code === "no-speech") {
        if (shouldListenRef.current) {
          clearRestartTimer();
          restartTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current) beginRecognition();
          }, 300);
        }
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
      } else {
        setError(`Voice input failed (${code}). Tap the mic to retry.`);
      }
      shouldListenRef.current = false;
      setListening(false);
    };

    recognition.onend = () => {
      startingRef.current = false;
      setListening(false);
      setInterim("");

      if (shouldListenRef.current) {
        clearRestartTimer();
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current) beginRecognition();
        }, 250);
      }
    };

    try {
      recognition.start();
      setListening(true);
      startingRef.current = false;
    } catch {
      startingRef.current = false;
      setListening(false);
      if (shouldListenRef.current) {
        clearRestartTimer();
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current) beginRecognition();
        }, 400);
      }
    }
  }, [clearRestartTimer, lang]);

  const startListening = useCallback(
    (onFinal: (transcript: string) => void, delayMs = 0) => {
      const Recognition = getSpeechRecognition();
      if (!Recognition) {
        setError("Voice input needs Chrome or Edge with microphone access.");
        return;
      }

      stopSpeaking();
      onFinalRef.current = onFinal;
      shouldListenRef.current = true;
      clearRestartTimer();

      restartTimerRef.current = setTimeout(() => {
        if (shouldListenRef.current) beginRecognition();
      }, delayMs);
    },
    [beginRecognition, clearRestartTimer, stopSpeaking],
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
