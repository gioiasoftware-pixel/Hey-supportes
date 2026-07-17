"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function aggiornaValiditaSconto(_prevState: { error?: string; ok?: boolean } | null, formData: FormData) {
  await requireAdmin();

  const giorni = Number(formData.get("giorni"));
  if (!giorni || giorni < 1) {
    return { error: "Inserisci un numero di giorni valido." };
  }

  const supabase = createAdminClient();
  await supabase
    .from("settings")
    .update({ value: String(giorni) })
    .eq("key", "sconto_validita_giorni");

  revalidatePath("/admin/impostazioni");
  return { ok: true };
}
