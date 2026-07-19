"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviaComunicazioneMassiva } from "@/lib/resend";

export async function inviaComunicazione(
  _prevState: { error?: string; ok?: string } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: string }> {
  await requireAdmin();

  const oggetto = String(formData.get("oggetto") || "").trim();
  const corpo = String(formData.get("corpo") || "").trim();
  const destinatari = String(formData.get("destinatari") || "marketing");

  if (!oggetto || !corpo) {
    return { error: "Oggetto e corpo non possono essere vuoti." };
  }

  const supabase = createAdminClient();
  let query = supabase.from("customers").select("nome, email");
  if (destinatari === "marketing") {
    query = query.eq("marketing_opt_in", true);
  }
  const { data: customers } = await query;

  if (!customers || customers.length === 0) {
    return { error: "Nessun destinatario trovato per questo filtro." };
  }

  const risultato = await inviaComunicazioneMassiva({ destinatari: customers, oggetto, corpo });

  if (risultato.fallite > 0) {
    return {
      error: `Inviate ${risultato.inviate} email, ma ${risultato.fallite} sono fallite.`,
    };
  }

  return { ok: `Email inviata a ${risultato.inviate} destinatari.` };
}
