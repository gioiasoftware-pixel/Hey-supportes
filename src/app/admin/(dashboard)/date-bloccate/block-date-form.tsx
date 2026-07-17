"use client";

import { useActionState } from "react";
import { bloccaData } from "./actions";

export function BlockDateForm() {
  const [state, formAction, pending] = useActionState(bloccaData, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Data
        <input
          type="date"
          name="data"
          required
          className="rounded-md border border-brand/20 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Motivo (facoltativo)
        <input
          type="text"
          name="motivo"
          className="rounded-md border border-brand/20 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
      >
        {pending ? "Blocco in corso..." : "Blocca data"}
      </button>
      {state?.error && <p className="w-full text-sm font-medium text-red-600">{state.error}</p>}
    </form>
  );
}
