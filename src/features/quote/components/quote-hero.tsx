"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Clock } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { HeroBackdrop } from "@/components/molecules/hero-backdrop";
import { QUOTE_RESPONSE_STATEMENT, withDefinitionLead } from "@/constants/entity";

export function QuoteHero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroBackdrop src="/images/hero-port.jpg" className="object-center" priority />
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40" />
      </div>

      <div className="container-page relative z-10 pt-28 pb-12 md:pt-44 md:pb-20">
        <div className="max-w-3xl">
          <motion.p
            {...fade(0)}
            className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent/90 uppercase"
          >
            Online Quote
          </motion.p>
          <motion.h1 {...fade(0.1)} className="text-h1 mb-4 text-white">
            Request a Freight Quote
          </motion.h1>
          <motion.p
            {...fade(0.2)}
            className="mb-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            {withDefinitionLead(
              "Share your origin, destination and cargo details. ExpressWay Logistic will evaluate the appropriate ocean, air, FCL, LCL or consolidation option and respond with available logistics solutions.",
            )}
          </motion.p>
          <motion.div
            {...fade(0.3)}
            className="mb-8 flex flex-wrap items-center gap-4 text-sm text-white/75"
          >
            <span className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-1.5">
              <Clock className="size-4 text-accent" aria-hidden />
              {QUOTE_RESPONSE_STATEMENT}
            </span>
            <span className="text-white/60">Commercial cargo only</span>
          </motion.div>
          <motion.div {...fade(0.35)}>
            <Button asChild rounded="none" className="h-11 px-6">
              <a href="#quote-form">
                Start your quote
                <ArrowDown className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
