"use client";

import { useActionState } from "react";

type Action = (
  prevState: { error?: string; ok?: boolean } | null,
  formData: FormData,
) => Promise<{ error?: string; ok?: boolean }>;

export function EmailTemplateForm({
  titolo,
  action,
  oggettoAttuale,
  corpoAttuale,
  placeholders,
}: {
  titolo: string;
  action: Action;
  oggettoAttuale: string;
  corpoAttuale: string;
  placeholders: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <div className="rounded-lg border border-brand/20 p-5">
      <p className="text-sm font-medium text-brand">{titolo}</p>
      <p className="mt-1 text-xs text-brand/50">
        Placeholder disponibili: {placeholders}. Riga vuota = nuovo paragrafo.
      </p>
      <form action={formAction} className="mt-3 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-brand">
          Oggetto
          <input
            type="text"
            name="oggetto"
            defaultValue={oggettoAttuale}
            required
            className="rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-brand">
          Corpo
          <textarea
            name="corpo"
            defaultValue={corpoAttuale}
            required
            rows={8}
            className="rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
        >
          {pending ? "Salvataggio..." : "Salva"}
        </button>
        {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
        {state?.ok && <p className="text-sm font-medium text-green-700">Testo salvato.</p>}
      </form>
    </div>
  );
}
