import { AlertCircle, CheckCircle2, Info, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";

type AlertVariant = "info" | "success" | "error" | "offline";

interface StateAlertProps {
  variant?: AlertVariant;
  title: string;
  description?: string;
  details?: string[];
  onRetry?: () => void;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
  offline: WifiOff,
};

const styles: Record<AlertVariant, string> = {
  info: "border-secondary/30 bg-secondary/10 text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
  error: "border-destructive/30 bg-destructive/10 text-foreground",
  offline: "border-warning/30 bg-warning/10 text-foreground",
};

export function StateAlert({
  variant = "info",
  title,
  description,
  details,
  onRetry,
  className,
}: StateAlertProps) {
  const Icon = icons[variant];

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start",
        styles[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {details && details.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
