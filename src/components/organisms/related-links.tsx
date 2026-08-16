import Link from "next/link";

type LinkItem = { href: string; label: string };

export function RelatedLinks({
  services = [],
  industries = [],
  routes = [],
  extra = [],
}: {
  services?: readonly LinkItem[];
  industries?: readonly LinkItem[];
  routes?: readonly LinkItem[];
  extra?: readonly { title: string; items: readonly LinkItem[] }[];
}) {
  const groups = [
    { title: "Related services", items: services },
    { title: "Related industries", items: industries },
    { title: "Related routes", items: routes },
    ...extra,
  ].filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section className="bg-surface py-section">
      <div className="container-page grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              {group.title}
            </h2>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-slate-800 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
