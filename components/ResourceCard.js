"use client";

export default function ResourceCard({ resource }) {
  const posted = resource.createdAt?.toDate
    ? resource.createdAt.toDate().toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })
    : "";

  return (
    <a
      href={resource.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-sm border border-ink/15 bg-parchment-50 p-5 shadow-[3px_3px_0_0_rgba(27,42,74,0.12)] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(27,42,74,0.18)]"
    >
      {/* punch hole, catalog-card signature */}
      <span className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full border border-ink/25 bg-parchment-100" />

      <div className="flex items-start justify-between pl-4">
        <span className="rounded-sm bg-ink px-2 py-0.5 font-mono text-[11px] tracking-wide text-parchment-100">
          {resource.subjectCode}
        </span>
        <span className="font-mono text-[11px] text-ink/50">{resource.resourceType}</span>
      </div>

      <h3 className="mt-3 pl-4 font-display text-lg leading-snug text-ink">
        {resource.title}
      </h3>

      <p className="mt-1 pl-4 font-body text-sm text-ink/60">{resource.subjectName}</p>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/20 pl-4 pt-3 font-body text-xs text-ink/50">
        <span>{resource.yearLevel}</span>
        <span>Filed by {resource.uploaderName}{posted ? ` · ${posted}` : ""}</span>
      </div>
    </a>
  );
}
