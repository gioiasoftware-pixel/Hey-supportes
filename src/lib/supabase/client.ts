import { createBrowserClient } from "@supabase/ssr";

// Non tipizzato con Database: i tipi hand-rolled in lib/types.ts confondono
// l'inferenza dei generics di supabase-js. Quando il progetto Supabase è
// connesso, generare i tipi reali con `supabase gen types typescript` e
// ripristinare `createBrowserClient<Database>(...)`.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
