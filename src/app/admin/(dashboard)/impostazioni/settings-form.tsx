"use client";

import { useActionState } from "react";
import { aggiornaValiditaSconto } from "./actions";

export function SettingsForm({ validitaAttuale }: { validitaAttuale: number }) {
  const [state, formAction, pending] = useActionState(aggiornaValiditaSconto, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Validità sconto (giorni)
        <input
          type="number"
          name="giorni"
          min={1}
          defaultValue={validitaAttuale}
          required
          className="w-32 rounded-md border border-brand/20 px-3 py-2 text-sm outline-none focus:border-brand"
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
    </form>
  );
}
