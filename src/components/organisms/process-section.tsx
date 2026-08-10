"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Typography } from "@/components/atoms/typography";
import { PROCESS_STEPS } from "@/constants/content";

export function ProcessSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="process" className="bg-surface py-section">
      <div className="container-page">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <Typography variant="eyebrow" className="mb-3">
            Our Process
          </Typography>
          <Typography variant="h2" className="text-slate-900">
            How We Move Your Cargo
          </Typography>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute top-1/2 left-0 z-0 hidden h-1 w-full -translate-y-1/2 bg-slate-200 md:block" />
          <div className="grid gap-8 md:grid-cols-5">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.45 }}
                  className="group relative z-10 flex flex-col items-center text-center"
                >
                  <div className="mb-6 flex size-20 items-center justify-center rounded-full border-4 border-slate-100 bg-white shadow-lg transition-all duration-300 group-hover:border-accent group-hover:bg-primary">
                    <Icon className="size-8 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <div className="relative h-full w-full border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="pointer-events-none absolute top-2 right-4 text-h2 text-slate-100">
                      0{index + 1}
                    </div>
                    <h3 className="text-h4 relative z-10 mb-3 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-body relative z-10 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
