import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Logo } from "../components/Logo";
import { ErrorState } from "../components/StatusStates";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: { fullName?: string; email?: string; password?: string } = {};
    if (!fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await register(fullName.trim(), email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-extrabold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start by uploading a resume and running your first analysis.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          {submitError ? <ErrorState message={submitError} /> : null}
          <Input
            label="Full name"
            name="full_name"
            autoComplete="name"
            value={fullName}
            error={errors.fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Register"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
