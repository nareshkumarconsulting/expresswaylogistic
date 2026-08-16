import type { ReactNode } from "react";

export function ArticlePanel({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <article className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      {title ? <h2 className="text-h3 text-slate-900">{title}</h2> : null}
      {children}
    </article>
  );
}
