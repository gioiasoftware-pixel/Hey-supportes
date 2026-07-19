"use client";

import { useActionState } from "react";
import { aggiornaEmailNotifiche } from "./actions";

export function NotificationEmailForm({ emailAttuale }: { emailAttuale: string }) {
  const [state, formAction, pending] = useActionState(aggiornaEmailNotifiche, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Email interna per nuove prenotazioni
        <input
          type="email"
          name="email"
          placeholder="es. sala@heyristorante.it"
          defaultValue={emailAttuale}
          className="w-72 rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
      >
        {pending ? "Salvataggio..." : "Salva"}
      </button>
      {state?.error && <p className="w-full text-sm font-medium text-red-600">{state.error}</p>}
      {state?.ok && <p className="w-full text-sm font-medium text-green-700">Impostazione salvata.</p>}
      <p className="w-full text-xs text-brand/50">
        Lasciala vuota per disattivare la notifica. Ogni volta che un cliente prenota, arriva un
        avviso a questo indirizzo.
      </p>
    </form>
  );
}
