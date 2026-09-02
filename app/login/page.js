"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/browse");
    } catch (err) {
      setError(readableAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <span className="font-mono text-xs text-ink/50">WELCOME BACK</span>
      <h1 className="mt-2 font-display text-3xl text-ink">Log in to Psych Hero</h1>
      <p className="mt-2 font-body text-sm text-ink/60">
        Use the account you registered with PsyMS.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="font-body text-sm font-medium text-ink" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
            placeholder="you@msugensan.edu.ph"
          />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-ink" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-sm bg-red-50 px-3 py-2 font-body text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100 transition hover:bg-ink-800 disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 font-body text-sm text-ink/60">
        New here?{" "}
        <Link href="/signup" className="font-medium text-ink underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function readableAuthError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "That email and password don't match our records.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Wait a moment and try again.";
  }
  return "Couldn't log you in. Check your details and try again.";
}
