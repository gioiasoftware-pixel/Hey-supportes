import Image from "next/image";
import { RegistrationForm } from "./registration-form";
import { TripAdvisorButton } from "@/components/tripadvisor-button";
import cocktail from "@/assets/cocktail.png";

export default async function RegistratiPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-6 py-16">
      <Image
        src={cocktail}
        alt="Il calice di benvenuto omaggio"
        fill
        sizes="100vw"
        priority
        placeholder="blur"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <h1 className="text-2xl font-bold text-foreground">Registrati</h1>
        <p className="mt-2 text-sm text-foreground/70">
          {ref
            ? "Un amico ti ha invitato! Registrati per ottenere subito il 10% di sconto sulla tua prossima cena."
            : "Registrati per ottenere il 10% di sconto sulla tua prossima cena e un link da condividere con gli amici."}
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          In più, sia tu che il tuo amico riceverete un calice di spumante di benvenuto in omaggio.
        </p>
        <RegistrationForm refCode={ref ?? ""} />
        <TripAdvisorButton className="mt-6" />
      </div>
    </div>
  );
}
