import Image from "next/image";
import { Logo } from "@/components/logo";
import { TripAdvisorButton } from "@/components/tripadvisor-button";
import sala from "@/assets/sala.png";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center">
      <Image
        src={sala}
        alt="La sala di HEY"
        fill
        priority
        placeholder="blur"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <Logo />
        <div className="flex max-w-md flex-col gap-3">
          <h1 className="text-2xl font-bold text-foreground">Grazie per essere stato da noi</h1>
          <p className="text-sm text-foreground/70">
            Registrati per ottenere il 10% di sconto sulla tua prossima cena e invita un amico: se
            viene a cena, il tuo sconto sale al 15%.
          </p>
          <p className="text-sm text-foreground/70">
            In più, sia tu che il tuo amico riceverete un calice di spumante di benvenuto in
            omaggio.
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
            className="rounded-md border border-foreground/20 px-4 py-2 font-semibold text-foreground"
          >
            Ho già un account
          </a>
          <TripAdvisorButton />
        </div>
      </div>
    </div>
  );
}
