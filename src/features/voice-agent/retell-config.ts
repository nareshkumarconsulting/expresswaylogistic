export function isRetellWebEnabled() {
  return Boolean(
    process.env.RETELL_API_KEY?.trim() && process.env.RETELL_AGENT_ID?.trim(),
  );
}

export function getRetellWebConfig() {
  const apiKey = process.env.RETELL_API_KEY?.trim();
  const agentId = process.env.RETELL_AGENT_ID?.trim();
  if (!apiKey || !agentId) return null;
  return { apiKey, agentId };
}

export function getRetellToolSecret() {
  return process.env.RETELL_TOOL_SECRET?.trim() || "";
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

const hits = new Map<string, { count: number; resetAt: number }>();

export function isRetellRateLimited(
  ip: string,
  max = 20,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}
