"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MapPin, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { HeroBackdrop } from "@/components/molecules/hero-backdrop";
import { withDefinitionLead } from "@/constants/entity";

const HIGHLIGHTS = [
  {
    icon: Package,
    title: "Live status",
    description: "Milestones from booking through delivery",
  },
  {
    icon: MapPin,
    title: "Lane & ETA",
    description: "Origin, destination, mode, and arrival",
  },
  {
    icon: ShieldCheck,
    title: "Secure lookup",
    description: "Public tracking without client details",
  },
] as const;

export function TrackHero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative isolate overflow-hidden bg-brand pt-28 pb-16 text-brand-foreground md:pt-40 md:pb-28">
      <div className="absolute inset-0 z-0">
        <HeroBackdrop src="/images/hero-port.jpg" className="object-[72%_center]" priority />
        <div className="absolute inset-0 bg-brand/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/88 to-brand/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-brand/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,163,255,0.28),transparent_50%)]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container-page relative z-10">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.p
              {...fade(0.05)}
              className="mb-4 text-xs font-semibold tracking-[0.22em] text-accent uppercase"
            >
              Shipment Tracking
            </motion.p>
            <motion.h1
              {...fade(0.1)}
              className="text-display mb-5 max-w-3xl text-white"
            >
              Track your{" "}
              <span className="bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
                cargo
              </span>
            </motion.h1>
            <motion.p
              {...fade(0.18)}
              className="text-lead mb-8 max-w-2xl text-white/80"
            >
              {withDefinitionLead(
                "Enter your ExpressWay tracking ID for live status, predicted ETA, and milestone history across air and ocean lanes.",
              )}
            </motion.p>
            <motion.div {...fade(0.26)}>
              <Button
                asChild
                size="lg"
                rounded="none"
                className="shadow-accent-glow"
              >
                <a href="#track-lookup">
                  Look up a shipment
                  <ArrowDown className="size-4" aria-hidden />
                </a>
              </Button>
            </motion.div>
          </div>

          <motion.ul
            {...fade(0.2)}
            className="space-y-3 lg:col-span-5"
          >
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex items-start gap-3 border border-white/15 bg-white/5 p-4 backdrop-blur-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sky-400/40 text-[#00A3FF]">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
