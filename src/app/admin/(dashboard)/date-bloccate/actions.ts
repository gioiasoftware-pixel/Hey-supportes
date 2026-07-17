"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function bloccaData(_prevState: { error?: string } | null, formData: FormData) {
  await requireAdmin();

  const data = String(formData.get("data") || "");
  const motivo = String(formData.get("motivo") || "").trim() || null;

  if (!data) {
    return { error: "Seleziona una data." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("blocked_dates").insert({ data, motivo });

  if (error) {
    return { error: "Questa data è già bloccata." };
  }

  revalidatePath("/admin/date-bloccate");
  return null;
}

export async function sbloccaData(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("blocked_dates").delete().eq("id", id);
  revalidatePath("/admin/date-bloccate");
}
