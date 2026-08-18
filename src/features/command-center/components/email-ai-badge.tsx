import { Sparkles } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { cn } from "@/lib/utils";

type EmailAiBadgeVariant =
  | "accent"
  | "warning"
  | "secondary"
  | "muted"
  | "default";

type EmailAiBadgeProps = {
  children: React.ReactNode;
  variant?: EmailAiBadgeVariant;
  className?: string;
};

export function EmailAiBadge({
  children,
  variant = "accent",
  className,
}: EmailAiBadgeProps) {
  return (
    <Badge variant={variant} className={cn("gap-1", className)}>
      <Sparkles className="size-3 shrink-0" aria-hidden />
      {children}
    </Badge>
  );
}

export function emailQuoteActionLabel(action?: string): string | null {
  switch (action) {
    case "created_draft":
      return "Quote draft created";
    case "needs_info":
      return "Quote needs info";
    case "attached":
      return "Linked quote";
    default:
      return null;
  }
}

export function emailQuoteActionVariant(
  action?: string,
): EmailAiBadgeVariant {
  switch (action) {
    case "needs_info":
      return "warning";
    case "created_draft":
      return "accent";
    case "attached":
      return "secondary";
    default:
      return "muted";
  }
}
