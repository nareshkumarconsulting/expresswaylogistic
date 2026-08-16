import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";

export function QuoteCtaBand({
  title = "Request a Freight Quote",
  description = "Share origin, destination and cargo details. ExpressWay Logistic will evaluate the appropriate ocean, air, FCL, LCL or consolidation option and respond with available logistics solutions.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-surface px-3 py-section-sm sm:px-6">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-2xl bg-[#041526] px-6 py-10 text-white shadow-[0_30px_80px_-24px_rgba(5,26,48,0.65)] sm:rounded-[2rem] sm:px-10 sm:py-14">
        <div
          className="pointer-events-none absolute -top-24 -right-16 size-[28rem] rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Next step
            </p>
            <h2 className="text-h2 mb-3 text-white">{title}</h2>
            <p className="text-sm leading-relaxed text-white/75">{description}</p>
          </div>
          <Button asChild rounded="none" className="shadow-accent-glow">
            <Link href={siteConfig.cta.primary.href}>
              Get a Quote
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
