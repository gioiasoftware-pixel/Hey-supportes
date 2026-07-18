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
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-brand">Registrati</h1>
      <p className="mt-2 text-sm text-brand/70">
        {ref
          ? "Un amico ti ha invitato! Registrati per ottenere subito il 10% di sconto sulla tua prossima cena."
          : "Registrati per ottenere il 10% di sconto sulla tua prossima cena e un link da condividere con gli amici."}
      </p>
      <p className="mt-2 text-sm text-brand/70">
        In più, sia tu che il tuo amico riceverete un calice di spumante di benvenuto in omaggio.
      </p>
      <Image
        src={cocktail}
        alt="Il calice di benvenuto omaggio"
        placeholder="blur"
        className="mt-4 h-40 w-full rounded-lg object-cover"
      />
      <RegistrationForm refCode={ref ?? ""} />
      <TripAdvisorButton className="mt-6" />
    </div>
  );
}
