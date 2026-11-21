"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  subscribePendingResources,
  subscribeApprovedResources,
  approveResource,
  rejectResource,
  removeResource,
  restoreResource,
  subscribeRemovedResources,
  deleteRemovedResource,
} from "@/lib/firestore";
import { getResourceFiles } from "@/lib/constants";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [publishedSearch, setPublishedSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (profile?.role !== "moderator") return;
    const unsubPending = subscribePendingResources(setPending);
    const unsubPublished = subscribeApprovedResources(setPublished);
    const unsubRemoved = subscribeRemovedResources(setRemoved);
    return () => {
      unsubPending();
      unsubPublished();
      unsubRemoved();
    };
  }, [profile]);

  if (loading) {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center font-body text-ink/50">Loading…</div>;
  }

  if (!user || profile?.role !== "moderator") {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Moderators only</h1>
        <p className="mt-3 font-body text-ink/60">
          This queue is for Committee on Academic Matters members. Ask a
          current admin to set your account role to{" "}
          <code className="rounded bg-parchment-100 px-1.5 py-0.5 font-mono text-xs">moderator</code> in
          Firestore.
        </p>
        <Link href="/browse" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100">
          Back to catalog
        </Link>
      </div>
    );
  }

  async function handleApprove(r) {
    setBusyId(r.id);
    try {
      await approveResource(r.id, r.uploaderUid);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(r) {
    const reason = window.prompt("Reason for rejecting (shown to no one yet, logged for reference):", "");
    if (reason === null) return;
    setBusyId(r.id);
    try {
      await rejectResource(r.id, reason);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(r) {
    const ok = window.confirm(
      `Remove "${r.title}" from the site? It will disappear from the catalog right away.`
    );
    if (!ok) return;
    setBusyId(r.id);
    try {
      await removeResource(r.id, r.uploaderUid);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRestore(r) {
    setBusyId(r.id);
    try {
      await restoreResource(r.id, r.uploaderUid);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteRecord(r) {
    const ok = window.confirm(
      `Delete "${r.title}" from this list for good?\n\nThis can't be undone. The file itself stays in Cloudinary until you delete it there.`
    );
    if (!ok) return;
    setBusyId(r.id);
    try {
      await deleteRemovedResource(r.id);
    } catch (err) {
      window.alert("Couldn't delete it. Nothing was changed.");
    } finally {
      setBusyId(null);
    }
  }

  const publishedShown = published.filter((r) =>
    `${r.title} ${r.subjectCode} ${r.subjectName} ${r.uploaderName}`
      .toLowerCase()
      .includes(publishedSearch.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <span className="font-mono text-xs text-gold-dark">MODERATION QUEUE</span>
      <h1 className="mt-2 font-display text-3xl text-ink">Pending submissions</h1>
      <p className="mt-2 font-body text-ink/60">
        {pending.length} waiting for review.
      </p>

      <div className="mt-8 space-y-4">
        {pending.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/25 px-6 py-12 text-center font-body text-sm text-ink/50">
            Queue is clear.
          </p>
        )}

        {pending.map((r) => (
          <div key={r.id} className="rounded-sm border border-ink/15 bg-parchment-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="rounded-sm bg-ink px-2 py-0.5 font-mono text-[11px] text-parchment-100">
                  {r.subjectCode}
                </span>
                <h3 className="mt-2 font-display text-lg text-ink">{r.title}</h3>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {r.resourceType} &middot; {r.yearLevel} &middot; filed by {r.uploaderName}
                </p>
                {r.notes && (
                  <p className="mt-2 font-body text-sm italic text-ink/50">&ldquo;{r.notes}&rdquo;</p>
                )}
              </div>
              {getResourceFiles(r).length > 1 ? (
                <Link
                  href={`/lesson?id=${r.id}`}
                  target="_blank"
                  className="rounded-full border border-ink/25 px-4 py-1.5 font-body text-xs text-ink hover:border-ink"
                >
                  Preview lesson ({getResourceFiles(r).length} files)
                </Link>
              ) : (
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ink/25 px-4 py-1.5 font-body text-xs text-ink hover:border-ink"
                >
                  Preview file
                </a>
              )}
            </div>

            <div className="mt-4 flex gap-3 border-t border-dashed border-ink/15 pt-4">
              <button
                onClick={() => handleApprove(r)}
                disabled={busyId === r.id}
                className="rounded-full bg-ink px-5 py-2 font-body text-xs font-medium text-parchment-100 disabled:opacity-60"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(r)}
                disabled={busyId === r.id}
                className="rounded-full border border-ink/25 px-5 py-2 font-body text-xs font-medium text-ink disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-2xl text-ink">Published</h2>
      <p className="mt-2 font-body text-ink/60">
        {published.length} on the site. Remove anything you don&rsquo;t want there anymore.
      </p>
      <input
        type="text"
        value={publishedSearch}
        onChange={(e) => setPublishedSearch(e.target.value)}
        placeholder="Search published files by title, subject, or name…"
        className="mt-4 w-full rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-sm text-ink outline-none focus:border-ink"
      />

      <div className="mt-6 space-y-3">
        {publishedShown.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/25 px-6 py-8 text-center font-body text-sm text-ink/50">
            Nothing matches.
          </p>
        )}
        {publishedShown.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/15 bg-parchment-50 px-5 py-4"
          >
            <div className="min-w-0">
              <span className="rounded-sm bg-ink px-2 py-0.5 font-mono text-[11px] text-parchment-100">
                {r.subjectCode}
              </span>
              <p className="mt-2 truncate font-display text-base text-ink">{r.title}</p>
              <p className="font-body text-xs text-ink/55">
                {r.resourceType} &middot; {r.yearLevel} &middot; filed by {r.uploaderName}
                {getResourceFiles(r).length > 1 ? ` · ${getResourceFiles(r).length} files` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRemove(r)}
                disabled={busyId === r.id}
                className="rounded-full border border-ink/25 px-4 py-1.5 font-body text-xs font-medium text-ink hover:border-ink disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-2xl text-ink">Removed</h2>
      <p className="mt-2 max-w-xl font-body text-ink/60">
        Hidden from the site but still stored. Restore one to publish it again, or delete the record for good. Files stay in Cloudinary until you delete them there.
      </p>

      <div className="mt-6 space-y-3">
        {removed.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/25 px-6 py-8 text-center font-body text-sm text-ink/50">
            Nothing removed.
          </p>
        )}
        {removed.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/15 bg-parchment-50 px-5 py-4"
          >
            <div className="min-w-0">
              <span className="rounded-sm bg-ink/60 px-2 py-0.5 font-mono text-[11px] text-parchment-100">
                {r.subjectCode}
              </span>
              <p className="mt-2 truncate font-display text-base text-ink">{r.title}</p>
              <p className="font-body text-xs text-ink/55">
                {r.resourceType} &middot; {r.yearLevel} &middot; filed by {r.uploaderName}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRestore(r)}
                disabled={busyId === r.id}
                className="rounded-full border border-ink/25 px-4 py-1.5 font-body text-xs font-medium text-ink hover:border-ink disabled:opacity-60"
              >
                Restore
              </button>
              <button
                onClick={() => handleDeleteRecord(r)}
                disabled={busyId === r.id}
                className="rounded-full border border-red-300 px-4 py-1.5 font-body text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
