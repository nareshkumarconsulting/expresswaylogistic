"use client";

import type { ReactNode, RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHAT_PROMPTS = [
  { label: "Get a quote", message: "I need a shipping quote." },
  { label: "Track a shipment", message: "I want to track a shipment." },
  { label: "Book a meeting", message: "I'd like to book an appointment." },
] as const;

export function ChatBubble({
  role,
  children,
}: {
  role: "agent" | "user";
  children: ReactNode;
}) {
  const isAgent = role === "agent";
  return (
    <div
      className={cn(
        "max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed",
        isAgent
          ? "self-start rounded-2xl rounded-bl-md bg-background text-foreground shadow-sm ring-1 ring-border/70"
          : "self-end rounded-2xl rounded-br-md bg-accent text-accent-foreground",
      )}
    >
      {children}
    </div>
  );
}

export function ChatPromptChips({
  onSelect,
}: {
  onSelect: (message: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CHAT_PROMPTS.map((prompt) => (
        <button
          key={prompt.label}
          type="button"
          onClick={() => onSelect(prompt.message)}
          className="rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent hover:text-accent"
        >
          {prompt.label}
        </button>
      ))}
    </div>
  );
}

export function ChatWidgetFrame({
  open,
  subtitle,
  live,
  speaking,
  onClose,
  children,
  banner,
  composer,
  bodyRef,
}: {
  open: boolean;
  subtitle: string;
  live?: boolean;
  speaking?: boolean;
  onClose: () => void;
  children: ReactNode;
  banner?: ReactNode;
  composer: ReactNode;
  bodyRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-[min(34rem,calc(100dvh-6.5rem))] w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[var(--ds-shadow-lg)]"
          role="dialog"
          aria-label="Chat with Ava"
        >
          <div className="flex items-center gap-3 bg-primary px-3.5 py-3 text-primary-foreground">
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              A
              <span
                className={cn(
                  "absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-primary",
                  speaking ? "animate-pulse bg-secondary" : "bg-emerald-400",
                )}
                aria-hidden
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold tracking-tight">Ava</p>
              <p className="truncate text-xs text-primary-foreground/75">
                {live ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {subtitle}
                  </span>
                ) : (
                  subtitle
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-primary-foreground/80 transition hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            ref={bodyRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-surface px-3 py-3"
          >
            {children}
          </div>

          {banner}

          {composer}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
