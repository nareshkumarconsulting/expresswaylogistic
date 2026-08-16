"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/constants/content";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = [...scroller.children] as HTMLElement[];
    if (cards.length === 0) return;

    const stride =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth;
    if (stride <= 0) return;

    const visible = Math.max(
      1,
      Math.round(scroller.clientWidth / stride),
    );
    const pages = Math.max(1, cards.length - visible + 1);
    setPageCount(pages);

    const closest = cards.reduce((best, card, index) => {
      const dist = Math.abs(card.offsetLeft - scroller.scrollLeft);
      const bestDist = Math.abs(cards[best].offsetLeft - scroller.scrollLeft);
      return dist < bestDist ? index : best;
    }, 0);
    setPage(Math.min(closest, pages - 1));
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    measure();
    scroller.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(() => measure());
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const scrollToPage = (index: number) => {
    const scroller = scrollerRef.current;
    const card = scroller?.children[index] as HTMLElement | undefined;
    if (!scroller || !card) return;
    scroller.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-surface py-section"
    >
      <div className="container-page relative">
        <div className="mb-10 max-w-2xl lg:mb-12">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            Client Feedback
          </p>
          <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
          <h2 className="text-h2 text-slate-900">
            Trusted by Businesses{" "}
            <span className="text-primary">Worldwide</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            Exporters and importers who work with us as one NVOCC partner —
            from booking and clearance through door delivery.
          </p>
        </div>

        <ul
          ref={scrollerRef}
          className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Client testimonials"
        >
          {TESTIMONIALS.map((testimonial) => {
            const initials = testimonial.author
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2);

            return (
              <li
                key={testimonial.author}
                className="flex w-[min(100%,20rem)] shrink-0 snap-start sm:w-[22rem] lg:w-[calc((100%-1.5rem)/3)]"
              >
                <blockquote
                  className={cn(
                    "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6",
                    "transition-colors duration-300 hover:border-accent hover:bg-accent/[0.06]",
                    "hover:shadow-[0_0_0_1px_hsl(var(--accent)),0_12px_40px_-12px_hsl(var(--accent)/0.35)]",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <Quote
                    className="relative mb-4 size-8 rotate-180 text-[#00A3FF] transition-colors group-hover:text-accent"
                    aria-hidden
                  />
                  <p className="relative flex-1 text-sm leading-relaxed text-slate-700">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <footer className="relative mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-xs font-semibold text-primary">
                      {initials}
                    </span>
                    <cite className="min-w-0 not-italic">
                      <span className="block text-sm font-semibold text-slate-900">
                        {testimonial.author}
                      </span>
                      <span className="text-xs text-accent">
                        {testimonial.company}
                      </span>
                    </cite>
                  </footer>
                </blockquote>
              </li>
            );
          })}
        </ul>

        {pageCount > 1 ? (
          <div
            className="mt-6 flex justify-center gap-2"
            role="tablist"
            aria-label="Testimonial pages"
          >
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={page === index}
                aria-label={`Show testimonials page ${index + 1} of ${pageCount}`}
                onClick={() => scrollToPage(index)}
                className={cn(
                  "size-2.5 rounded-full border-2 transition-colors",
                  page === index
                    ? "border-accent bg-accent"
                    : "border-slate-300 bg-transparent hover:border-accent",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
