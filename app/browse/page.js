"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { subscribeApprovedResources } from "@/lib/firestore";
import { SUBJECTS, TRACKS, RESOURCE_TYPES, YEAR_LEVELS } from "@/lib/constants";
import ResourceCard from "@/components/ResourceCard";

function BrowseContent() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject") || "all";
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState(subjectParam);
  const [yearLevel, setYearLevel] = useState("all");
  const [resourceType, setResourceType] = useState("all");

  // Opening a folder from the homepage arrives as /browse?subject=PSY%20100
  useEffect(() => {
    setSubject(subjectParam);
  }, [subjectParam]);

  useEffect(() => {
    const unsub = subscribeApprovedResources((docs) => {
      setResources(docs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (subject !== "all" && r.subjectCode !== subject) return false;
      if (yearLevel !== "all" && r.yearLevel !== yearLevel) return false;
      if (resourceType !== "all" && r.resourceType !== resourceType) return false;
      if (search) {
        const haystack = `${r.title} ${r.subjectCode} ${r.subjectName}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [resources, subject, yearLevel, resourceType, search]);

  const selected = SUBJECTS.find((s) => s.code === subject);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/#folders" className="font-body text-sm text-ink/60 hover:text-ink">
        &larr; All subject folders
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">
        {selected ? `${selected.code} · ${selected.name}` : "Browse resources"}
      </h1>
      <p className="mt-2 max-w-lg font-body text-ink/60">
        {selected
          ? "Everything filed under this subject. Use the filters to narrow it down."
          : "Every card here has passed moderation. Search by title or subject, or narrow it down with the filters."}
      </p>

      {/* Filters */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or subject code…"
          className="rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-sm text-ink outline-none focus:border-ink lg:col-span-1"
        />
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-sm text-ink outline-none focus:border-ink"
        >
          <option value="all">All subjects</option>
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
        <select
          value={yearLevel}
          onChange={(e) => setYearLevel(e.target.value)}
          className="rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-sm text-ink outline-none focus:border-ink"
        >
          <option value="all">All year levels</option>
          {YEAR_LEVELS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-sm text-ink outline-none focus:border-ink"
        >
          <option value="all">All types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mt-10">
        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading the catalog…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-dashed border-ink/25 px-6 py-16 text-center">
            <p className="font-display text-lg text-ink">Nothing filed here yet.</p>
            <p className="mt-2 font-body text-sm text-ink/60">
              Be the first to add a resource here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-14 font-body text-sm text-ink/50">Loading the catalog…</div>}>
      <BrowseContent />
    </Suspense>
  );
}
