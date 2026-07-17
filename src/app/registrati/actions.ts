"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviaEmailBenvenuto } from "@/lib/resend";

export async function registerCustomer(_prevState: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const nome = String(formData.get("nome") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const marketingOptIn = formData.get("marketing_opt_in") === "on";
  const privacyAccepted = formData.get("privacy") === "on";
  const refCode = String(formData.get("ref") || "").trim() || null;

  if (!email || !nome || !telefono) {
    return { error: "Compila tutti i campi." };
  }
  if (!privacyAccepted) {
    return { error: "Devi accettare l'informativa privacy per registrarti." };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return { error: "Questa email è già registrata. Usa la pagina di accesso." };
  }

  let referredBy: string | null = null;
  if (refCode) {
    const { data: referrer } = await supabase
      .from("customers")
      .select("id")
      .eq("referral_code", refCode)
      .maybeSingle();
    referredBy = referrer?.id ?? null;
  }

  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "sconto_validita_giorni")
    .maybeSingle();
  const validitaGiorni = Number(setting?.value ?? 30);
  const scadenza = new Date();
  scadenza.setDate(scadenza.getDate() + validitaGiorni);

  const { data: customer, error } = await supabase
    .from("customers")
    .insert({
      email,
      nome,
      telefono,
      referred_by: referredBy,
      sconto_percentuale: 10,
      sconto_scade_il: scadenza.toISOString(),
      marketing_opt_in: marketingOptIn,
    })
    .select("id, referral_code")
    .single();

  if (error || !customer) {
    return { error: "Errore durante la registrazione. Riprova." };
  }

  if (referredBy) {
    await supabase.from("referrals").insert({
      referrer_id: referredBy,
      referred_id: customer.id,
      stato: "pending",
    });
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  await inviaEmailBenvenuto({
    to: email,
    nome,
    referralUrl: `${protocol}://${host}/registrati?ref=${customer.referral_code}`,
  });

  const cookieStore = await cookies();
  cookieStore.set("customer_id", customer.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  redirect("/account");
}
