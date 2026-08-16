import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { EXPERIENCE_STATEMENT } from "@/constants/entity";
import { SERVICE_COUNT } from "@/constants/services";

export function EntityFacts() {
  return (
    <section className="border-y border-border bg-background py-section-sm">
      <div className="container-page">
        <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          Company
        </p>
        <h2 className="text-h3 mb-6 text-foreground">
          {siteConfig.legalName}
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-border bg-card p-4">
            <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Entity type
            </dt>
            <dd className="mt-2 text-sm font-semibold text-foreground">
              Neutral NVOCC · Freight forwarder
            </dd>
          </div>
          <div className="border border-border bg-card p-4">
            <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Experience
            </dt>
            <dd className="mt-2 text-sm font-semibold text-foreground">
              {EXPERIENCE_STATEMENT}
            </dd>
          </div>
          <div className="border border-border bg-card p-4">
            <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Service lines
            </dt>
            <dd className="mt-2 text-sm font-semibold text-foreground">
              {SERVICE_COUNT} Logistics & EXIM Services
            </dd>
          </div>
          <div className="border border-border bg-card p-4">
            <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Coverage
            </dt>
            <dd className="mt-2 text-sm font-semibold text-foreground">
              PAN India → Worldwide
            </dd>
          </div>
          <div className="border border-border bg-card p-4">
            <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Headquarters
            </dt>
            <dd className="mt-2 flex items-start gap-2 text-sm font-semibold text-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              Noida, Uttar Pradesh, India
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:gap-8">
          <a
            href={siteConfig.contact.phoneHref}
            className="inline-flex items-center gap-2 font-medium text-foreground hover:text-accent"
          >
            <Phone className="size-4 text-accent" aria-hidden />
            {siteConfig.contact.phone}
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex items-center gap-2 font-medium text-foreground hover:text-accent"
          >
            <Mail className="size-4 text-accent" aria-hidden />
            {siteConfig.contact.email}
          </a>
          <p className="text-muted-foreground">{siteConfig.contact.address}</p>
        </div>
      </div>
    </section>
  );
}
