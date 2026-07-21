import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReservationForm } from "./reservation-form";
import { EditReservationForm } from "./edit-reservation-form";

export const dynamic = "force-dynamic";

export default async function PrenotaPage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;
  if (!customerId) {
    redirect("/accedi");
  }

  const supabase = createAdminClient();
  const { data: prenotazioneAttiva } = await supabase
    .from("reservations")
    .select("id, data, orario, numero_persone, note")
    .eq("customer_id", customerId)
    .eq("stato", "confirmed")
    .maybeSingle();

  if (prenotazioneAttiva) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-2xl font-bold text-brand">Hai già una prenotazione attiva</h1>
        <p className="mt-2 text-sm text-brand/70">
          Non puoi crearne una nuova finché non vieni a cena a questa (o la modifichi qui sotto).
        </p>
        <EditReservationForm
          reservationId={prenotazioneAttiva.id}
          data={prenotazioneAttiva.data}
          orario={prenotazioneAttiva.orario}
          numeroPersone={prenotazioneAttiva.numero_persone}
          note={prenotazioneAttiva.note}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-brand">Prenota un tavolo</h1>
      <p className="mt-2 text-sm text-brand/70">
        Lo sconto attivo sul tuo account verrà applicato automaticamente al conto.
      </p>
      <ReservationForm />
    </div>
  );
}
