import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import type { FaqItem } from "@/constants/faqs";
import { siteConfig } from "@/config/site";

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
  description = "Straight answers on Neutral Logistics Provider freight, documents, lanes, quotes, and EXIM support.",
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

        <div className="mx-auto max-w-3xl space-y-4">
          {items.map((item, index) => (
            <article
              key={item.question}
              className="rounded-2xl border border-border bg-card px-5 py-5 md:px-6"
            >
              <h3 className="flex items-start gap-3 text-sm font-semibold text-slate-900 md:text-base">
                <span className="mt-0.5 font-heading text-sm font-bold text-[#00A3FF]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.question}</span>
              </h3>
              <p className="mt-3 pl-8 text-sm leading-relaxed text-slate-600 md:text-base">
                {item.answer}
              </p>
            </article>
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
