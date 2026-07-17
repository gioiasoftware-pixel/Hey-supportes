import { createClient } from "@/lib/supabase/server";

// Il proxy protegge la navigazione verso /admin/*, ma le server action sono
// endpoint POST raggiungibili direttamente: vanno riverificate qui.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Non autorizzato");
  }

  return user;
}
