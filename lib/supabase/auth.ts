import { type SupabaseClient } from "@supabase/supabase-js";
import { type User } from "@supabase/supabase-js";

type SupabaseDB = SupabaseClient<any, "public", any>;

export type AuthResult =
  | { ok: true; user: User; role: string | null }
  | { ok: false; status: number; error: string };

async function resolveRole(
  supabase: SupabaseDB,
  userId: string,
): Promise<{ role: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) return { role: null, error: error.message };
  return { role: data?.role ?? null, error: null };
}

export async function requireAuth(
  supabase: SupabaseDB,
): Promise<AuthResult> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { ok: false, status: 401, error: "Authentication required" };
  }
  return { ok: true, user, role: null };
}

export async function requireCR(
  supabase: SupabaseDB,
): Promise<AuthResult> {
  const auth = await requireAuth(supabase);
  if (!auth.ok) return auth;

  const { role, error } = await resolveRole(supabase, auth.user.id);
  if (error) {
    return { ok: false, status: 500, error: "Failed to verify role" };
  }
  if (role !== "cr" && role !== "admin") {
    return { ok: false, status: 403, error: "CR or Admin role required" };
  }

  return { ...auth, role };
}

export async function requireAdmin(
  supabase: SupabaseDB,
): Promise<AuthResult> {
  const auth = await requireAuth(supabase);
  if (!auth.ok) return auth;

  const { role, error } = await resolveRole(supabase, auth.user.id);
  if (error) {
    return { ok: false, status: 500, error: "Failed to verify role" };
  }
  if (role !== "admin") {
    return { ok: false, status: 403, error: "Admin role required" };
  }

  return { ...auth, role };
}
