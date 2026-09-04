function asGraphItem(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};
  const { ["@context"]: _context, ...rest } = data as Record<string, unknown>;
  return rest;
}

export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const payload = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data.map(asGraphItem),
      }
    : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
