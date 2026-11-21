"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getResource } from "@/lib/firestore";
import { getResourceFiles, isImageFile } from "@/lib/constants";

function LessonContent() {
  const id = useSearchParams().get("id");
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getResource(id).then((r) => {
      setResource(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-5 py-24 text-center font-body text-sm text-ink/50">Opening the lesson…</div>;
  }

  if (!resource) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">This lesson isn&rsquo;t available.</h1>
        <p className="mt-3 font-body text-ink/60">
          It may still be waiting for moderation, or the link is wrong.
        </p>
        <Link href="/#folders" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100">
          Back to the subject folders
        </Link>
      </div>
    );
  }

  const files = getResourceFiles(resource);
  const images = files.filter(isImageFile);
  const documents = files.filter((f) => !isImageFile(f));
  const posted = resource.createdAt?.toDate
    ? resource.createdAt.toDate().toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })
    : "";

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Link
        href={`/browse?subject=${encodeURIComponent(resource.subjectCode)}`}
        className="font-body text-sm text-ink/60 hover:text-ink"
      >
        &larr; {resource.subjectCode} folder
      </Link>

      {resource.status && resource.status !== "approved" && (
        <p className="mt-4 rounded-sm bg-gold/15 px-3 py-2 font-body text-sm text-ink">
          Moderator preview. This lesson isn&rsquo;t public yet.
        </p>
      )}

      <h1 className="mt-3 font-display text-3xl text-ink">{resource.title}</h1>
      <p className="mt-2 font-body text-ink/60">
        {resource.subjectCode} &middot; {resource.subjectName} &middot; {resource.yearLevel} &middot; {resource.resourceType}
      </p>
      <p className="mt-1 font-body text-sm text-ink/45">
        Filed by {resource.uploaderName}{posted ? ` on ${posted}` : ""} &middot; {files.length} files
      </p>

      {documents.length > 0 && (
        <ul className="mt-8 space-y-2">
          {documents.map((f, i) => (
            <li key={`${f.url}-${i}`}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-sm border border-ink/15 bg-parchment-50 px-4 py-3 font-body text-sm text-ink hover:border-ink/50"
              >
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 text-ink/50">Open</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {images.length > 0 && (
        <div className="mt-8 space-y-6">
          {images.map((f, i) => (
            <figure key={`${f.url}-${i}`}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.url}
                  alt={`${resource.title}, page ${i + 1} of ${images.length}`}
                  loading="lazy"
                  className="w-full rounded-sm border border-ink/15 bg-parchment-50"
                />
              </a>
              <figcaption className="mt-1 font-body text-xs text-ink/45">
                {i + 1} of {images.length} &middot; {f.name}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-24 text-center font-body text-sm text-ink/50">Opening the lesson…</div>}>
      <LessonContent />
    </Suspense>
  );
}
