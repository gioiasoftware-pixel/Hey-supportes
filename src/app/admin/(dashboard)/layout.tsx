import Link from "next/link";
import { Logo } from "@/components/logo";
import { LogoutButton } from "../logout-button";

const NAV_ITEMS = [
  { href: "/admin/prenotazioni", label: "Prenotazioni" },
  { href: "/admin/clienti", label: "Clienti" },
  { href: "/admin/date-bloccate", label: "Date bloccate" },
  { href: "/admin/referral", label: "Referral" },
  { href: "/admin/impostazioni", label: "Impostazioni" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between bg-brand px-6 py-4">
        <Logo subtitle="Admin" size="compact" />
        <nav className="flex items-center gap-5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-foreground/80 hover:text-brand-foreground"
            >
              {item.label}
            </Link>
          ))}
          <LogoutButton />
        </nav>
      </header>
      <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
    </div>
  );
}
