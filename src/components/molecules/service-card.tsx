import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  className?: string;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  className,
}: ServiceCardProps) {
  const content = (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100" />
      <div className="mb-4 flex size-12 items-center justify-center rounded-sm border border-sky-400/30 bg-sky-400/10 transition-colors group-hover:border-accent/40 group-hover:bg-accent/10">
        <Icon className="size-6 text-primary transition-colors group-hover:text-accent" />
      </div>
      <Typography as="h3" variant="h4" className="mb-2 text-foreground">
        {title}
      </Typography>
      <Typography variant="muted" className="text-base text-muted-foreground">
        {description}
      </Typography>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
