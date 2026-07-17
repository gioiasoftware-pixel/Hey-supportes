import { createAdminClient } from "@/lib/supabase/admin";
import { confermaPresenza, segnaNoShow } from "./actions";

export const dynamic = "force-dynamic";

export default async function PrenotazioniPage() {
  const supabase = createAdminClient();

  const { data: reservations } = await supabase
    .from("reservations")
    .select(
      "id, data, orario, numero_persone, stato, sconto_applicato, importo_conto, customers(nome, email, telefono)",
    )
    .order("data", { ascending: true });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-brand">Prenotazioni</h1>

      <div className="overflow-x-auto rounded-lg border border-brand/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand/5 text-brand/70">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Orario</th>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Persone</th>
              <th className="px-4 py-2">Sconto</th>
              <th className="px-4 py-2">Conto</th>
              <th className="px-4 py-2">Stato</th>
              <th className="px-4 py-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {reservations?.map((r) => {
              // il join restituisce un array in TS anche se la FK è 1:1
              const customer = Array.isArray(r.customers) ? r.customers[0] : r.customers;
              const incassoNetto = r.importo_conto
                ? r.importo_conto * (1 - r.sconto_applicato / 100)
                : null;
              return (
                <tr key={r.id} className="border-t border-brand/10">
                  <td className="px-4 py-2">{new Date(r.data).toLocaleDateString("it-IT")}</td>
                  <td className="px-4 py-2">{r.orario}</td>
                  <td className="px-4 py-2">
                    <div>{customer?.nome}</div>
                    <div className="text-xs text-brand/50">
                      {customer?.email} · {customer?.telefono}
                    </div>
                  </td>
                  <td className="px-4 py-2">{r.numero_persone}</td>
                  <td className="px-4 py-2">{r.sconto_applicato}%</td>
                  <td className="px-4 py-2">
                    {r.importo_conto ? (
                      <>
                        €{r.importo_conto.toFixed(2)}
                        <div className="text-xs text-brand/50">
                          incassati €{incassoNetto!.toFixed(2)}
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2">{r.stato}</td>
                  <td className="px-4 py-2">
                    {r.stato === "confirmed" && (
                      <div className="flex flex-wrap items-center gap-2">
                        <form
                          action={confermaPresenza.bind(null, r.id)}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="number"
                            name="importo_conto"
                            step="0.01"
                            min="0.01"
                            required
                            placeholder="Conto €"
                            className="w-24 rounded-md border border-brand/20 px-2 py-1 text-xs outline-none focus:border-brand"
                          />
                          <button className="rounded-md bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
                            Conferma presenza
                          </button>
                        </form>
                        <form action={segnaNoShow.bind(null, r.id)}>
                          <button className="rounded-md border border-brand/20 px-3 py-1 text-xs font-semibold text-brand">
                            No-show
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!reservations || reservations.length === 0) && (
          <p className="px-4 py-6 text-center text-sm text-brand/50">Nessuna prenotazione.</p>
        )}
      </div>
    </div>
  );
}
