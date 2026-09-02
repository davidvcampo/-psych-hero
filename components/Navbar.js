"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/upload", label: "Contribute" },
  { href: "/spotlight", label: "Spotlight" },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-parchment-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold bg-ink font-display text-lg text-parchment-100">
            Ψ
          </span>
          <span className="font-display text-xl tracking-tight text-ink">
            Psych Hero
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-body text-sm font-medium text-ink/70 transition hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          {profile?.role === "moderator" && (
            <Link
              href="/admin"
              className="font-body text-sm font-medium text-gold-dark transition hover:text-ink"
            >
              Moderation
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <span className="font-mono text-xs text-ink/60">
                {profile?.name || user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded-full border border-ink/20 px-4 py-1.5 font-body text-sm text-ink transition hover:bg-ink hover:text-parchment-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-body text-sm font-medium text-ink/70 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-ink px-4 py-1.5 font-body text-sm text-parchment-100 transition hover:bg-ink-800"
              >
                Join PsychHero
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="font-body text-ink">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-900/10 bg-parchment-50 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-body text-ink/80">
                {l.label}
              </Link>
            ))}
            {profile?.role === "moderator" && (
              <Link href="/admin" onClick={() => setOpen(false)} className="font-body text-gold-dark">
                Moderation
              </Link>
            )}
            <div className="mt-2 border-t border-ink-900/10 pt-4">
              {user ? (
                <button onClick={signOut} className="font-body text-ink/80">
                  Log out ({profile?.name || user.email})
                </button>
              ) : (
                <div className="flex gap-4">
                  <Link href="/login" onClick={() => setOpen(false)} className="font-body text-ink/80">
                    Log in
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="font-body text-ink">
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
