export function SkillBadge({
  label,
  tone = "matched",
}: {
  label: string;
  tone?: "matched" | "missing";
}) {
  const styles =
    tone === "matched"
      ? "bg-brand-soft text-brand-dark"
      : "bg-orange-50 text-warning";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles}`}>
      {label}
    </span>
  );
}
