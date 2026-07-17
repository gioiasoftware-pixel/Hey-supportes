"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
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
        Password
        <input
          type="password"
          name="password"
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
        {pending ? "Accesso in corso..." : "Accedi"}
      </button>
    </form>
  );
}
