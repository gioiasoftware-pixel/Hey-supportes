import { createAdminClient } from "@/lib/supabase/admin";
import { KpiCard } from "@/components/kpi-card";

export const dynamic = "force-dynamic";

export default async function StatistichePage() {
  const supabase = createAdminClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("id, created_at, referred_by, marketing_opt_in");

  const { data: referrals } = await supabase.from("referrals").select("id, stato");

  const { data: reservations } = await supabase
    .from("reservations")
    .select("id, customer_id, stato, importo_conto, sconto_applicato, created_at");

  const oraMs = Date.now();
  const giorno = 24 * 60 * 60 * 1000;

  // --- Crescita ---
  const totaleClienti = customers?.length ?? 0;
  const nuovi7gg = customers?.filter((c) => oraMs - new Date(c.created_at).getTime() <= 7 * giorno).length ?? 0;
  const nuovi30gg = customers?.filter((c) => oraMs - new Date(c.created_at).getTime() <= 30 * giorno).length ?? 0;
  const daReferral = customers?.filter((c) => c.referred_by).length ?? 0;
  const percentualeDaReferral = totaleClienti > 0 ? Math.round((daReferral / totaleClienti) * 100) : 0;

  const totaleReferral = referrals?.length ?? 0;
  const referralConfermati = referrals?.filter((r) => r.stato === "confirmed").length ?? 0;
  const tassoConversioneReferral =
    totaleReferral > 0 ? Math.round((referralConfermati / totaleReferral) * 100) : 0;
  const kFactor = totaleClienti > 0 ? referralConfermati / totaleClienti : 0;

  // --- Prenotazioni ---
  const totalePrenotazioni = reservations?.length ?? 0;
  const completate = reservations?.filter((r) => r.stato === "completed").length ?? 0;
  const noShow = reservations?.filter((r) => r.stato === "no_show").length ?? 0;
  const tassoCompletamento =
    totalePrenotazioni > 0 ? Math.round((completate / totalePrenotazioni) * 100) : 0;
  const tassoNoShow = totalePrenotazioni > 0 ? Math.round((noShow / totalePrenotazioni) * 100) : 0;

  const primaPrenotazionePerCliente = new Map<string, number>();
  reservations?.forEach((r) => {
    const t = new Date(r.created_at).getTime();
    const attuale = primaPrenotazionePerCliente.get(r.customer_id);
    if (!attuale || t < attuale) primaPrenotazionePerCliente.set(r.customer_id, t);
  });
  const clientiConPrenotazione = customers?.filter((c) => primaPrenotazionePerCliente.has(c.id)) ?? [];
  const tempoMedioGiorni =
    clientiConPrenotazione.length > 0
      ? clientiConPrenotazione.reduce((tot, c) => {
          const prima = primaPrenotazionePerCliente.get(c.id)!;
          return tot + (prima - new Date(c.created_at).getTime()) / giorno;
        }, 0) / clientiConPrenotazione.length
      : null;

  // --- Economico ---
  const cenePagate = reservations?.filter((r) => r.stato === "completed" && r.importo_conto) ?? [];
  const incassoTotale = cenePagate.reduce(
    (tot, r) => tot + r.importo_conto! * (1 - r.sconto_applicato / 100),
    0,
  );
  const costoSconti = cenePagate.reduce(
    (tot, r) => tot + r.importo_conto! * (r.sconto_applicato / 100),
    0,
  );
  const scontrinoMedio =
    cenePagate.length > 0
      ? cenePagate.reduce((tot, r) => tot + r.importo_conto!, 0) / cenePagate.length
      : 0;
  const returnOnDiscount = costoSconti > 0 ? incassoTotale / costoSconti : null;

  // --- Marketing ---
  const iscrittiMarketing = customers?.filter((c) => c.marketing_opt_in).length ?? 0;
  const tassoOptIn = totaleClienti > 0 ? Math.round((iscrittiMarketing / totaleClienti) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-brand">Statistiche</h1>
        <p className="mt-1 text-sm text-brand/70">
          KPI calcolati in automatico dal database. Gli obiettivi sono quelli della prima fase
          (primi 2-3 mesi dal lancio) — da rivedere con qualche mese di dati reali.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-brand/70">Crescita</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Clienti totali" value={String(totaleClienti)} />
          <KpiCard label="Nuovi ultimi 7 giorni" value={String(nuovi7gg)} />
          <KpiCard label="Nuovi ultimi 30 giorni" value={String(nuovi30gg)} />
          <KpiCard
            label="% clienti da referral"
            value={`${percentualeDaReferral}%`}
            obiettivo="15-20%"
            raggiunto={percentualeDaReferral >= 15}
          />
          <KpiCard
            label="Tasso conversione referral"
            value={`${tassoConversioneReferral}%`}
            obiettivo="30%+"
            raggiunto={tassoConversioneReferral >= 30}
          />
          <KpiCard
            label="K-factor"
            value={kFactor.toFixed(2)}
            obiettivo="0.3-0.5"
            raggiunto={kFactor >= 0.3}
          />
          <KpiCard label="Referral inviati" value={String(totaleReferral)} />
          <KpiCard label="Referral confermati" value={String(referralConfermati)} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-brand/70">Prenotazioni</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Prenotazioni totali" value={String(totalePrenotazioni)} />
          <KpiCard
            label="Tasso di completamento"
            value={`${tassoCompletamento}%`}
            obiettivo=">80-85%"
            raggiunto={tassoCompletamento >= 80}
          />
          <KpiCard
            label="Tasso di no-show"
            value={`${tassoNoShow}%`}
            obiettivo="<15-20%"
            raggiunto={tassoNoShow <= 20}
          />
          <KpiCard
            label="Giorni medi alla 1ª prenotazione"
            value={tempoMedioGiorni !== null ? tempoMedioGiorni.toFixed(1) : "—"}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-brand/70">Economico</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Incassato (netto sconto)" value={`€${incassoTotale.toFixed(2)}`} />
          <KpiCard label="Costo sconti applicati" value={`€${costoSconti.toFixed(2)}`} />
          <KpiCard label="Scontrino medio" value={`€${scontrinoMedio.toFixed(2)}`} />
          <KpiCard
            label="Return on discount"
            value={returnOnDiscount !== null ? returnOnDiscount.toFixed(1) : "—"}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-brand/70">Marketing</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Iscritti al marketing" value={String(iscrittiMarketing)} />
          <KpiCard
            label="Tasso di opt-in"
            value={`${tassoOptIn}%`}
            obiettivo="40-60%"
            raggiunto={tassoOptIn >= 40}
          />
        </div>
      </div>
    </div>
  );
}
