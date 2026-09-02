"use client";

import { useEffect, useState } from "react";
import { subscribeTopContributors } from "@/lib/firestore";

export default function SpotlightPage() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeTopContributors((list) => {
      setContributors(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <span className="font-mono text-xs text-gold-dark">PSYCOOLOGY: ENGAGE SPOTLIGHT</span>
      <h1 className="mt-2 font-display text-3xl text-ink">Contributor spotlight</h1>
      <p className="mt-2 font-body text-ink/60">
        Every approved filing counts toward this list. These are the members
        keeping the shelf stocked.
      </p>

      <div className="mt-10">
        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading…</p>
        ) : contributors.length === 0 ? (
          <div className="rounded-sm border border-dashed border-ink/25 px-6 py-16 text-center">
            <p className="font-display text-lg text-ink">No spotlight yet.</p>
            <p className="mt-2 font-body text-sm text-ink/60">
              The first approved resource earns the first spot.
            </p>
          </div>
        ) : (
          <ol className="space-y-3">
            {contributors.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-sm border border-ink/15 bg-parchment-50 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-xl text-gold-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body font-medium text-ink">{c.name}</span>
                </div>
                <span className="font-mono text-xs text-ink/50">
                  {c.approvedUploads} filed
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
