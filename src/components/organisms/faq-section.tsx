"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Typography } from "@/components/atoms/typography";
import { FAQ_ITEMS } from "@/constants/content";

export function FaqSection() {
  return (
    <section id="faq" className="bg-surface py-section">
      <div className="container-page max-w-3xl">
        <div className="mb-12 text-center">
          <Typography variant="eyebrow" className="mb-3">
            FAQ
          </Typography>
          <Typography variant="h2" className="text-slate-900">
            Frequently Asked Questions
          </Typography>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
