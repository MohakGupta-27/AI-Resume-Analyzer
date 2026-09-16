export function AnalysisScore({ score }: { score: number | null }) {
  const value = score == null ? null : Math.max(0, Math.min(100, Math.round(score)));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset =
    value == null ? circumference : circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e7f4f2" strokeWidth="12" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#0f766e"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-ink">
            {value == null ? "—" : value}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Score
          </span>
        </div>
      </div>
    </div>
  );
}
