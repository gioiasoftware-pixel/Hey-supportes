"use client";

import { useActionState } from "react";
import { registerCustomer } from "./actions";

export function RegistrationForm({ refCode }: { refCode: string }) {
  const [state, formAction, pending] = useActionState(registerCustomer, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <input type="hidden" name="ref" value={refCode} />

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Email
        <input
          type="email"
          name="email"
          required
          className="rounded-md border border-brand/20 px-3 py-2 text-base outline-none focus:border-brand"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Nome
        <input
          type="text"
          name="nome"
          required
          className="rounded-md border border-brand/20 px-3 py-2 text-base outline-none focus:border-brand"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-brand">
        Telefono
        <input
          type="tel"
          name="telefono"
          required
          className="rounded-md border border-brand/20 px-3 py-2 text-base outline-none focus:border-brand"
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-brand/80">
        <input type="checkbox" name="privacy" required className="mt-1" />
        <span>
          Accetto l&apos;informativa privacy per il trattamento dei miei dati necessario a erogare
          il servizio (obbligatorio).
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-brand/80">
        <input type="checkbox" name="marketing_opt_in" className="mt-1" />
        <span>Voglio ricevere comunicazioni promozionali e offerte via email (facoltativo).</span>
      </label>

      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-brand px-4 py-2 font-semibold text-brand-foreground transition-opacity disabled:opacity-60"
      >
        {pending ? "Registrazione in corso..." : "Registrati"}
      </button>

      <p className="text-center text-sm text-brand/70">
        Sei già registrato? <a href="/accedi" className="font-semibold underline">Accedi</a>
      </p>
    </form>
  );
}
