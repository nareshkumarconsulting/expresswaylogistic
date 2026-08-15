"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/atoms/button";
import { FAQ_ITEMS } from "@/constants/content";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden bg-background py-section">
      <div className="container-page relative">
        <div className="mb-10 max-w-2xl lg:mb-12">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            FAQ
          </p>
          <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
          <h2 className="text-h2 text-slate-900">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            Straight answers on NVOCC freight, cargo types, tracking, quotes,
            and EXIM support.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="mx-auto max-w-3xl space-y-3"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className={cn(
                "overflow-hidden rounded-2xl border border-border bg-card px-5 last:border-b",
                "data-[state=open]:border-accent data-[state=open]:bg-accent/[0.04]",
              )}
            >
              <AccordionTrigger className="py-5 text-sm text-slate-900 hover:no-underline hover:text-accent">
                <span className="flex items-start gap-3 pr-4 text-left">
                  <span className="mt-0.5 font-heading text-sm font-bold text-[#00A3FF]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Still have a question?
            </p>
            <p className="text-xs text-slate-500">
              Share origin, destination, and cargo — we&apos;ll come back with
              options.
            </p>
          </div>
          <Button asChild rounded="md" className="shadow-accent-glow">
            <Link href={siteConfig.cta.primary.href}>
              Request a Quote
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
