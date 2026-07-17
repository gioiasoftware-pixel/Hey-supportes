import { createAdminClient } from "@/lib/supabase/admin";
import { DeleteCustomerButton } from "./delete-customer-button";

export const dynamic = "force-dynamic";

export default async function ReferralPage() {
  const supabase = createAdminClient();

  const { data: referrals } = await supabase
    .from("referrals")
    .select(
      "id, stato, confirmed_at, created_at, referrer:referrer_id(nome, email), referred:referred_id(nome, email)",
    )
    .order("created_at", { ascending: false });

  const { count: totaleClienti } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  const { data: customers } = await supabase
    .from("customers")
    .select(
      "id, nome, email, telefono, referral_code, sconto_percentuale, sconto_scade_il, created_at, referrer:referred_by(nome)",
    )
    .order("created_at", { ascending: false });

  const totaleReferral = referrals?.length ?? 0;
  const confermati = referrals?.filter((r) => r.stato === "confirmed").length ?? 0;
  const tassoConversione = totaleReferral > 0 ? Math.round((confermati / totaleReferral) * 100) : 0;

  const { data: cenePagate } = await supabase
    .from("reservations")
    .select("importo_conto, sconto_applicato")
    .eq("stato", "completed")
    .not("importo_conto", "is", null);

  const incassoTotale =
    cenePagate?.reduce(
      (tot, r) => tot + r.importo_conto! * (1 - r.sconto_applicato / 100),
      0,
    ) ?? 0;
  const costoSconti =
    cenePagate?.reduce((tot, r) => tot + r.importo_conto! * (r.sconto_applicato / 100), 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-brand">Referral</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Clienti totali</p>
          <p className="text-2xl font-bold text-brand">{totaleClienti ?? 0}</p>
        </div>
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Referral inviati</p>
          <p className="text-2xl font-bold text-brand">{totaleReferral}</p>
        </div>
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Tasso di conversione</p>
          <p className="text-2xl font-bold text-brand">{tassoConversione}%</p>
        </div>
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Incassato (netto sconto)</p>
          <p className="text-2xl font-bold text-brand">€{incassoTotale.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-brand/20 p-4">
          <p className="text-sm text-brand/70">Costo sconti applicati</p>
          <p className="text-2xl font-bold text-brand">€{costoSconti.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-brand/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand/5 text-brand/70">
            <tr>
              <th className="px-4 py-2">Chi invita</th>
              <th className="px-4 py-2">Chi è stato invitato</th>
              <th className="px-4 py-2">Stato</th>
              <th className="px-4 py-2">Confermato il</th>
            </tr>
          </thead>
          <tbody>
            {referrals?.map((r) => {
              const referrer = Array.isArray(r.referrer) ? r.referrer[0] : r.referrer;
              const referred = Array.isArray(r.referred) ? r.referred[0] : r.referred;
              return (
                <tr key={r.id} className="border-t border-brand/10">
                  <td className="px-4 py-2">
                    {referrer?.nome} <span className="text-brand/50">({referrer?.email})</span>
                  </td>
                  <td className="px-4 py-2">
                    {referred?.nome} <span className="text-brand/50">({referred?.email})</span>
                  </td>
                  <td className="px-4 py-2">{r.stato}</td>
                  <td className="px-4 py-2">
                    {r.confirmed_at ? new Date(r.confirmed_at).toLocaleDateString("it-IT") : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!referrals || referrals.length === 0) && (
          <p className="px-4 py-6 text-center text-sm text-brand/50">Nessun referral ancora.</p>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-brand/70">Tutti gli account</p>
        <div className="overflow-x-auto rounded-lg border border-brand/20">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand/5 text-brand/70">
              <tr>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Telefono</th>
                <th className="px-4 py-2">Codice referral</th>
                <th className="px-4 py-2">Invitato da</th>
                <th className="px-4 py-2">Sconto</th>
                <th className="px-4 py-2">Iscritto il</th>
                <th className="px-4 py-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((c) => {
                const referrer = Array.isArray(c.referrer) ? c.referrer[0] : c.referrer;
                const scontoValido =
                  !c.sconto_scade_il || new Date(c.sconto_scade_il) > new Date();
                return (
                  <tr key={c.id} className="border-t border-brand/10">
                    <td className="px-4 py-2">
                      <div>{c.nome}</div>
                      <div className="text-xs text-brand/50">{c.email}</div>
                    </td>
                    <td className="px-4 py-2">{c.telefono}</td>
                    <td className="px-4 py-2 font-mono text-xs">{c.referral_code}</td>
                    <td className="px-4 py-2">{referrer?.nome ?? "—"}</td>
                    <td className="px-4 py-2">
                      {scontoValido && c.sconto_percentuale > 0 ? `${c.sconto_percentuale}%` : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(c.created_at).toLocaleDateString("it-IT")}
                    </td>
                    <td className="px-4 py-2">
                      <DeleteCustomerButton customerId={c.id} nome={c.nome} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!customers || customers.length === 0) && (
            <p className="px-4 py-6 text-center text-sm text-brand/50">Nessun account ancora.</p>
          )}
        </div>
      </div>
    </div>
  );
}
