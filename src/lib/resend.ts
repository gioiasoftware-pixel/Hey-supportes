import { Resend } from "resend";

// Mittente di test di Resend: funziona da subito senza dominio verificato.
// Quando il ristorante avrà un dominio proprio, sostituire con
// "prenotazioni@<dominio>" dopo averlo verificato su resend.com/domains.
const FROM = "HEY Supporters <onboarding@resend.dev>";

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function inviaEmailBenvenuto(params: {
  to: string;
  nome: string;
  referralUrl: string;
}) {
  const resend = getClient();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: "Benvenuto in HEY Supporters",
      html: `
        <p>Ciao ${params.nome},</p>
        <p>Grazie per esserti registrato! Hai subito il <strong>10% di sconto</strong> sulla tua prossima cena da HEY, e un calice di spumante di benvenuto in omaggio per te.</p>
        <p>Invita un amico con il tuo link personale: se viene a cena, il tuo sconto sale al <strong>15%</strong> e anche lui riceve il calice di benvenuto in omaggio.</p>
        <p><a href="${params.referralUrl}">${params.referralUrl}</a></p>
        <p>A presto,<br>HEY</p>
      `,
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
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: "Il tuo sconto è salito al 15%!",
      html: `
        <p>Ciao ${params.nome},</p>
        <p>Il tuo amico è venuto a cena da noi grazie al tuo invito: il tuo sconto è salito dal 10% al <strong>15%</strong> sulla prossima prenotazione.</p>
        <p>A presto,<br>HEY</p>
      `,
    });
  } catch (error) {
    console.error("Errore invio email upgrade sconto:", error);
  }
}
