const TRIPADVISOR_URL =
  "https://www.tripadvisor.it/UserReviewEdit-g187826-d33373458-Hey_Restaurant-Rapallo_Italian_Riviera_Liguria.html";

export function TripAdvisorButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={TRIPADVISOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-md border border-brand/20 px-4 py-2 text-center text-sm font-semibold text-brand ${className}`}
    >
      Aiutaci anche con una recensione su TripAdvisor
    </a>
  );
}
