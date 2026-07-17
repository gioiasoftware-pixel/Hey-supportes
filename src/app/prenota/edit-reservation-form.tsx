"use client";

import { useActionState } from "react";
import { updateReservation } from "./actions";
import { ORARI_PRANZO, ORARI_CENA } from "@/lib/orari";

export function EditReservationForm({
  reservationId,
  data,
  orario,
  numeroPersone,
}: {
  reservationId: string;
  data: string;
  orario: string;
  numeroPersone: number;
}) {
  const [state, formAction, pending] = useActionState(updateReservation, null);
  const today = new Date().toISOString().split("T")[0];
  // il DB restituisce l'orario come "HH:MM:SS", le option usano "HH:MM"
  const orarioAttuale = orario.slice(0, 5);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <input type="hidden" name="reservation_id" value={reservationId} />

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Data
        <input
          type="date"
          name="data"
          min={today}
          defaultValue={data}
          required
          className="rounded-md border border-brand/20 px-3 py-2 text-base outline-none focus:border-brand"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Orario
        <select
          name="orario"
          required
          defaultValue={orarioAttuale}
          className="rounded-md border border-brand/20 bg-white px-3 py-2 text-base text-brand-foreground outline-none focus:border-brand"
        >
          <optgroup label="Pranzo">
            {ORARI_PRANZO.map((o) => (
              <option key={o} value={o} className="text-brand-foreground">
                {o}
              </option>
            ))}
          </optgroup>
          <optgroup label="Cena">
            {ORARI_CENA.map((o) => (
              <option key={o} value={o} className="text-brand-foreground">
                {o}
              </option>
            ))}
          </optgroup>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Numero persone
        <input
          type="number"
          name="numero_persone"
          min={1}
          defaultValue={numeroPersone}
          required
          className="rounded-md border border-brand/20 px-3 py-2 text-base outline-none focus:border-brand"
        />
      </label>

      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-brand px-4 py-2 font-semibold text-brand-foreground transition-opacity disabled:opacity-60"
      >
        {pending ? "Salvataggio..." : "Salva modifiche"}
      </button>
    </form>
  );
}
