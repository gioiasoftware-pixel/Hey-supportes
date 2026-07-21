export function KpiCard({
  label,
  value,
  obiettivo,
  raggiunto,
}: {
  label: string;
  value: string;
  obiettivo?: string;
  raggiunto?: boolean;
}) {
  return (
    <div className="rounded-lg border border-brand/20 p-4">
      <p className="text-sm text-brand/70">{label}</p>
      <p className="text-2xl font-bold text-brand">{value}</p>
      {obiettivo && (
        <p className={`mt-1 text-xs ${raggiunto ? "text-green-700" : "text-brand/50"}`}>
          Obiettivo: {obiettivo} {raggiunto ? "✓ raggiunto" : ""}
        </p>
      )}
    </div>
  );
}
