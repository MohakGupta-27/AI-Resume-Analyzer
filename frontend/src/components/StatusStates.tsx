export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-line bg-white px-4 py-16 text-sm font-medium text-muted">
      <span className="mr-3 inline-block h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand" />
      {label}
    </div>
  );
}

import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger"
    >
      {message}
    </div>
  );
}

export function SuccessState({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-emerald-200 bg-brand-soft px-4 py-3 text-sm text-brand-dark"
    >
      {message}
    </div>
  );
}
