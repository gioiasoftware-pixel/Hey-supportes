export function DiscountDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-foreground/50 ${className}`}>
      Lo sconto non è cumulabile con altre promozioni o convenzioni in corso (es. sconto riservato
      alla clientela alberghiera).
    </p>
  );
}
