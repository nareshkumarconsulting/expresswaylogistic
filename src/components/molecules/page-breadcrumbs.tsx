import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageBreadcrumbs({
  items,
  tone = "light",
}: {
  items: readonly { name: string; path: string }[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-sm",
          dark ? "text-white/60" : "text-muted-foreground",
        )}
      >
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              ) : null}
              {last ? (
                <span
                  className={cn(
                    "font-medium",
                    dark ? "text-white" : "text-foreground",
                  )}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={cn(
                    dark ? "hover:text-accent" : "hover:text-accent",
                  )}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
