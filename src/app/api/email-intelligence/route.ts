import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listEmailIntelligence } from "@/services/email-intelligence-repository";
import { MOCK_EMAIL_INTELLIGENCE } from "@/services/logistics-data";
import type { EmailCategory, EmailIntelligenceStatus } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as EmailCategory | null;
  const status = searchParams.get("status") as EmailIntelligenceStatus | null;

  const persisted = await listEmailIntelligence({
    category: category ?? undefined,
    status: status ?? undefined,
  });

  let data = persisted ?? [...MOCK_EMAIL_INTELLIGENCE];

  if (category) {
    data = data.filter((item) => item.category === category);
  }
  if (status) {
    data = data.filter((item) => item.status === status);
  }

  data.sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
  );

  return NextResponse.json({ success: true, data });
}
