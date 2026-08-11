import { NextResponse } from "next/server";
import {
  isSupabaseAuthConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      status: "ok",
      service: "expressway-logistic",
      supabase: isSupabaseConfigured() ? "configured" : "not_configured",
      auth: isSupabaseAuthConfigured() ? "supabase" : "demo",
      timestamp: new Date().toISOString(),
    },
  });
}
