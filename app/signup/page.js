"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/firestore";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password needs to be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await ensureUserProfile({ ...cred.user, displayName: name });
      router.push("/browse");
    } catch (err) {
      setError(readableAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <span className="font-mono text-xs text-ink/50">JOIN THE LIBRARY</span>
      <h1 className="mt-2 font-display text-3xl text-ink">Create your Psych Hero account</h1>
      <p className="mt-2 font-body text-sm text-ink/60">
        One account gets you browsing and filing rights.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="font-body text-sm font-medium text-ink" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
            placeholder="Juan Dela Cruz"
          />
        </div>
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
            placeholder="At least 6 characters"
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
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 font-body text-sm text-ink/60">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-ink underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function readableAuthError(err) {
  const code = err?.code || "";
  if (code.includes("email-already-in-use")) {
    return "An account already exists with that email — try logging in instead.";
  }
  if (code.includes("invalid-email")) {
    return "That email address doesn't look right.";
  }
  return "Couldn't create your account. Check your details and try again.";
}
