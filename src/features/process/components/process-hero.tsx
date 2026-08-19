"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock3 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { PROCESS_STEPS } from "@/constants/content";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";
import { processStepId } from "@/features/process/step-id";
import { cn } from "@/lib/utils";

export function ProcessHero() {
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
    <section className="relative isolate overflow-hidden bg-brand pt-28 pb-14 text-brand-foreground md:pt-40 md:pb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-port.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
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
              Our Process
            </motion.p>
            <motion.h1
              {...fade(0.1)}
              className="text-display mb-5 max-w-3xl text-white"
            >
              How we move{" "}
              <span className="bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
                your cargo
              </span>
            </motion.h1>
            <motion.p
              {...fade(0.18)}
              className="text-lead mb-8 max-w-2xl text-white/80"
            >
              Five steps from quote to door — booking, documents, clearance, and
              updates handled by one Neutral Logistics Provider desk.
            </motion.p>
            <motion.div
              {...fade(0.26)}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                rounded="none"
                className="shadow-accent-glow"
              >
                <Link href={siteConfig.cta.primary.href}>
                  Request a Quote
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <span className="inline-flex items-center gap-2 text-sm text-white/70">
                <Clock3 className="size-4 text-accent" aria-hidden />
                {QUOTE_RESPONSE_STATEMENT}
              </span>
            </motion.div>
          </div>

          <motion.nav
            {...fade(0.2)}
            aria-label="Process steps"
            className="relative lg:col-span-5"
          >
            <ol className="overflow-hidden border border-white/15 bg-white/5 p-5 backdrop-blur-sm md:p-6">
              {PROCESS_STEPS.map((step, index) => {
                const isLast = index === PROCESS_STEPS.length - 1;
                return (
                  <li key={step.title} className="relative">
                    {index > 0 ? (
                      <span
                        aria-hidden
                        className="absolute top-0 left-[0.95rem] h-3 w-px bg-sky-400/35"
                      />
                    ) : null}
                    <Link
                      href={`#${processStepId(step.title)}`}
                      className="group flex items-center gap-3 py-2.5"
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                          isLast
                            ? "bg-accent text-accent-foreground"
                            : "bg-[#00A3FF] text-white",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold text-white transition-colors group-hover:text-accent">
                        {step.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </motion.nav>
        </div>
      </div>
    </section>
  );
}
