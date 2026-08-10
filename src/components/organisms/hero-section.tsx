"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden md:items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-port.jpg"
          alt="Global cargo port operations at dawn"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
      </div>

      <div className="container-page relative z-10 pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.h1 {...fade(0)} className="text-display mb-6 text-white">
            Neutral NVOCC Logistics{" "}
            <span className="bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
              You Can Trust
            </span>
          </motion.h1>

          <motion.p
            {...fade(0.15)}
            className="text-lead mb-10 max-w-2xl text-white/85"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            {...fade(0.3)}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              rounded="none"
              className="shadow-accent-glow"
            >
              <Link href={siteConfig.cta.primary.href}>
                {siteConfig.cta.primary.label}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              rounded="none"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={siteConfig.cta.secondary.href}>
                {siteConfig.cta.secondary.label}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
