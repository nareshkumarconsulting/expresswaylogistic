"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { MEETING_EXPECTATIONS } from "@/features/appointment/schemas";
import { siteConfig } from "@/config/site";

export function AppointmentJourney() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-border bg-brand py-section text-brand-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 15% 20%, hsl(32 100% 50% / 0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, hsl(199 100% 50% / 0.2), transparent 50%)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mb-14 max-w-2xl">
          <Typography variant="eyebrow" className="mb-3 text-accent">
            Meeting route
          </Typography>
          <Typography variant="h2" className="text-white">
            Three checkpoints. One clear plan.
          </Typography>
        </div>

        <div className="relative">
          <div
            className="absolute top-8 right-0 left-0 hidden h-px bg-white/15 md:block"
            aria-hidden
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {MEETING_EXPECTATIONS.map((item, index) => (
              <motion.li
                key={item.code}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="relative"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center bg-accent font-bold text-accent-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-white/45 uppercase">
                    {item.code}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-muted-body text-white/65">{item.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-16 flex flex-col gap-4 border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="font-semibold text-white">Noida HQ</p>
              <p className="mt-1 text-sm text-white/60">
                {siteConfig.contact.address}
              </p>
            </div>
          </div>
          <p className="text-sm text-white/55 sm:max-w-xs sm:text-right">
            Prefer a written brief first?{" "}
            <Link href="/quote" className="font-semibold text-accent hover:underline">
              Request a freight quote
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
