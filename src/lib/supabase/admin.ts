import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Service role client: bypassa RLS, usare SOLO in server actions/route handler
// dell'area admin, mai esporre al client. Non tipizzato con Database: vedi
// nota in lib/supabase/client.ts.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
