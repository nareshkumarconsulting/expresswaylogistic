import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { HERO_FEATURES, HERO_HIGHLIGHTS } from "@/constants/content";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-brand">
      <div className="relative min-h-[28rem] md:min-h-[38rem] lg:min-h-[42rem]">
        <div
          className="pointer-events-none absolute inset-y-0 -right-6 w-[70%] sm:w-[70%] md:right-0 md:w-[62%] lg:w-[58%]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-banner-750.webp"
            srcSet="/images/hero-banner-750.webp 750w, /images/hero-banner-1280.webp 1280w"
            sizes="(min-width: 768px) 62vw, 70vw"
            alt="Cargo operations for ExpressWay Logistic freight forwarding"
            width={1024}
            height={682}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-x-0 top-24 bottom-[-12%] w-full object-cover object-[80%_12%] saturate-[1.12] contrast-[1.06] brightness-[1.04] sm:top-28 sm:object-[72%_0%] md:top-32 [mask-image:linear-gradient(to_right,transparent_0%,black_28%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_28%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand from-0% via-brand via-[52%] to-transparent to-[78%] md:via-[36%] md:to-[58%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand to-transparent md:hidden"
          aria-hidden
        />

        <div className="container-page relative z-10 flex min-h-[28rem] items-center pt-24 pb-10 md:min-h-[38rem] md:pt-36 md:pb-16 lg:min-h-[42rem]">
          <div className="max-w-xl lg:max-w-[50rem]">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase sm:text-xs sm:tracking-[0.22em]">
              <span className="sm:hidden">Neutral Logistics • Ocean • Air • Customs</span>
              <span className="hidden sm:inline lg:whitespace-nowrap">
                Neutral Logistics Provider • Freight Forwarding • Ocean • Air • Customs
              </span>
            </p>
            <div className="mb-5 h-px w-16 bg-accent sm:mb-7 sm:w-24" aria-hidden />

            <h1 className="text-display mb-4 text-white md:mb-6 lg:text-[65px]">
              <span className="lg:whitespace-nowrap">PAN India Freight Forwarding</span>
              <span className="mt-1 block text-[#00A3FF]">
                &amp; Global Logistics
              </span>
            </h1>

            <p className="text-lead mb-7 max-w-lg text-white/85 md:mb-10">
              ExpressWay Logistic is a Neutral Logistics Provider connecting cargo
              from anywhere in India to worldwide destinations, with ocean freight,
              air freight, customs clearance and end-to-end logistics support.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                rounded="md"
                className="w-full shadow-accent-glow sm:w-auto"
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
                className="w-full border-sky-300/50 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
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
          <ul className="grid gap-4 py-5 sm:grid-cols-3 sm:gap-8 sm:py-7">
            {HERO_HIGHLIGHTS.map(({ title, description, icon: Icon }) => (
              <li
                key={title}
                className="flex items-start gap-3 border-white/10 sm:gap-4 sm:border-r sm:pr-8 last:sm:border-r-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-sky-400/30 bg-sky-400/10 text-sky-300 sm:size-11">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 hidden text-sm leading-relaxed text-white/65 sm:mt-1 sm:block">
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
          <ul className="grid grid-cols-2 gap-4 py-5 sm:gap-6 sm:py-6 lg:grid-cols-4 lg:gap-8 lg:py-7">
            {HERO_FEATURES.map(({ title, description, icon: Icon }) => (
              <li
                key={title}
                className="flex items-start gap-3 border-white/10 sm:gap-4 lg:border-r lg:pr-6 last:lg:border-r-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-secondary/15 text-secondary sm:size-10">
                  <Icon className="size-4 sm:size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white sm:text-sm">{title}</p>
                  <p className="mt-0.5 hidden text-xs leading-relaxed text-white/60 sm:mt-1 sm:block">
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
