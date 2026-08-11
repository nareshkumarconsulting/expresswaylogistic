import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  getPublicSupabaseUrl,
  getSupabaseServiceRoleKey,
  isSupabaseAuthConfigured,
} from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

export { isStaffSession } from "@/lib/supabase/staff";

/** Server-side Supabase Auth client for Command Center cookie sessions. */
export async function createSupabaseServerAuthClient(): Promise<
  SupabaseClient<Database>
> {
  if (!isSupabaseAuthConfigured()) {
    throw new Error("Supabase Auth is not configured");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    getPublicSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component — cookie writes happen in route handlers / middleware.
          }
        },
      },
    },
  );
}
