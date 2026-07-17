import { LoginForm } from "./login-form";

export default function AccediPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-brand">Accedi</h1>
      <p className="mt-2 text-sm text-brand/70">
        Inserisci la tua email per accedere all&apos;area riservata e prenotare.
      </p>
      <LoginForm />
    </div>
  );
}
