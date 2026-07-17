"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviaEmailUpgradeSconto } from "@/lib/resend";

async function scontoValidoDaSettings(supabase: ReturnType<typeof createAdminClient>) {
  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "sconto_validita_giorni")
    .maybeSingle();
  const validitaGiorni = Number(setting?.value ?? 30);
  const scadenza = new Date();
  scadenza.setDate(scadenza.getDate() + validitaGiorni);
  return scadenza.toISOString();
}

export async function confermaPresenza(reservationId: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const importoConto = Number(formData.get("importo_conto"));
  if (!importoConto || importoConto <= 0) return;

  const { data: reservation } = await supabase
    .from("reservations")
    .select("customer_id")
    .eq("id", reservationId)
    .single();
  if (!reservation) return;

  await supabase
    .from("reservations")
    .update({ stato: "completed", importo_conto: importoConto })
    .eq("id", reservationId);

  const nuovaScadenza = await scontoValidoDaSettings(supabase);

  // Cena scontata consumata: nuovo ciclo, il cliente torna al 10%.
  await supabase
    .from("customers")
    .update({ sconto_percentuale: 10, sconto_scade_il: nuovaScadenza })
    .eq("id", reservation.customer_id);

  // Se questo cliente era stato invitato, il referral è andato a buon fine:
  // upgrade del referrer al 15%.
  const { data: referral } = await supabase
    .from("referrals")
    .select("id, referrer_id, stato")
    .eq("referred_id", reservation.customer_id)
    .maybeSingle();

  if (referral && referral.stato === "pending") {
    await supabase
      .from("referrals")
      .update({ stato: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", referral.id);

    await supabase
      .from("customers")
      .update({ sconto_percentuale: 15, sconto_scade_il: nuovaScadenza })
      .eq("id", referral.referrer_id);

    // Retroattivo: eventuali prenotazioni del referrer già fatte ma non
    // ancora completate passano anche loro al 15%.
    await supabase
      .from("reservations")
      .update({ sconto_applicato: 15 })
      .eq("customer_id", referral.referrer_id)
      .eq("stato", "confirmed");

    const { data: referrer } = await supabase
      .from("customers")
      .select("nome, email")
      .eq("id", referral.referrer_id)
      .single();

    if (referrer) {
      await inviaEmailUpgradeSconto({ to: referrer.email, nome: referrer.nome });
    }
  }

  revalidatePath("/admin/prenotazioni");
}

export async function segnaNoShow(reservationId: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: reservation } = await supabase
    .from("reservations")
    .select("customer_id")
    .eq("id", reservationId)
    .single();
  if (!reservation) return;

  await supabase.from("reservations").update({ stato: "no_show" }).eq("id", reservationId);
  await supabase
    .from("customers")
    .update({ sconto_percentuale: 0, sconto_scade_il: null })
    .eq("id", reservation.customer_id);

  revalidatePath("/admin/prenotazioni");
}
