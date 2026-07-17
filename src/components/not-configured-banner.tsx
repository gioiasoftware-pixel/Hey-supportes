export function NotConfiguredBanner() {
  return (
    <div className="rounded-md border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand/70">
      Supabase non è ancora connesso (.env.local vuoto): questa è un&apos;anteprima con dati
      vuoti, l&apos;accesso admin è aperto senza login finché manca la configurazione.
    </div>
  );
}
