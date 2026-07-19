import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_BENVENUTO_OGGETTO,
  DEFAULT_BENVENUTO_CORPO,
  DEFAULT_UPGRADE_OGGETTO,
  DEFAULT_UPGRADE_CORPO,
} from "@/lib/resend";
import { SettingsForm } from "./settings-form";
import { NotificationEmailForm } from "./notification-email-form";
import { EmailTemplateForm } from "./email-template-form";
import { aggiornaEmailBenvenuto, aggiornaEmailUpgrade } from "./actions";

export const dynamic = "force-dynamic";

export default async function ImpostazioniPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", [
      "sconto_validita_giorni",
      "email_notifiche_prenotazioni",
      "email_benvenuto_oggetto",
      "email_benvenuto_corpo",
      "email_upgrade_oggetto",
      "email_upgrade_corpo",
    ]);

  const get = (key: string, fallback: string) =>
    settings?.find((s) => s.key === key)?.value || fallback;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-brand">Impostazioni</h1>

      <div className="rounded-lg border border-brand/20 p-5">
        <p className="text-sm font-medium text-brand">Validità sconto</p>
        <p className="mt-1 text-xs text-brand/50">
          Ogni sconto assegnato ai clienti (10% o 15%) scade automaticamente dopo questo numero di
          giorni.
        </p>
        <div className="mt-3">
          <SettingsForm validitaAttuale={Number(get("sconto_validita_giorni", "30"))} />
        </div>
      </div>

      <div className="rounded-lg border border-brand/20 p-5">
        <p className="text-sm font-medium text-brand">Notifica nuove prenotazioni</p>
        <div className="mt-3">
          <NotificationEmailForm emailAttuale={get("email_notifiche_prenotazioni", "")} />
        </div>
      </div>

      <EmailTemplateForm
        titolo="Email di benvenuto (alla registrazione)"
        action={aggiornaEmailBenvenuto}
        oggettoAttuale={get("email_benvenuto_oggetto", DEFAULT_BENVENUTO_OGGETTO)}
        corpoAttuale={get("email_benvenuto_corpo", DEFAULT_BENVENUTO_CORPO)}
        placeholders="{{nome}}, {{link}}"
      />

      <EmailTemplateForm
        titolo="Email upgrade sconto (quando sale al 15%)"
        action={aggiornaEmailUpgrade}
        oggettoAttuale={get("email_upgrade_oggetto", DEFAULT_UPGRADE_OGGETTO)}
        corpoAttuale={get("email_upgrade_corpo", DEFAULT_UPGRADE_CORPO)}
        placeholders="{{nome}}"
      />
    </div>
  );
}
