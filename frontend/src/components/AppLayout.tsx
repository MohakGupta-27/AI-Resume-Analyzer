import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { displayName } from "../lib/format";
import { Button } from "./Button";
import { Logo } from "./Logo";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/resumes", label: "Resumes" },
  { to: "/job-descriptions", label: "Job descriptions" },
  { to: "/analyze", label: "Analyze" },
  { to: "/analyses", label: "History" },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const name = user ? displayName(user.full_name, user.email) : "";

  return (
    <div className="min-h-svh bg-canvas">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[16.5rem] flex-col border-r border-line bg-white px-4 py-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Logo to="/dashboard" />
        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  isActive ? "bg-brand-soft text-brand-dark" : "text-muted hover:bg-canvas hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="rounded-2xl bg-canvas p-3">
          <p className="truncate text-sm font-bold text-ink">{name}</p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
          <Button variant="ghost" className="mt-2 w-full" onClick={logout}>
            Log out
          </Button>
        </div>
      </aside>

      <div className="lg:pl-[16.5rem]">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <Logo compact to="/dashboard" />
          <button
            type="button"
            className="rounded-xl border border-line px-3 py-2 text-sm font-semibold"
            aria-expanded={open}
            aria-controls="app-sidebar"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
