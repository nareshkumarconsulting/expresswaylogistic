"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Typography } from "@/components/atoms/typography";
import { BOOKING_FAQS } from "@/features/appointment/schemas";

export function AppointmentFaqs() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-border bg-surface py-section">
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="container-page relative z-10 max-w-3xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <Typography variant="eyebrow" className="mb-3">
            Before you book
          </Typography>
          <Typography variant="h2" className="text-foreground">
            Straight answers from ops
          </Typography>
        </motion.div>
        <Accordion type="single" collapsible className="w-full">
          {BOOKING_FAQS.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
