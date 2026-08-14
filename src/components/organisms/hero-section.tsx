import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden md:items-center">
      <div className="absolute inset-0 z-0">
        {/* Static WebP + preload: skip /_next/image so LCP is not gated on the optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-port-750.webp"
          srcSet="/images/hero-port-750.webp 750w, /images/hero-port-1280.webp 1280w"
          sizes="100vw"
          alt="Global cargo port operations at dawn"
          width={750}
          height={750}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
      </div>

      <div className="container-page relative z-10 pt-32 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-display mb-6 text-white">
            Neutral NVOCC Logistics{" "}
            <span className="bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
              You Can Trust
            </span>
          </h1>

          <p className="text-lead mb-10 max-w-2xl text-white/85">
            {siteConfig.description}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              rounded="none"
              className="shadow-accent-glow"
            >
              <Link href={siteConfig.cta.primary.href}>
                {siteConfig.cta.primary.label}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              rounded="none"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={siteConfig.cta.secondary.href}>
                {siteConfig.cta.secondary.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
