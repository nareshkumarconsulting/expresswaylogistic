"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, HelpCircle, Phone, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const RetellVoicePanel = dynamic(
  () =>
    import("@/features/voice-agent/components/retell-voice-panel").then(
      (mod) => mod.RetellVoicePanel,
    ),
  { ssr: false },
);

const VoiceReceptionistPanel = dynamic(
  () =>
    import("@/features/voice-agent/components/voice-receptionist").then(
      (mod) => mod.VoiceReceptionistPanel,
    ),
  { ssr: false },
);

const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
  "Hello ExpressWay Logistic, I need a shipping quote.",
)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.5 2 2.02 6.48 2.02 12.02c0 1.77.46 3.5 1.34 5.02L2 22l5.1-1.34A10 10 0 0 0 12.04 22C17.58 22 22.06 17.52 22.06 12S17.58 2 12.04 2zm0 18.15c-1.64 0-3.25-.44-4.66-1.27l-.33-.2-3.03.8.81-2.95-.22-.34A8.13 8.13 0 0 1 3.9 12.02c0-4.48 3.65-8.13 8.14-8.13 4.48 0 8.13 3.65 8.13 8.13 0 4.49-3.65 8.13-8.13 8.13z" />
    </svg>
  );
}

const menuItems = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Chat with our team",
    href: whatsappHref,
    external: true,
    icon: WhatsAppIcon,
    iconClass: "bg-[#25D366] text-white",
  },
  {
    id: "voice",
    label: "Chat with Ava",
    description: "Quotes, tracking, or booking",
    icon: Headphones,
    iconClass: "bg-accent text-accent-foreground",
  },
  {
    id: "phone",
    label: "Call us",
    description: siteConfig.contact.phone,
    href: siteConfig.contact.phoneHref,
    external: false,
    icon: Phone,
    iconClass: "bg-primary text-primary-foreground",
  },
] as const;

export function HelpLauncher() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [retellWeb, setRetellWeb] = useState(false);

  useEffect(() => {
    if (!menuOpen && !voiceOpen) return;

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
  }, [menuOpen, voiceOpen]);

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

  const expanded = menuOpen || voiceOpen;

  return (
    <div
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-5 sm:bottom-5"
      aria-live="polite"
    >
      {voiceOpen ? (
        retellWeb ? (
          <RetellVoicePanel open onClose={() => setVoiceOpen(false)} />
        ) : (
          <VoiceReceptionistPanel open onClose={() => setVoiceOpen(false)} />
        )
      ) : null}

      <AnimatePresence>
        {menuOpen && !voiceOpen ? (
          <motion.div
            key="help-menu"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(100vw-2.5rem,17rem)] overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-[var(--ds-shadow-lg)] backdrop-blur-md"
            role="menu"
            aria-label="Help options"
          >
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Need help?</p>
              <p className="text-xs text-muted-foreground">
                Chat, WhatsApp, or a phone call
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
                      <Icon className="size-4" />
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
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
                        onClick={() => setMenuOpen(false)}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
                        onClick={() => {
                          setMenuOpen(false);
                          setVoiceOpen(true);
                        }}
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
            ? "Close chat"
            : menuOpen
              ? "Close help menu"
              : "Open help menu"
        }
        aria-expanded={expanded}
        aria-haspopup="menu"
        whileTap={{ scale: 0.96 }}
      >
        {expanded ? <X className="size-6" /> : <HelpCircle className="size-6" />}
      </motion.button>
    </div>
  );
}
