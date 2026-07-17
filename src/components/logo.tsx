export function Logo({
  subtitle = "Supporters",
  size = "hero",
}: {
  subtitle?: string;
  size?: "hero" | "compact";
}) {
  if (size === "compact") {
    return (
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-16 items-center justify-center rounded-md bg-brand text-lg font-extrabold tracking-tight text-brand-foreground">
          HEY
        </span>
        {subtitle && (
          <span className="text-sm font-medium uppercase tracking-widest text-brand-foreground/70">
            {subtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-6xl font-extrabold tracking-tight text-foreground">HEY</span>
      {subtitle && (
        <span className="text-sm font-medium uppercase tracking-[0.3em] text-foreground/70">
          {subtitle}
        </span>
      )}
    </div>
  );
}
