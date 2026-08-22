import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listEmailIntelligence } from "@/services/email-intelligence-repository";
import type { EmailCategory, EmailIntelligenceStatus } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as EmailCategory | null;
  const status = searchParams.get("status") as EmailIntelligenceStatus | null;

  const data = await listEmailIntelligence({
    category: category ?? undefined,
    status: status ?? undefined,
  });

  const filtered = (data ?? []).filter((item) => {
    if (category && item.category !== category) return false;
    if (status && item.status !== status) return false;
    return true;
  });

  filtered.sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
  );

  return NextResponse.json({ success: true, data: filtered });
}
