import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

export function LandingPage() {
  return (
    <div className="min-h-svh bg-canvas">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          AI resume analyzer
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          See how well your resume matches the job.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
          Upload a PDF, optionally add a job description, and get a clear score,
          matched skills, missing skills, and practical suggestions.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark sm:w-auto"
          >
            Create a free account
          </Link>
          <Link
            to="/login"
            className="w-full rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-brand-soft sm:w-auto"
          >
            I already have an account
          </Link>
        </div>

        <ol className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          {[
            { step: "1", title: "Upload", text: "Add a PDF resume. We extract the text automatically." },
            { step: "2", title: "Choose a job", text: "Paste a job description, or skip this if you want a general review." },
            { step: "3", title: "Understand the gaps", text: "Review your score, skills, and what to improve next." },
          ].map((item) => (
            <li key={item.step} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-brand">
                Step {item.step}
              </span>
              <h2 className="mt-2 text-lg font-bold text-ink">{item.title}</h2>
              <p className="mt-1 text-sm text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
