import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/** Returns true when the session belongs to an active Command Center staff user. */
export async function isStaffSession(
  supabase: SupabaseClient<Database>,
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return Boolean(profile);
}
