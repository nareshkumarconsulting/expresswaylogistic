import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { COVERAGE_STATEMENT } from "@/constants/entity";
import { REGIONS } from "@/constants/geography";

export function PanIndiaNetworkSection() {
  return (
    <section id="pan-india" className="bg-background py-section">
      <div className="container-page">
        <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          Coverage
        </p>
        <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
        <h2 className="text-h2 mb-4 text-slate-900">
          PAN India Logistics Network
        </h2>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate-600">
          {COVERAGE_STATEMENT} Headquarters are in Noida. Regional pages describe
          service geography, not a physical office in every city.
        </p>
        <ul className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((region) => (
            <li key={region.slug}>
              <Link
                href={`/pan-india-logistics/${region.slug}`}
                className="flex h-full items-start gap-3 border border-border bg-card p-4 hover:border-accent"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {region.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {region.hubs[0]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild rounded="md">
          <Link href="/pan-india-logistics">
            PAN India logistics
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
