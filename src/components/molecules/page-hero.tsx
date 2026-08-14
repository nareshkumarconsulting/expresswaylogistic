import { Typography } from "@/components/atoms/typography";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Shared dark brand band for marketing internal pages.
 * Keeps header contrast correct (white nav on brand navy).
 */
export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-brand pt-40 pb-16 text-brand-foreground md:pt-44 md:pb-20",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 70% 20%, hsl(32 100% 50% / 0.22), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(0 0% 100% / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="container-page relative z-10 max-w-3xl">
        <Typography variant="eyebrow" className="mb-3 text-accent">
          {eyebrow}
        </Typography>
        <Typography variant="h1" className="mb-4 text-white">
          {title}
        </Typography>
        {description ? (
          <Typography variant="lead" className="max-w-2xl text-white/75">
            {description}
          </Typography>
        ) : null}
      </div>
    </section>
  );
}
