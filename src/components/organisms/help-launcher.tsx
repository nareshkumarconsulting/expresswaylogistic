"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Headphones,
  HelpCircle,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { RetellVoicePanel } from "@/features/voice-agent/components/retell-voice-panel";
import { VoiceReceptionistPanel } from "@/features/voice-agent/components/voice-receptionist";
import { cn } from "@/lib/utils";

const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
  "Hello ExpressWay Logistic, I need a shipping quote.",
)}`;

const menuItems = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Chat with our team",
    href: whatsappHref,
    external: true,
    icon: MessageCircle,
    iconClass: "bg-[#25D366] text-white",
  },
  {
    id: "voice",
    label: "Talk to Ava",
    description: "AI voice receptionist",
    icon: Headphones,
    iconClass: "bg-primary text-primary-foreground",
  },
  {
    id: "phone",
    label: "Call us",
    description: siteConfig.contact.phone,
    href: siteConfig.contact.phoneHref,
    external: false,
    icon: Phone,
    iconClass: "bg-accent text-accent-foreground",
  },
] as const;

export function HelpLauncher() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [retellWeb, setRetellWeb] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/voice-agent/retell/web-call")
      .then((res) => res.json())
      .then((json: { data?: { enabled?: boolean } }) => {
        if (!cancelled && json.data?.enabled) setRetellWeb(true);
      })
      .catch(() => {
        /* keep browser Ava fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setVoiceOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen && !voiceOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, voiceOpen, closeAll]);

  const handleFabClick = () => {
    if (voiceOpen) {
      setVoiceOpen(false);
      return;
    }
    setMenuOpen((prev) => !prev);
  };

  const handleMenuAction = (id: (typeof menuItems)[number]["id"]) => {
    if (id === "voice") {
      setMenuOpen(false);
      setVoiceOpen(true);
    }
  };

  const fabExpanded = menuOpen || voiceOpen;

  return (
    <div
      className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-3"
      aria-live="polite"
    >
      {retellWeb ? (
        <RetellVoicePanel open={voiceOpen} onClose={() => setVoiceOpen(false)} />
      ) : (
        <VoiceReceptionistPanel
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
        />
      )}

      <AnimatePresence>
        {menuOpen && !voiceOpen ? (
          <motion.div
            key="help-menu"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(100vw-2.5rem,16rem)] overflow-hidden rounded-xl border border-border/80 bg-background/95 shadow-[var(--ds-shadow-lg)] backdrop-blur-md"
            role="menu"
            aria-label="Help options"
          >
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Need help?</p>
              <p className="text-xs text-muted-foreground">
                Quotes, tracking, or appointments
              </p>
            </div>
            <ul className="p-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full",
                        item.iconClass,
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </>
                );

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    role="none"
                  >
                    {"href" in item && item.href ? (
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        role="menuitem"
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted"
                        onClick={() => setMenuOpen(false)}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted"
                        onClick={() => handleMenuAction(item.id)}
                      >
                        {content}
                      </button>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleFabClick}
        className={cn(
          "flex size-14 items-center justify-center rounded-full shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          voiceOpen
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground hover:bg-accent/90",
        )}
        aria-label={
          voiceOpen
            ? "Close voice receptionist"
            : menuOpen
              ? "Close help menu"
              : "Open help menu"
        }
        aria-expanded={fabExpanded}
        aria-haspopup="menu"
        whileTap={{ scale: 0.96 }}
      >
        {fabExpanded ? (
          <X className="size-6" />
        ) : (
          <HelpCircle className="size-6" />
        )}
      </motion.button>
    </div>
  );
}
