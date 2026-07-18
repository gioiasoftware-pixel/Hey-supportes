import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ClientiPage() {
  const supabase = createAdminClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("id, nome, email, telefono, sconto_percentuale, sconto_scade_il, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-brand">Clienti</h1>
      <p className="text-sm text-brand/70">
        Elenco di tutti gli account. Clicca su un cliente per vedere lo storico completo (cene,
        incassi, sconti, referral inviati).
      </p>

      <div className="overflow-x-auto rounded-lg border border-brand/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand/5 text-brand/70">
            <tr>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Telefono</th>
              <th className="px-4 py-2">Sconto attivo</th>
              <th className="px-4 py-2">Iscritto il</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((c) => {
              const scontoValido =
                !c.sconto_scade_il || new Date(c.sconto_scade_il) > new Date();
              return (
                <tr key={c.id} className="border-t border-brand/10">
                  <td className="px-4 py-2">
                    <Link href={`/admin/clienti/${c.id}`} className="font-medium text-brand hover:underline">
                      {c.nome}
                    </Link>
                    <div className="text-xs text-brand/50">{c.email}</div>
                  </td>
                  <td className="px-4 py-2">{c.telefono}</td>
                  <td className="px-4 py-2">
                    {scontoValido && c.sconto_percentuale > 0 ? `${c.sconto_percentuale}%` : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(c.created_at).toLocaleDateString("it-IT")}
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
  );
}
