"use client";

import { useState } from "react";

export function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "HEY Supporters",
          text: "Vieni a cena da HEY: con questo link ottieni il 10% di sconto sul conto!",
          url,
        });
      } catch {
        // l'utente ha annullato la condivisione, non è un errore da mostrare
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="mt-3 w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
    >
      {copied ? "Link copiato!" : "Condividi"}
    </button>
  );
}
