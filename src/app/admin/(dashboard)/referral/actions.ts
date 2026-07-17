"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function eliminaCliente(customerId: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Pulizia manuale delle dipendenze: le FK non hanno cascade, quindi vanno
  // rimosse/scollegate prima di poter cancellare il cliente.
  await supabase.from("reservations").delete().eq("customer_id", customerId);
  await supabase
    .from("referrals")
    .delete()
    .or(`referrer_id.eq.${customerId},referred_id.eq.${customerId}`);
  await supabase.from("customers").update({ referred_by: null }).eq("referred_by", customerId);

  await supabase.from("customers").delete().eq("id", customerId);

  revalidatePath("/admin/referral");
}
