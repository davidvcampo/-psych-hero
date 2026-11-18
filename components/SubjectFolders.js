"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribeApprovedResources } from "@/lib/firestore";
import { SUBJECTS, TRACKS } from "@/lib/constants";

// Tab color per track, so the two big groups read apart at a glance.
const TAB_STYLE = {
  major: "bg-ink text-parchment-100",
  ge: "bg-gold text-ink-900",
  other: "bg-sky-deep text-parchment-50",
};

function Folder({ subject, count }) {
  return (
    <Link
      href={`/browse?subject=${encodeURIComponent(subject.code)}`}
      className="group relative block pt-6"
    >
      <span
        className={`absolute left-0 top-0 rounded-t-md px-3 py-1 font-mono text-[11px] tracking-wide ${TAB_STYLE[subject.track]}`}
      >
        {subject.code}
      </span>
      <div className="flex min-h-[116px] flex-col justify-between rounded-sm rounded-tl-none border border-ink/20 bg-parchment-100 p-4 shadow-[3px_3px_0_0_rgba(27,46,92,0.12)] transition group-hover:border-ink/60 group-hover:bg-parchment-50">
        <p className="line-clamp-3 font-display text-base leading-snug text-ink">
          {subject.name}
        </p>
        <p className="mt-3 font-body text-xs text-ink/55">
          {count === null
            ? " "
            : count === 0
            ? "No files yet"
            : `${count} ${count === 1 ? "file" : "files"}`}
        </p>
      </div>
    </Link>
  );
}

export default function SubjectFolders() {
  // null = still loading, so we don't flash "No files yet" on every folder.
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const unsub = subscribeApprovedResources((docs) => {
      const next = {};
      docs.forEach((d) => {
        next[d.subjectCode] = (next[d.subjectCode] || 0) + 1;
      });
      setCounts(next);
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-12">
      {TRACKS.map((t) => {
        const subjects = SUBJECTS.filter((s) => s.track === t.id);
        if (subjects.length === 0) return null;
        return (
          <div key={t.id}>
            <h3 className="font-display text-lg text-ink">{t.title}</h3>
            <div className="mt-4 grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((s) => (
                <Folder
                  key={s.code}
                  subject={s}
                  count={counts === null ? null : counts[s.code] || 0}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
