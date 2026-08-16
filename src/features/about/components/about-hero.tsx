"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { ABOUT_HIGHLIGHTS, STATS } from "@/constants/content";

export function AboutHero() {
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
    <section className="relative isolate overflow-hidden bg-brand pt-36 pb-16 text-brand-foreground md:pt-40 md:pb-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/operations-center.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-brand/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/85 to-brand/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-brand/40" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(0 0% 100% / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container-page relative z-10">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.p
              {...fade(0.05)}
              className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent uppercase"
            >
              About {siteConfig.name}
            </motion.p>

            <motion.h1
              {...fade(0.1)}
              className="text-display mb-5 max-w-3xl text-white"
            >
              Neutral NVOCC.{" "}
              <span className="bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
                PAN India to worldwide.
              </span>
            </motion.h1>

            <motion.p
              {...fade(0.18)}
              className="text-lead mb-8 max-w-2xl text-white/80"
            >
              {siteConfig.legalName} — 39 years of international cargo
              experience, PAN India freight forwarding, and a Noida headquarters
              connecting Indian origins with worldwide destinations.
            </motion.p>

            <motion.div
              {...fade(0.26)}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                rounded="none"
                className="shadow-accent-glow"
              >
                <Link href={siteConfig.cta.primary.href}>
                  Get a Quote
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                rounded="none"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/appointment">Book an Appointment</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div {...fade(0.2)} className="relative lg:col-span-5">
            <div className="relative overflow-hidden border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:p-8">
              <p className="mb-6 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                At a glance
              </p>

              <dl className="mb-6 grid grid-cols-3 gap-3 border-b border-white/10 pb-6">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                      {stat.value}
                      {stat.suffix}
                    </dd>
                    <p className="mt-1 text-[11px] leading-tight text-white/55">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </dl>

              <ul className="space-y-3">
                {ABOUT_HIGHLIGHTS.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/85"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pointer-events-none absolute -right-8 -bottom-10 size-40 rounded-full bg-accent/20 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
