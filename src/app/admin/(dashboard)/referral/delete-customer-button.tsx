"use client";

import { eliminaCliente } from "./actions";

export function DeleteCustomerButton({ customerId, nome }: { customerId: string; nome: string }) {
  return (
    <form
      action={eliminaCliente.bind(null, customerId)}
      onSubmit={(e) => {
        if (!confirm(`Eliminare definitivamente ${nome} e tutte le sue prenotazioni/referral?`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-xs font-semibold text-red-600">
        Elimina
      </button>
    </form>
  );
}
