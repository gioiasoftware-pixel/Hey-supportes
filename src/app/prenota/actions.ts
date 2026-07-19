"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ORARI_DISPONIBILI } from "@/lib/orari";
import { inviaEmailNuovaPrenotazione } from "@/lib/resend";

export async function createReservation(_prevState: { error?: string } | null, formData: FormData) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;
  if (!customerId) {
    redirect("/accedi");
  }

  const data = String(formData.get("data") || "");
  const orario = String(formData.get("orario") || "");
  const numeroPersone = Number(formData.get("numero_persone"));

  if (!data || !orario || !numeroPersone || numeroPersone < 1) {
    return { error: "Compila tutti i campi correttamente." };
  }

  if (!ORARI_DISPONIBILI.includes(orario)) {
    return { error: "Orario non valido. Pranzo 12:30-14:00, cena 19:30-22:00." };
  }

  const supabase = createAdminClient();

  const { data: prenotazioneAttiva } = await supabase
    .from("reservations")
    .select("id")
    .eq("customer_id", customerId)
    .eq("stato", "confirmed")
    .maybeSingle();

  if (prenotazioneAttiva) {
    return {
      error: "Hai già una prenotazione attiva. Devi prima venire a cena a quella o modificarla.",
    };
  }

  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("data", data)
    .maybeSingle();

  if (blocked) {
    return { error: "Questa data non è disponibile per le prenotazioni. Scegline un'altra." };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("nome, email, telefono, sconto_percentuale, sconto_scade_il")
    .eq("id", customerId)
    .single();

  const scontoValido =
    customer && (!customer.sconto_scade_il || new Date(customer.sconto_scade_il) > new Date());
  const scontoApplicato = scontoValido ? customer!.sconto_percentuale : 0;

  const { error } = await supabase.from("reservations").insert({
    customer_id: customerId,
    data,
    orario,
    numero_persone: numeroPersone,
    stato: "confirmed",
    sconto_applicato: scontoApplicato,
  });

  if (error) {
    return { error: "Errore durante la prenotazione. Riprova." };
  }

  if (customer) {
    await inviaEmailNuovaPrenotazione({
      clienteNome: customer.nome,
      clienteEmail: customer.email,
      clienteTelefono: customer.telefono,
      data,
      orario,
      numeroPersone,
      scontoApplicato,
    });
  }

  redirect("/account");
}

export async function updateReservation(_prevState: { error?: string } | null, formData: FormData) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;
  if (!customerId) {
    redirect("/accedi");
  }

  const reservationId = String(formData.get("reservation_id") || "");
  const data = String(formData.get("data") || "");
  const orario = String(formData.get("orario") || "");
  const numeroPersone = Number(formData.get("numero_persone"));

  if (!reservationId || !data || !orario || !numeroPersone || numeroPersone < 1) {
    return { error: "Compila tutti i campi correttamente." };
  }

  if (!ORARI_DISPONIBILI.includes(orario)) {
    return { error: "Orario non valido. Pranzo 12:30-14:00, cena 19:30-22:00." };
  }

  const supabase = createAdminClient();

  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("data", data)
    .maybeSingle();

  if (blocked) {
    return { error: "Questa data non è disponibile per le prenotazioni. Scegline un'altra." };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("sconto_percentuale, sconto_scade_il")
    .eq("id", customerId)
    .single();

  const scontoValido =
    customer && (!customer.sconto_scade_il || new Date(customer.sconto_scade_il) > new Date());
  const scontoApplicato = scontoValido ? customer!.sconto_percentuale : 0;

  // Filtro anche su customer_id e stato: un cliente può modificare solo una
  // propria prenotazione ancora aperta, non quella di qualcun altro né una già consumata.
  const { error } = await supabase
    .from("reservations")
    .update({ data, orario, numero_persone: numeroPersone, sconto_applicato: scontoApplicato })
    .eq("id", reservationId)
    .eq("customer_id", customerId)
    .eq("stato", "confirmed");

  if (error) {
    return { error: "Errore durante la modifica. Riprova." };
  }

  redirect("/account");
}
