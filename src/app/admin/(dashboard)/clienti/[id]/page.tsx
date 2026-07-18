import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ClienteDettaglioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: customer } = await supabase
    .from("customers")
    .select(
      "id, nome, email, telefono, referral_code, sconto_percentuale, sconto_scade_il, created_at, marketing_opt_in, referrer:referred_by(id, nome)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!customer) {
    notFound();
  }

  const { data: reservations } = await supabase
    .from("reservations")
    .select("id, data, orario, numero_persone, stato, sconto_applicato, importo_conto")
    .eq("customer_id", id)
    .order("data", { ascending: false });

  const { data: referralsInviati } = await supabase
    .from("referrals")
    .select("id, stato, confirmed_at, created_at, referred:referred_id(id, nome, email)")
    .eq("referrer_id", id)
    .order("created_at", { ascending: false });

  const cenePagate = reservations?.filter((r) => r.stato === "completed" && r.importo_conto) ?? [];
  const totaleContoPagato = cenePagate.reduce(
    (tot, r) => tot + r.importo_conto! * (1 - r.sconto_applicato / 100),
    0,
  );
  const totaleSconti = cenePagate.reduce(
    (tot, r) => tot + r.importo_conto! * (r.sconto_applicato / 100),
    0,
  );

  const referrer = Array.isArray(customer.referrer) ? customer.referrer[0] : customer.referrer;
  const scontoValido =
    !customer.sconto_scade_il || new Date(customer.sconto_scade_il) > new Date();
  const clientiEffettivi = referralsInviati?.filter((r) => r.stato === "confirmed").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/clienti" className="text-sm text-brand/70 hover:underline">
          ← Tutti i clienti
        </Link>
        <h1 className="mt-1 text-xl font-bold text-brand">{customer.nome}</h1>
        <p className="text-sm text-brand/70">
          {customer.email} · {customer.telefono}
        </p>
        <p className="mt-1 text-xs text-brand/50">
          Iscritto il {new Date(customer.created_at).toLocaleDateString("it-IT")} · codice
          referral <span className="font-mono">{customer.referral_code}</span>
          {referrer && <> · invitato da {referrer.nome}</>} · marketing:{" "}
          {customer.marketing_opt_in ? "sì" : "no"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Sconto attivo</p>
          <p className="text-2xl font-bold text-brand">
            {scontoValido && customer.sconto_percentuale > 0 ? `${customer.sconto_percentuale}%` : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Cene fatte</p>
          <p className="text-2xl font-bold text-brand">{cenePagate.length}</p>
        </div>
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Conto pagato (totale)</p>
          <p className="text-2xl font-bold text-brand">€{totaleContoPagato.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Sconti ottenuti (totale)</p>
          <p className="text-2xl font-bold text-brand">€{totaleSconti.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-brand/70">Storico cene</p>
        <div className="overflow-x-auto rounded-lg border border-brand/20">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand/5 text-brand/70">
              <tr>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Persone</th>
                <th className="px-4 py-2">Stato</th>
                <th className="px-4 py-2">Sconto</th>
                <th className="px-4 py-2">Conto</th>
                <th className="px-4 py-2">Pagato (netto)</th>
              </tr>
            </thead>
            <tbody>
              {reservations?.map((r) => (
                <tr key={r.id} className="border-t border-brand/10">
                  <td className="px-4 py-2">
                    {new Date(r.data).toLocaleDateString("it-IT")} · {r.orario}
                  </td>
                  <td className="px-4 py-2">{r.numero_persone}</td>
                  <td className="px-4 py-2">{r.stato}</td>
                  <td className="px-4 py-2">{r.sconto_applicato}%</td>
                  <td className="px-4 py-2">{r.importo_conto ? `€${r.importo_conto.toFixed(2)}` : "—"}</td>
                  <td className="px-4 py-2">
                    {r.importo_conto
                      ? `€${(r.importo_conto * (1 - r.sconto_applicato / 100)).toFixed(2)}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!reservations || reservations.length === 0) && (
            <p className="px-4 py-6 text-center text-sm text-brand/50">Nessuna prenotazione.</p>
          )}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-brand/70">
          Referral inviati · {clientiEffettivi} cliente/i effettivo/i portato/i
        </p>
        <div className="overflow-x-auto rounded-lg border border-brand/20">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand/5 text-brand/70">
              <tr>
                <th className="px-4 py-2">Amico invitato</th>
                <th className="px-4 py-2">Stato</th>
                <th className="px-4 py-2">Confermato il</th>
              </tr>
            </thead>
            <tbody>
              {referralsInviati?.map((r) => {
                const referred = Array.isArray(r.referred) ? r.referred[0] : r.referred;
                return (
                  <tr key={r.id} className="border-t border-brand/10">
                    <td className="px-4 py-2">
                      {referred ? (
                        <Link href={`/admin/clienti/${referred.id}`} className="hover:underline">
                          {referred.nome} <span className="text-brand/50">({referred.email})</span>
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {r.stato === "confirmed" ? "venuto a cena" : "in attesa"}
                    </td>
                    <td className="px-4 py-2">
                      {r.confirmed_at ? new Date(r.confirmed_at).toLocaleDateString("it-IT") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!referralsInviati || referralsInviati.length === 0) && (
            <p className="px-4 py-6 text-center text-sm text-brand/50">
              Non ha ancora invitato nessuno.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
