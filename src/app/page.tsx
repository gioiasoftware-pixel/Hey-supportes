import { Logo } from "@/components/logo";
import { TripAdvisorButton } from "@/components/tripadvisor-button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Logo />
      <div className="flex max-w-md flex-col gap-3">
        <h1 className="text-2xl font-bold text-brand">Grazie per essere stato da noi</h1>
        <p className="text-sm text-brand/70">
          Registrati per ottenere il 10% di sconto sulla tua prossima cena e invita un amico: se
          viene a cena, il tuo sconto sale al 15%.
        </p>
        <p className="text-sm text-brand/70">
          In più, sia tu che il tuo amico riceverete un calice di spumante di benvenuto in omaggio.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <a
          href="/registrati"
          className="rounded-md bg-brand px-4 py-2 font-semibold text-brand-foreground"
        >
          Registrati
        </a>
        <a
          href="/accedi"
          className="rounded-md border border-brand/20 px-4 py-2 font-semibold text-brand"
        >
          Ho già un account
        </a>
        <TripAdvisorButton />
      </div>
    </div>
  );
}
