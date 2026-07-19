"use client";

import { useActionState, useState } from "react";
import { inviaComunicazione } from "./actions";

export function ComunicazioneForm({
  totaleMarketing,
  totaleClienti,
}: {
  totaleMarketing: number;
  totaleClienti: number;
}) {
  const [state, formAction, pending] = useActionState(inviaComunicazione, null);
  const [destinatari, setDestinatari] = useState<"marketing" | "tutti">("marketing");

  const numeroDestinatari = destinatari === "marketing" ? totaleMarketing : totaleClienti;

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !confirm(
            `Stai per inviare questa email a ${numeroDestinatari} destinatari. Confermi?`,
          )
        ) {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-3"
    >
      <fieldset className="flex flex-col gap-2 text-sm text-brand">
        <p className="font-medium">Destinatari</p>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="destinatari"
            value="marketing"
            checked={destinatari === "marketing"}
            onChange={() => setDestinatari("marketing")}
          />
          Solo chi ha dato il consenso marketing ({totaleMarketing})
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="destinatari"
            value="tutti"
            checked={destinatari === "tutti"}
            onChange={() => setDestinatari("tutti")}
          />
          Tutti i clienti registrati ({totaleClienti}) — solo per comunicazioni di servizio, non
          promozionali
        </label>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Oggetto
        <input
          type="text"
          name="oggetto"
          required
          className="rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Corpo
        <textarea
          name="corpo"
          required
          rows={8}
          placeholder="Ciao {{nome}}, ..."
          className="rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand"
        />
      </label>
      <p className="text-xs text-brand/50">
        Placeholder disponibile: {"{{nome}}"}. Riga vuota = nuovo paragrafo.
      </p>

      <button
        type="submit"
        disabled={pending || numeroDestinatari === 0}
        className="self-start rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
      >
        {pending ? "Invio in corso..." : `Invia a ${numeroDestinatari} destinatari`}
      </button>
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm font-medium text-green-700">{state.ok}</p>}
    </form>
  );
}
