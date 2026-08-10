import * as React from "react";
import { cn } from "@/lib/utils";

type SectionTone = "default" | "surface" | "brand" | "inverse" | "primary" | "muted";

const toneClass: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  surface: "bg-surface text-surface-foreground",
  brand: "bg-brand text-brand-foreground",
  inverse: "bg-inverse text-inverse-foreground",
  primary: "bg-primary text-primary-foreground",
  muted: "bg-muted text-foreground",
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical padding from design tokens */
  spacing?: "sm" | "md" | "lg";
  tone?: SectionTone;
  contained?: boolean;
  as?: "section" | "div" | "header" | "footer";
}

const spacingClass = {
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
} as const;

/**
 * Page section with design-system spacing + surface tones.
 * Change section rhythm globally via `--space-section*` in tokens.css.
 */
export function Section({
  className,
  spacing = "md",
  tone = "default",
  contained = true,
  as: Comp = "section",
  children,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn(spacingClass[spacing], toneClass[tone], className)}
      {...props}
    >
      {contained ? (
        <div className="container-page">{children}</div>
      ) : (
        children
      )}
    </Comp>
  );
}
