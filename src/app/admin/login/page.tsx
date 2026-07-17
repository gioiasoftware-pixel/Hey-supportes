import { Logo } from "@/components/logo";
import { AdminLoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <Logo subtitle="Admin" />
      <h1 className="mt-6 text-2xl font-bold text-brand">Accesso maitre</h1>
      <AdminLoginForm />
    </div>
  );
}
