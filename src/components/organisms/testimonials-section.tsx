"use client";

import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Quote } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { TESTIMONIALS } from "@/constants/content";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="border-b border-border bg-background py-section">
      <div className="container-page">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Typography variant="eyebrow" className="mb-3">
            Client Feedback
          </Typography>
          <Typography variant="h2" className="text-slate-900">
            Trusted by Businesses Worldwide
          </Typography>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="min-w-0 flex-[0_0_100%]"
                >
                  <blockquote className="relative border border-slate-100 bg-slate-50 p-10 text-center md:p-16">
                    <Quote
                      className="absolute top-8 left-8 size-16 rotate-180 text-slate-200"
                      aria-hidden
                    />
                    <p className="relative z-10 mb-8 text-xl leading-relaxed font-medium text-slate-700 italic md:text-2xl">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <footer>
                      <cite className="not-italic">
                        <span className="block text-lg font-bold text-slate-900">
                          {testimonial.author}
                        </span>
                        <span className="text-sm font-medium text-accent">
                          {testimonial.company}
                        </span>
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {TESTIMONIALS.map((t, index) => (
              <button
                key={t.author}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className="size-3 rounded-full bg-slate-300 transition-colors hover:bg-accent focus:bg-accent"
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
