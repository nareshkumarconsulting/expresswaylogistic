import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { PageBreadcrumbs } from "@/components/molecules/page-breadcrumbs";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Cta = { href: string; label: string };

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  image = "/images/hero-port.jpg",
  imagePosition = "object-[72%_center]",
  primaryCta = { href: siteConfig.cta.primary.href, label: "Get a Quote" },
  secondaryCta,
  note,
  backHref,
  backLabel,
  breadcrumbs,
  panel,
  className,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  imagePosition?: string;
  primaryCta?: Cta | null;
  secondaryCta?: Cta;
  note?: ReactNode;
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: readonly { name: string; path: string }[];
  panel?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-brand pt-36 pb-20 text-brand-foreground md:pt-40 md:pb-24",
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn("object-cover", imagePosition)}
        />
        <div className="absolute inset-0 bg-brand/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/88 to-brand/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-brand/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,163,255,0.28),transparent_50%)]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container-page relative z-10">
        {breadcrumbs ? (
          <div className="mb-8">
            <PageBreadcrumbs items={breadcrumbs} tone="dark" />
          </div>
        ) : null}

        {backHref ? (
          <Link
            href={backHref}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {backLabel ?? "Back"}
          </Link>
        ) : null}

        <div
          className={cn(
            "grid items-end gap-10",
            panel ? "lg:grid-cols-12 lg:gap-12" : "",
          )}
        >
          <div className={panel ? "lg:col-span-7" : "max-w-3xl"}>
            <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              {eyebrow}
            </p>
            <h1 className="text-display mb-5 max-w-3xl text-white">
              {title}
              {accent ? (
                <>
                  {" "}
                  <span className="bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
                    {accent}
                  </span>
                </>
              ) : null}
            </h1>
            {description ? (
              <p className="text-lead mb-8 max-w-2xl text-white/80">
                {description}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {primaryCta ? (
                <Button
                  asChild
                  size="lg"
                  rounded="none"
                  className="shadow-accent-glow"
                >
                  <Link href={primaryCta.href}>
                    {primaryCta.label}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  rounded="none"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
              {note ? (
                <span className="inline-flex items-center gap-2 text-sm text-white/70">
                  {note}
                </span>
              ) : null}
            </div>
          </div>

          {panel ? (
            <div className="relative lg:col-span-5">{panel}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
