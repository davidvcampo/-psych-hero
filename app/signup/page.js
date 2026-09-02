"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/firestore";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

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

  async function handleGoogleSignIn() {
    setError("");
    setGoogleBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await ensureUserProfile(result.user);
      router.push("/browse");
    } catch (err) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("Couldn't sign up with Google. Try again.");
      }
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <span className="font-mono text-xs text-ink/50">JOIN THE LIBRARY</span>
      <h1 className="mt-2 font-display text-3xl text-ink">Create your Psych Hero account</h1>
      <p className="mt-2 font-body text-sm text-ink/60">
        One account gets you browsing and filing rights.
      </p>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleBusy}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-parchment-50 px-6 py-3 font-body text-sm font-medium text-ink transition hover:border-ink disabled:opacity-60"
      >
        <GoogleIcon />
        {googleBusy ? "Connecting…" : "Continue with Google"}
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/15" />
        <span className="font-mono text-xs text-ink/40">OR</span>
        <div className="h-px flex-1 bg-ink/15" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
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