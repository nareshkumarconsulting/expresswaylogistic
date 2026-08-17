import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { HERO_FEATURES, HERO_HIGHLIGHTS } from "@/constants/content";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-brand">
      <div className="relative min-h-[32rem] md:min-h-[38rem] lg:min-h-[42rem]">
        <div
          className="pointer-events-none absolute inset-y-0 -right-10 w-[78%] sm:w-[70%] md:right-0 md:w-[62%] lg:w-[58%]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-banner-750.webp"
            srcSet="/images/hero-banner-750.webp 750w, /images/hero-banner-1280.webp 1280w"
            sizes="(min-width: 768px) 62vw, 78vw"
            alt=""
            width={1024}
            height={682}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-x-0 top-32 bottom-[-18%] w-full object-cover object-[72%_0%] saturate-[1.12] contrast-[1.06] brightness-[1.04] sm:top-28 md:top-32 [mask-image:linear-gradient(to_right,transparent_0%,black_20%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand from-0% via-brand via-[36%] to-transparent to-[58%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand to-transparent md:hidden"
          aria-hidden
        />

        <div className="container-page relative z-10 flex min-h-[32rem] items-center pt-32 pb-12 md:min-h-[38rem] md:pt-36 md:pb-16 lg:min-h-[42rem]">
          <div className="max-w-xl lg:max-w-[34rem]">
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              Neutral Logistics Provider • Freight Forwarding • Ocean • Air • Customs
            </p>
            <div className="mb-7 h-px w-24 bg-accent" aria-hidden />

            <h1 className="text-display mb-6 text-white">
              PAN India Freight Forwarding
              <span className="mt-1 block text-[#00A3FF]">
                &amp; Global Logistics
              </span>
            </h1>

            <p className="text-lead mb-10 max-w-lg text-white/85">
              Connect your cargo from anywhere in India to worldwide destinations
              as a Neutral Logistics Provider, with ocean freight, air freight, customs clearance
              and end-to-end logistics support.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                rounded="md"
                className="shadow-accent-glow"
              >
                <Link href={siteConfig.cta.primary.href}>
                  {siteConfig.cta.primary.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                rounded="md"
                className="border-sky-300/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={siteConfig.cta.secondary.href}>
                  <Package className="size-4 text-sky-300" aria-hidden />
                  {siteConfig.cta.secondary.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-y border-white/10 bg-brand/70 backdrop-blur-sm">
        <div className="container-page">
          <ul className="grid gap-6 py-6 sm:grid-cols-3 sm:gap-8 sm:py-7">
            {HERO_HIGHLIGHTS.map(({ title, description, icon: Icon }) => (
              <li
                key={title}
                className="flex items-start gap-4 border-white/10 sm:border-r sm:pr-8 last:sm:border-r-0"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-sky-400/30 bg-sky-400/10 text-sky-300">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 bg-[#0a2744]">
        <div className="container-page">
          <ul className="grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-7">
            {HERO_FEATURES.map(({ title, description, icon: Icon }) => (
              <li
                key={title}
                className="flex items-start gap-4 border-white/10 lg:border-r lg:pr-6 last:lg:border-r-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-secondary/15 text-secondary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
