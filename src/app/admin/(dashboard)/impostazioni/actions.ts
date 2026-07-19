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

export async function aggiornaEmailNotifiche(
  _prevState: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();

  const supabase = createAdminClient();
  await supabase
    .from("settings")
    .upsert({ key: "email_notifiche_prenotazioni", value: email }, { onConflict: "key" });

  revalidatePath("/admin/impostazioni");
  return { ok: true };
}

export async function aggiornaEmailBenvenuto(
  _prevState: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();

  const oggetto = String(formData.get("oggetto") || "").trim();
  const corpo = String(formData.get("corpo") || "").trim();
  if (!oggetto || !corpo) {
    return { error: "Oggetto e corpo non possono essere vuoti." };
  }

  const supabase = createAdminClient();
  await supabase
    .from("settings")
    .upsert(
      [
        { key: "email_benvenuto_oggetto", value: oggetto },
        { key: "email_benvenuto_corpo", value: corpo },
      ],
      { onConflict: "key" },
    );

  revalidatePath("/admin/impostazioni");
  return { ok: true };
}

export async function aggiornaEmailUpgrade(
  _prevState: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();

  const oggetto = String(formData.get("oggetto") || "").trim();
  const corpo = String(formData.get("corpo") || "").trim();
  if (!oggetto || !corpo) {
    return { error: "Oggetto e corpo non possono essere vuoti." };
  }

  const supabase = createAdminClient();
  await supabase
    .from("settings")
    .upsert(
      [
        { key: "email_upgrade_oggetto", value: oggetto },
        { key: "email_upgrade_corpo", value: corpo },
      ],
      { onConflict: "key" },
    );

  revalidatePath("/admin/impostazioni");
  return { ok: true };
}
