import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { TypographyVariant } from "@/config/design-system";

const typographyVariants = cva("text-balance", {
  variants: {
    variant: {
      display: "text-display text-foreground",
      h1: "text-h1 text-foreground",
      h2: "text-h2 text-foreground",
      h3: "text-h3 text-foreground",
      h4: "text-h4 text-foreground",
      lead: "text-lead text-muted-foreground",
      body: "text-body text-foreground",
      muted: "text-muted-body text-muted-foreground",
      eyebrow: "text-eyebrow text-accent",
      stat: "text-stat text-foreground",
    } satisfies Record<TypographyVariant, string>,
  },
  defaultVariants: {
    variant: "body",
  },
});

type TypographyTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

const defaultTag: Partial<Record<TypographyVariant, TypographyTag>> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  body: "p",
  muted: "p",
  eyebrow: "p",
  stat: "p",
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyTag;
}

export function Typography({
  className,
  variant = "body",
  as,
  ...props
}: TypographyProps) {
  const Comp = as ?? defaultTag[variant ?? "body"] ?? "p";

  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}

export { typographyVariants };
