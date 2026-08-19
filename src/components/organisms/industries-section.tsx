import Link from "next/link";
import { ArrowRight, Globe2, MapPin, Ship } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { INDUSTRIES } from "@/constants/content";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function IndustriesSection() {
  return (
    <section
      id="industries"
      className="relative flex flex-col justify-center overflow-hidden bg-brand py-10 text-white md:py-10 lg:min-h-dvh lg:py-8"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-8 bottom-0 hidden h-[70%] w-[42%] lg:block"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-banner-1280.webp"
          alt=""
          className="size-full object-cover object-right opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-brand/50 to-brand" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/20 to-transparent" />
      </div>

      <div className="container-page relative flex min-h-0 flex-1 flex-col justify-center">
        <div className="mb-6 flex flex-col gap-4 lg:mb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              Industries We Serve
            </p>
            <div className="mb-3 h-px w-16 bg-accent" aria-hidden />
            <h2 className="text-h2">
              Industries We Serve
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              From garments and pharma to project machinery and bulk cargo — we
              move the cargo types Indian EXIM actually ships.{" "}
              <Link
                href="/industries"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                See all industries
              </Link>
            </p>
          </div>

          <div className="flex max-w-xs items-start gap-3 rounded-2xl border border-sky-400/25 bg-white/[0.04] px-4 py-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-sky-400/40 text-sky-300">
              <Globe2 className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Built for every industry
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">
                Same Neutral Logistics Provider desk, cargo-specific handling and paperwork.
              </p>
            </div>
          </div>
        </div>

        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            return (
              <li key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className={cn(
                    "group relative flex h-full items-center gap-3 overflow-hidden rounded-2xl border border-sky-400/20 bg-[#071e38]/80 px-4 py-3 backdrop-blur-sm",
                    "transition-colors duration-300 hover:border-accent/70 hover:bg-accent/[0.08]",
                  )}
                >
                  {industry.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={industry.image}
                      alt=""
                      className="pointer-events-none absolute inset-0 size-full object-cover opacity-30"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className="pointer-events-none absolute inset-0 bg-brand/45"
                    aria-hidden
                  />
                  <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-sky-400/40 text-sky-300 transition group-hover:border-accent group-hover:text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="relative min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {industry.name}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-white/65">
                      {industry.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-sky-400/20 bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-sky-400/40 text-sky-300">
              <Ship className="size-4" aria-hidden />
              <MapPin className="absolute -right-0.5 -bottom-0.5 size-3 text-accent" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Your industry. Our expertise.
              </p>
              <p className="text-xs text-white/60">
                Tell us the cargo type — we&apos;ll map the lane, docs, and
                delivery.
              </p>
            </div>
          </div>
          <Button asChild rounded="md" className="w-full shadow-accent-glow sm:w-auto">
            <Link href={siteConfig.cta.primary.href}>
              Get a customized quote
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
