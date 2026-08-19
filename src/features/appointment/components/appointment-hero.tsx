"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/atoms/button";

export function AppointmentHero() {
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
        <Image
          src="/images/operations-center.jpg"
          alt="ExpressWay logistics operations floor"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100% / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-page relative z-10 pt-28 pb-16 md:pt-44 md:pb-24">
        <div className="max-w-2xl">
          <motion.p
            {...fade(0)}
            className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent/90 uppercase"
          >
            Book a consultation
          </motion.p>
          <motion.h1 {...fade(0.1)} className="text-h1 mb-4 text-white">
            Meet our logistics specialists
          </motion.h1>
          <motion.p
            {...fade(0.2)}
            className="mb-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
          >
            Book freight planning, customs advisory, a warehouse visit, or
            account setup — weekday slots in IST.
          </motion.p>
          <motion.div {...fade(0.3)}>
            <Button asChild rounded="none" className="h-11 px-6">
              <a href="#book">
                Start booking
                <ArrowDown className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
