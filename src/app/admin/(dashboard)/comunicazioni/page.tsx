import { createAdminClient } from "@/lib/supabase/admin";
import { ComunicazioneForm } from "./comunicazione-form";

export const dynamic = "force-dynamic";

export default async function ComunicazioniPage() {
  const supabase = createAdminClient();

  const { count: totaleClienti } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  const { count: totaleMarketing } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("marketing_opt_in", true);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-brand">Comunicazioni</h1>
      <p className="text-sm text-brand/70">
        Scrivi un&apos;email e mandala a tutti i clienti in una volta sola. Per le comunicazioni
        promozionali usa sempre il filtro &quot;consenso marketing&quot;, obbligatorio per legge.
      </p>

      <div className="rounded-lg border border-brand/20 p-5">
        <ComunicazioneForm
          totaleMarketing={totaleMarketing ?? 0}
          totaleClienti={totaleClienti ?? 0}
        />
      </div>
    </div>
  );
}
