import { logoutAdmin } from "./actions";

export function LogoutButton() {
  return (
    <form action={logoutAdmin}>
      <button type="submit" className="text-sm font-medium text-brand-foreground/80 hover:text-brand-foreground">
        Esci
      </button>
    </form>
  );
}
