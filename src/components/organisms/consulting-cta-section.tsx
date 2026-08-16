import Link from "next/link";
import { ArrowRight, Headphones, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const lanes = [
  "India → Dubai",
  "India → Rotterdam",
  "India → Singapore",
  "India → Hamburg",
  "Nhava Sheva → New York",
  "Mundra → Jeddah",
];

export function ConsultingCtaSection() {
  return (
    <section
      id="consulting"
      aria-labelledby="consulting-heading"
      className="relative bg-surface px-3 py-section-sm sm:px-6"
    >
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-2xl bg-[#041526] text-white shadow-[0_30px_80px_-24px_rgba(5,26,48,0.65)] sm:rounded-[2rem]">
        <div
          className="pointer-events-none absolute -top-24 -right-16 hidden size-[28rem] rounded-full bg-accent/20 blur-3xl lg:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/3 right-[18%] hidden size-64 rounded-full bg-sky-400/15 blur-3xl lg:block"
          aria-hidden
        />
        <p
          className="pointer-events-none absolute top-4 right-4 hidden select-none font-display text-[7.5rem] leading-none font-bold tracking-tight text-white/[0.04] lg:block"
          aria-hidden
        >
          CONSULT
        </p>

        <div className="relative grid min-w-0 lg:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.15fr)]">
          <div className="relative order-1 min-w-0 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/consulting-portrait.jpg"
              alt="ExpressWay Logistic EXIM consultant"
              width={1195}
              height={1400}
              className="h-80 w-full object-cover object-[50%_28%]"
            />
            <div className="absolute bottom-3 left-3 z-10 rounded-xl border border-white/15 bg-[#041526]/80 px-3 py-2 backdrop-blur-md">
              <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
                <span className="size-2 animate-[consult-pulse_2.4s_ease-in-out_infinite] rounded-full bg-accent" />
                Live advisory
              </p>
              <p className="mt-1 text-xs font-medium text-white">
                39 years in global cargo
              </p>
            </div>
          </div>

          <div className="relative order-1 hidden min-h-[34rem] overflow-hidden lg:order-1 lg:block">
            <div
              className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-br from-accent via-orange-500 to-amber-300"
              aria-hidden
              style={{ clipPath: "polygon(0 0, 86% 0, 100% 100%, 0 100%)" }}
            />
            <div
              className="absolute top-10 left-8 size-52 rounded-full border border-white/15"
              aria-hidden
            />
            <div
              className="absolute top-10 left-8 size-52 animate-[consult-orbit_28s_linear_infinite] rounded-full border border-dashed border-white/25"
              aria-hidden
            />
            <span
              className="absolute top-[4.75rem] left-[10.25rem] size-3 rounded-full bg-white shadow-[0_0_18px_white]"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/consulting-portrait-cutout.png"
              alt="ExpressWay Logistic EXIM consultant"
              width={876}
              height={1024}
              className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[92%] w-[86%] object-contain object-bottom drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
            />
            <div className="absolute bottom-6 left-6 z-20 rounded-2xl border border-white/15 bg-[#041526]/80 px-4 py-3 backdrop-blur-md">
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                <span className="size-2 animate-[consult-pulse_2.4s_ease-in-out_infinite] rounded-full bg-accent" />
                Live advisory
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                39 years in global cargo
              </p>
            </div>
          </div>

          <div className="relative order-2 min-w-0 px-5 py-8 sm:px-10 sm:py-10 lg:order-2 lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-16">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
              <Sparkles className="size-3.5" aria-hidden />
              EXIM Consulting
            </p>
            <h2
              id="consulting-heading"
              className="max-w-xl text-[clamp(1.85rem,7vw,3.4rem)] font-bold leading-[0.95] tracking-tight"
            >
              Start a
              <span className="block bg-gradient-to-r from-white via-sky-200 to-accent bg-clip-text text-transparent">
                Discussion
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-pretty text-white/75 sm:text-base">
              Tell us the lane, the licence, or the customs snag. We&apos;ll
              sketch a route that hits your timeline and your price—not a
              generic brochure answer.
            </p>

            <div className="mt-6 overflow-hidden rounded-full border border-white/10 bg-white/5 py-2 sm:mt-7">
              <div className="animate-marquee flex w-max gap-8 px-4 text-xs font-semibold tracking-wide text-white/70 uppercase">
                {[...lanes, ...lanes].map((lane, index) => (
                  <span key={`${lane}-${index}`} className="flex items-center gap-8">
                    {lane}
                    <span className="size-1 rounded-full bg-accent" />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex min-w-0 flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Link
                href="/appointment"
                className={cn(
                  buttonVariants({ size: "lg", rounded: "full" }),
                  "w-full shrink-0 text-white sm:w-auto",
                )}
              >
                Get Started
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={siteConfig.contact.phoneHref}
                className="inline-flex items-center gap-3 text-sm text-white/80 transition hover:text-white"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-accent/60 text-accent">
                  <Headphones className="size-4" aria-hidden />
                </span>
                Contact a local office
              </Link>
            </div>
          </div>
        </div>

        <svg
          className="pointer-events-none absolute right-0 bottom-0 hidden h-28 w-[55%] text-white/40 lg:block"
          viewBox="0 0 640 120"
          fill="none"
          aria-hidden
        >
          <path
            d="M20 88 C 140 20, 260 20, 380 72 S 560 110, 620 48"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="8 10"
            className="animate-[consult-dash_8s_linear_infinite]"
          />
        </svg>
      </div>
    </section>
  );
}
