import { createAdminClient } from "@/lib/supabase/admin";
import { BlockDateForm } from "./block-date-form";
import { sbloccaData } from "./actions";

export const dynamic = "force-dynamic";

export default async function DateBloccatePage() {
  const supabase = createAdminClient();
  const { data: blockedDates } = await supabase
    .from("blocked_dates")
    .select("id, data, motivo")
    .order("data", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-brand">Date bloccate</h1>
      <BlockDateForm />

      <div className="flex flex-col gap-2">
        {blockedDates?.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded-md border border-brand/20 px-4 py-3 text-sm"
          >
            <span>
              {new Date(b.data).toLocaleDateString("it-IT")}
              {b.motivo && <span className="text-brand/50"> · {b.motivo}</span>}
            </span>
            <form action={sbloccaData.bind(null, b.id)}>
              <button className="text-xs font-semibold text-red-600">Sblocca</button>
            </form>
          </div>
        ))}
        {(!blockedDates || blockedDates.length === 0) && (
          <p className="text-sm text-brand/50">Nessuna data bloccata.</p>
        )}
      </div>
    </div>
  );
}
