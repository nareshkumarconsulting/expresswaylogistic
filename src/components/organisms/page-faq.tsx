import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/button";
import type { FaqItem } from "@/constants/faqs";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface PageFaqProps {
  items: readonly FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function PageFaq({
  items,
  eyebrow = "FAQ",
  title = "Frequently asked questions",
  description = "Straight answers on NVOCC freight, documents, lanes, quotes, and EXIM support.",
}: PageFaqProps) {
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-background py-section">
      <div className="container-page relative">
        <div className="mb-10 max-w-2xl lg:mb-12">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            {eyebrow}
          </p>
          <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
          <h2 className="text-h2 text-slate-900">{title}</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className={cn(
                "group overflow-hidden rounded-2xl border border-border bg-card px-5",
                "open:border-accent open:bg-accent/[0.04]",
              )}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3 pr-4 text-left">
                  <span className="mt-0.5 font-heading text-sm font-bold text-[#00A3FF]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.question}
                </span>
                <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

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
