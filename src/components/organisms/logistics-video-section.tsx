import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { LogisticsVideoPlayer } from "@/components/organisms/logistics-video-player";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";
import { siteConfig } from "@/config/site";

export function LogisticsVideoSection() {
  return (
    <section
      aria-labelledby="home-video-heading"
      className="border-t border-white/10 bg-[#041526] text-white"
    >
      <div className="container-page pt-[var(--space-section)] pb-8 md:pb-10">
        <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          ExpressWay Logistic
        </p>
        <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
        <h2 id="home-video-heading" className="text-h2 max-w-3xl text-white">
          Freight quotes and shipment tracking
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
          <Link
            href="/track"
            className="font-semibold text-white underline-offset-4 hover:underline"
          >
            Track a shipment
          </Link>{" "}
          with your ExpressWay ID, or ask Ava to take a quote request, look up
          tracking, or book a meeting.
        </p>
      </div>

      <LogisticsVideoPlayer />

      <div className="container-page flex flex-col items-start gap-5 py-8 sm:flex-row sm:items-center sm:justify-between md:py-12">
        <p className="max-w-xl text-sm leading-relaxed text-white/75">
          Share origin, destination and cargo details. {QUOTE_RESPONSE_STATEMENT}
        </p>
        <Button
          asChild
          size="lg"
          rounded="md"
          className="w-full shadow-accent-glow sm:w-auto"
        >
          <Link href={siteConfig.cta.primary.href}>
            Request a Freight Quote
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
