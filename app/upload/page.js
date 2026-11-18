"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { submitResource } from "@/lib/firestore";
import { SUBJECTS, TRACKS, RESOURCE_TYPES, YEAR_LEVELS } from "@/lib/constants";
import { CLOUDINARY_MAX_FILE_BYTES } from "@/lib/cloudinary";

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subjectCode, setSubjectCode] = useState(SUBJECTS[0].code);
  const [yearLevel, setYearLevel] = useState(YEAR_LEVELS[0]);
  const [resourceType, setResourceType] = useState(RESOURCE_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (loading) {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center font-body text-ink/50">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Log in to file a resource</h1>
        <p className="mt-3 font-body text-ink/60">
          Filing rights are for registered PsyMS members, so we can credit
          your contribution.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100"
        >
          Log in
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Attach a file before filing.");
      return;
    }
    if (file.size > CLOUDINARY_MAX_FILE_BYTES) {
      setError("Keep files under 10MB.");
      return;
    }

    setBusy(true);
    try {
      const subj = SUBJECTS.find((s) => s.code === subjectCode);
      await submitResource({
        file,
        title,
        subjectCode,
        subjectName: subj?.name || "",
        yearLevel,
        resourceType,
        notes,
        user,
      });
      setDone(true);
    } catch (err) {
      setError("Something went wrong while filing. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <span className="font-mono text-xs text-gold-dark">FILED</span>
        <h1 className="mt-2 font-display text-2xl text-ink">
          Sent to moderation.
        </h1>
        <p className="mt-3 font-body text-ink/60">
          The Committee on Academic Matters will review it before it appears
          in the catalog. You&rsquo;ll see it under Browse once it&rsquo;s
          approved.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/browse" className="rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100">
            Go to catalog
          </Link>
          <button
            onClick={() => {
              setDone(false);
              setTitle("");
              setNotes("");
              setFile(null);
            }}
            className="rounded-full border border-ink/25 px-6 py-3 font-body text-sm font-medium text-ink"
          >
            File another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <span className="font-mono text-xs text-ink/50">CONTRIBUTE</span>
      <h1 className="mt-2 font-display text-3xl text-ink">File a resource</h1>
      <p className="mt-2 font-body text-ink/60">
        Notes, reviewers, modules, syllabi, or practice sets — tag it right
        and the next batch will find it.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="font-body text-sm font-medium text-ink" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Abnormal Psych Midterm Reviewer"
            className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="font-body text-sm font-medium text-ink" htmlFor="subject">
              Subject
            </label>
            <select
              id="subject"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
            >
              {TRACKS.map((t) => (
                <optgroup key={t.id} label={t.title}>
                  {SUBJECTS.filter((s) => s.track === t.id).map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} &middot; {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="font-body text-sm font-medium text-ink" htmlFor="yearLevel">
              Year level
            </label>
            <select
              id="yearLevel"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
            >
              {YEAR_LEVELS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="font-body text-sm font-medium text-ink" htmlFor="resourceType">
            Resource type
          </label>
          <select
            id="resourceType"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-body text-sm font-medium text-ink" htmlFor="notes">
            Notes for the moderator (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything the reviewer should know — source, semester, coverage…"
            className="mt-1 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-ink outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="font-body text-sm font-medium text-ink" htmlFor="file">
            File
          </label>
          <input
            id="file"
            type="file"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 w-full rounded-sm border border-dashed border-ink/30 bg-parchment-50 px-3 py-4 font-body text-sm text-ink outline-none file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:font-body file:text-xs file:text-parchment-100"
          />
          <p className="mt-1 font-body text-xs text-ink/45">PDF, DOCX, or image, up to 10MB.</p>
        </div>

        {error && (
          <p className="rounded-sm bg-red-50 px-3 py-2 font-body text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100 transition hover:bg-ink-800 disabled:opacity-60"
        >
          {busy ? "Filing…" : "File this resource"}
        </button>
      </form>
    </div>
  );
}