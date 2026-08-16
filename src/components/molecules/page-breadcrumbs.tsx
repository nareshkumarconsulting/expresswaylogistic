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
    <nav
      aria-label="Breadcrumb"
      className={cn(!dark && "border-b border-border/70 bg-background")}
    >
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-none",
          dark
            ? "text-white/60"
            : "container-page py-3.5 text-muted-foreground md:py-4",
        )}
      >
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li
              key={`${item.path}-${item.name}`}
              className="flex items-center gap-2"
            >
              {index > 0 ? (
                <ChevronRight
                  className="size-3.5 shrink-0 opacity-70"
                  aria-hidden
                />
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
                  className="transition-colors hover:text-accent"
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
