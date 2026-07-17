import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ShareButton } from "./share-button";
import { TripAdvisorButton } from "@/components/tripadvisor-button";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;
  if (!customerId) {
    redirect("/accedi");
  }

  const supabase = createAdminClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("nome, email, referral_code, sconto_percentuale, sconto_scade_il")
    .eq("id", customerId)
    .single();

  if (!customer) {
    redirect("/accedi");
  }

  const { data: reservations } = await supabase
    .from("reservations")
    .select("id, data, orario, numero_persone, stato, sconto_applicato")
    .eq("customer_id", customerId)
    .order("data", { ascending: false });

  const scontoValido =
    !customer.sconto_scade_il || new Date(customer.sconto_scade_il) > new Date();
  const scontoAttivo = scontoValido ? customer.sconto_percentuale : 0;

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const referralUrl = `${protocol}://${host}/registrati?ref=${customer.referral_code}`;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-bold text-brand">Ciao {customer.nome}</h1>
        <p className="mt-1 text-sm text-brand/70">{customer.email}</p>
      </div>

      <div className="rounded-lg border border-brand/20 p-5">
        <p className="text-sm font-medium text-brand/70">Il tuo sconto attivo</p>
        <p className="mt-1 text-3xl font-bold text-brand">
          {scontoAttivo > 0 ? `${scontoAttivo}%` : "Nessuno sconto attivo"}
        </p>
        {scontoAttivo > 0 && customer.sconto_scade_il && (
          <p className="mt-1 text-sm text-brand/70">
            Valido fino al {new Date(customer.sconto_scade_il).toLocaleDateString("it-IT")}
          </p>
        )}
        <a
          href="/prenota"
          className="mt-4 inline-block rounded-md bg-brand px-4 py-2 font-semibold text-brand-foreground"
        >
          Prenota un tavolo
        </a>
      </div>

      <div className="rounded-lg border border-brand/20 p-5">
        <p className="text-sm font-medium text-brand/70">Invita un amico</p>
        <p className="mt-1 text-sm text-brand/70">
          Se il tuo amico viene a cena, il tuo sconto sale al 15%.
        </p>
        <p className="mt-3 break-all rounded-md bg-brand/5 px-3 py-2 font-mono text-sm text-brand">
          {referralUrl}
        </p>
        <ShareButton url={referralUrl} />
      </div>

      <TripAdvisorButton />

      <div>
        <p className="text-sm font-medium text-brand/70">Le tue prenotazioni</p>
        <div className="mt-3 flex flex-col gap-2">
          {reservations && reservations.length > 0 ? (
            reservations.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-md border border-brand/20 px-4 py-3 text-sm"
              >
                <span>
                  {new Date(r.data).toLocaleDateString("it-IT")} · {r.orario} · {r.numero_persone}{" "}
                  persone
                </span>
                <span className="font-medium text-brand/70">
                  {r.stato} {r.sconto_applicato > 0 && `· sconto ${r.sconto_applicato}%`}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-brand/50">Nessuna prenotazione ancora.</p>
          )}
        </div>
      </div>
    </div>
  );
}
