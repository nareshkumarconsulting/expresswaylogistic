"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "@/components/molecules/animated-counter";
import { STATS } from "@/constants/content";

export function StatisticsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand py-section text-brand-foreground">
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[15rem] font-bold text-white/5">
        GLOBAL LOGISTICS
      </div>
      <div className="container-page relative z-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 text-center sm:grid-cols-3">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex flex-col items-center justify-center"
            >
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                className="text-stat text-white"
              />
              <div className="text-eyebrow mt-4 text-sky-200">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
