import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const FROM = "HEY Supporters <prenotazioni@heyrestaurant.it>";

export const DEFAULT_BENVENUTO_OGGETTO = "Benvenuto in HEY Supporters";
export const DEFAULT_BENVENUTO_CORPO = `Ciao {{nome}},

Grazie per esserti registrato! Hai subito il 10% di sconto sulla tua prossima cena da HEY, e un calice di spumante di benvenuto in omaggio per te.

Invita un amico con il tuo link personale: se viene a cena, il tuo sconto sale al 15% e anche lui riceve il calice di benvenuto in omaggio.

{{link}}

A presto,
HEY`;

export const DEFAULT_UPGRADE_OGGETTO = "Il tuo sconto è salito al 15%!";
export const DEFAULT_UPGRADE_CORPO = `Ciao {{nome}},

Il tuo amico è venuto a cena da noi grazie al tuo invito: il tuo sconto è salito dal 10% al 15% sulla prossima prenotazione.

A presto,
HEY`;

export const DEFAULT_CONFERMA_OGGETTO = "La tua prenotazione da HEY";
export const DEFAULT_CONFERMA_CORPO = `Ciao {{nome}},

La tua prenotazione è confermata:

Data: {{data}}
Orario: {{orario}}
Persone: {{persone}}
Sconto applicato: {{sconto}}%

A presto,
HEY`;

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

async function getSetting(key: string, fallback: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  return data?.value?.trim() || fallback;
}

function riempiTemplate(testo: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
    testo,
  );
}

// Converte testo semplice (paragrafi separati da riga vuota) in HTML,
// così l'admin può modificare i testi delle email senza scrivere HTML.
function testoInHtml(testo: string) {
  return testo
    .split(/\n\s*\n/)
    .map((paragrafo) => `<p>${paragrafo.trim().replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

export async function inviaEmailBenvenuto(params: {
  to: string;
  nome: string;
  referralUrl: string;
}) {
  const resend = getClient();
  if (!resend) return;

  try {
    const oggetto = await getSetting("email_benvenuto_oggetto", DEFAULT_BENVENUTO_OGGETTO);
    const corpo = await getSetting("email_benvenuto_corpo", DEFAULT_BENVENUTO_CORPO);
    const testoFinale = riempiTemplate(corpo, { nome: params.nome, link: params.referralUrl });

    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: oggetto,
      html: testoInHtml(testoFinale),
    });
  } catch (error) {
    // l'invio email non deve mai bloccare la registrazione
    console.error("Errore invio email di benvenuto:", error);
  }
}

export async function inviaEmailUpgradeSconto(params: { to: string; nome: string }) {
  const resend = getClient();
  if (!resend) return;

  try {
    const oggetto = await getSetting("email_upgrade_oggetto", DEFAULT_UPGRADE_OGGETTO);
    const corpo = await getSetting("email_upgrade_corpo", DEFAULT_UPGRADE_CORPO);
    const testoFinale = riempiTemplate(corpo, { nome: params.nome });

    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: oggetto,
      html: testoInHtml(testoFinale),
    });
  } catch (error) {
    console.error("Errore invio email upgrade sconto:", error);
  }
}

export async function inviaComunicazioneMassiva(params: {
  destinatari: { email: string; nome: string }[];
  oggetto: string;
  corpo: string;
}) {
  const resend = getClient();
  if (!resend) return { inviate: 0, fallite: 0, errore: "Resend non configurato." };

  const emails = params.destinatari.map((d) => ({
    from: FROM,
    to: d.email,
    subject: params.oggetto,
    html: testoInHtml(riempiTemplate(params.corpo, { nome: d.nome })),
  }));

  // L'API batch di Resend accetta al massimo 100 email per chiamata.
  let inviate = 0;
  let fallite = 0;
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100);
    try {
      await resend.batch.send(chunk);
      inviate += chunk.length;
    } catch (error) {
      console.error("Errore invio comunicazione massiva:", error);
      fallite += chunk.length;
    }
  }

  return { inviate, fallite };
}

export async function inviaEmailNuovaPrenotazione(params: {
  clienteNome: string;
  clienteEmail: string;
  clienteTelefono: string;
  data: string;
  orario: string;
  numeroPersone: number;
  scontoApplicato: number;
  note?: string | null;
  tipo?: "nuova" | "modificata";
}) {
  const resend = getClient();
  if (!resend) return;

  const emailInterna = await getSetting("email_notifiche_prenotazioni", "");
  if (!emailInterna) return;

  const modificata = params.tipo === "modificata";

  try {
    await resend.emails.send({
      from: FROM,
      to: emailInterna,
      subject: `${modificata ? "Prenotazione modificata" : "Nuova prenotazione"}: ${params.clienteNome} · ${params.data} ${params.orario}`,
      html: testoInHtml(
        `${modificata ? "Una prenotazione è stata modificata" : "Nuova prenotazione ricevuta"} dal gestionale referral.

Cliente: ${params.clienteNome}
Email: ${params.clienteEmail}
Telefono: ${params.clienteTelefono}
Data: ${params.data}
Orario: ${params.orario}
Persone: ${params.numeroPersone}
Sconto applicato: ${params.scontoApplicato}%${params.note ? `\nNote: ${params.note}` : ""}`,
      ),
    });
  } catch (error) {
    console.error("Errore invio email notifica nuova prenotazione:", error);
  }
}

export async function inviaEmailConfermaPrenotazione(params: {
  to: string;
  nome: string;
  data: string;
  orario: string;
  numeroPersone: number;
  scontoApplicato: number;
  note?: string | null;
  tipo?: "nuova" | "modificata";
}) {
  const resend = getClient();
  if (!resend) return;

  try {
    const oggettoBase = await getSetting("email_conferma_oggetto", DEFAULT_CONFERMA_OGGETTO);
    const corpo = await getSetting("email_conferma_corpo", DEFAULT_CONFERMA_CORPO);
    const modificata = params.tipo === "modificata";
    const oggetto = modificata ? `Aggiornamento: ${oggettoBase}` : oggettoBase;

    let testoFinale = riempiTemplate(corpo, {
      nome: params.nome,
      data: params.data,
      orario: params.orario,
      persone: String(params.numeroPersone),
      sconto: String(params.scontoApplicato),
    });
    if (params.note) {
      testoFinale += `\n\nNote da te indicate: ${params.note}`;
    }

    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: oggetto,
      html: testoInHtml(testoFinale),
    });
  } catch (error) {
    console.error("Errore invio email conferma prenotazione:", error);
  }
}

export async function inviaEmailAmicoHaPrenotato(params: {
  to: string;
  nomeReferrer: string;
  nomeAmico: string;
}) {
  const resend = getClient();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: "Il tuo amico ha prenotato da HEY!",
      html: testoInHtml(
        `Ciao ${params.nomeReferrer},

Il tuo amico ${params.nomeAmico} ha appena prenotato un tavolo da HEY grazie al tuo invito. Se verrà davvero a cena, il tuo sconto salirà al 15%.

A presto,
HEY`,
      ),
    });
  } catch (error) {
    console.error("Errore invio email amico ha prenotato:", error);
  }
}
