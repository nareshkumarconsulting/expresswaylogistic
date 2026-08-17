"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Layers3 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { INDUSTRIES } from "@/constants/content";
import { industryId } from "@/features/industries/industry-id";

export function IndustriesHero() {
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
    <section className="relative isolate overflow-hidden bg-brand pt-36 pb-20 text-brand-foreground md:pt-40 md:pb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner-1280.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
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
              Industries We Serve
            </motion.p>
            <motion.h1
              {...fade(0.1)}
              className="text-display mb-5 max-w-3xl text-white"
            >
              Tailored supply chain{" "}
              <span className="bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
                solutions
              </span>
            </motion.h1>
            <motion.p
              {...fade(0.18)}
              className="text-lead mb-8 max-w-2xl text-white/80"
            >
              From garments and pharma to project machinery and bulk cargo — we
              move the cargo types Indian EXIM actually ships, with handling and
              paperwork matched to each commodity.
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
                  Get a customized quote
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <span className="inline-flex items-center gap-2 text-sm text-white/70">
                <Layers3 className="size-4 text-accent" aria-hidden />
                {INDUSTRIES.length} cargo specialisations, one Neutral Logistics Provider desk
              </span>
            </motion.div>
          </div>

          <motion.nav
            {...fade(0.2)}
            aria-label="Industries"
            className="relative lg:col-span-5"
          >
            <div className="border border-white/15 bg-white/5 p-5 backdrop-blur-sm md:p-6">
              <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                Jump to a cargo type
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((industry) => (
                  <li key={industry.name}>
                    <Link
                      href={`#${industryId(industry.name)}`}
                      className="block truncate rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/90 transition-colors hover:border-accent/60 hover:text-accent"
                    >
                      {industry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>
        </div>
      </div>
    </section>
  );
}
