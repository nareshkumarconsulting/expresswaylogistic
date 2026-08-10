"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Typography } from "@/components/atoms/typography";
import { TRUST_SIGNALS } from "@/constants/content";

export function WhyChooseUsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-primary py-section text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v26h-2V34h-2v26h-2V34h-2v26h-2V34H20v26h-2V34h-2v26h-2V34h-2v26h-2V34H10V8h2v26h2V8h2v26h2V8h2v26h2V8h2v26h2V8H36v26z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="container-page relative z-10">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Typography variant="eyebrow" className="mb-3">
            Why Choose ExpressWay Logistic
          </Typography>
          <Typography variant="h2" className="text-white">
            The Logistics Advantage
          </Typography>
        </div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 gap-1 md:grid-cols-3"
        >
          {TRUST_SIGNALS.map((signal) => {
            const Icon = signal.icon;
            return (
              <motion.div
                key={signal.title}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 },
                }}
                className="group flex flex-col items-center justify-center bg-slate-800/50 p-8 text-center backdrop-blur-sm transition-colors hover:bg-primary/40"
              >
                <Icon className="mb-4 size-12 text-accent transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-slate-100">
                  {signal.title}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
