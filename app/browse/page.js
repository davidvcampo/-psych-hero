"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeApprovedResources } from "@/lib/firestore";
import { SUBJECTS, RESOURCE_TYPES, YEAR_LEVELS } from "@/lib/constants";
import ResourceCard from "@/components/ResourceCard";

export default function BrowsePage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState("all");
  const [yearLevel, setYearLevel] = useState("all");
  const [resourceType, setResourceType] = useState("all");

  useEffect(() => {
    const unsub = subscribeApprovedResources((docs) => {
      setResources(docs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const subj = SUBJECTS.find((s) => s.code === r.subjectCode);
      if (track !== "all" && subj?.track !== track) return false;
      if (yearLevel !== "all" && r.yearLevel !== yearLevel) return false;
      if (resourceType !== "all" && r.resourceType !== resourceType) return false;
      if (search) {
        const haystack = `${r.title} ${r.subjectCode} ${r.subjectName}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [resources, track, yearLevel, resourceType, search]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <span className="font-mono text-xs text-ink/50">THE CATALOG</span>
      <h1 className="mt-2 font-display text-3xl text-ink">Browse resources</h1>
      <p className="mt-2 max-w-lg font-body text-ink/60">
        Every card here has passed moderation. Search by title or subject, or
        narrow it down with the filters.
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
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          className="rounded-sm border border-ink/20 bg-parchment-50 px-3 py-2 font-body text-sm text-ink outline-none focus:border-ink"
        >
          <option value="all">All tracks</option>
          <option value="major">Psych major</option>
          <option value="ge">General education</option>
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
              Be the first to add a resource for this subject.
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
