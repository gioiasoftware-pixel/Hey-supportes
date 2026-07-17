import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function ImpostazioniPage() {
  const supabase = createAdminClient();
  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "sconto_validita_giorni")
    .maybeSingle();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-brand">Impostazioni</h1>
      <p className="text-sm text-brand/70">
        Ogni sconto assegnato ai clienti (10% o 15%) scade automaticamente dopo questo numero di
        giorni.
      </p>
      <SettingsForm validitaAttuale={Number(setting?.value ?? 30)} />
    </div>
  );
}
