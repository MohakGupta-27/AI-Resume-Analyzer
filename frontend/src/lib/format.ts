export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function displayName(fullName: string | null | undefined, email: string): string {
  return fullName?.trim() || email.split("@")[0];
}
