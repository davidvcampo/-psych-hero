import Link from "next/link";
import SubjectFolders from "@/components/SubjectFolders";

const steps = [
  {
    n: "01",
    title: "File it",
    body: "Upload your notes, reviewer, or module and tag it with the right subject code and year level — takes under two minutes.",
  },
  {
    n: "02",
    title: "It gets reviewed",
    body: "The Committee on Academic Matters checks each submission for relevance and accuracy before it goes public.",
  },
  {
    n: "03",
    title: "It joins the shelf",
    body: "Approved resources are catalogued and searchable by every PsyMS member, from freshmen to seniors.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero: a catalog drawer of tabbed cards */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-parchment-50">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-block rounded-sm border border-ink/20 bg-parchment-100 px-3 py-1 font-mono text-xs tracking-wide text-ink/70">
              PSYMS · COMMITTEE ON ACADEMIC MATTERS
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
              A shelf of notes and reviewers, catalogued by course.
            </h1>
            <p className="mt-5 max-w-md font-body text-ink/70">
              Psych Hero is where PsyMS keeps the reviewers, modules, and
              notes that used to live scattered across group chats and hard
              drives — organized by subject code, filed by students, and
              open to every year level.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#folders"
                className="rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100 transition hover:bg-ink-800"
              >
                Open a subject folder
              </a>
              <Link
                href="/browse"
                className="rounded-full border border-ink/25 px-6 py-3 font-body text-sm font-medium text-ink transition hover:border-ink"
              >
                Search the catalog
              </Link>
              <Link
                href="/upload"
                className="rounded-full border border-ink/25 px-6 py-3 font-body text-sm font-medium text-ink transition hover:border-ink"
              >
                File a resource
              </Link>
            </div>
          </div>

          {/* Signature visual: a fanned stack of catalog cards */}
          <div className="relative mx-auto h-72 w-full max-w-sm">
            {[
              { code: "PSY 105", label: "Abnormal Psych Reviewer", rot: "-rotate-6", z: "z-10", y: "translate-y-6" },
              { code: "PSY 101", label: "Stats Formula Sheet", rot: "rotate-2", z: "z-20", y: "translate-y-2" },
              { code: "GEC 101", label: "Understanding the Self Notes", rot: "-rotate-1", z: "z-30", y: "translate-y-0" },
            ].map((c) => (
              <div
                key={c.code}
                className={`absolute inset-x-6 top-4 ${c.rot} ${c.z} ${c.y} rounded-sm border border-ink/15 bg-parchment-100 p-5 shadow-[4px_4px_0_0_rgba(27,46,92,0.15)]`}
              >
                <span className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full border border-ink/25" />
                <span className="ml-3 rounded-sm bg-ink px-2 py-0.5 font-mono text-[11px] text-parchment-100">
                  {c.code}
                </span>
                <p className="ml-3 mt-4 font-display text-base text-ink">{c.label}</p>
                <div className="ml-3 mt-6 border-t border-dashed border-ink/20 pt-2 font-mono text-[10px] text-ink/40">
                  FILED &middot; PSYMS LIBRARY
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject folders */}
      <section id="folders" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-ink">Browse by subject</h2>
            <p className="mt-2 max-w-lg font-body text-ink/65">
              Open a folder to see everything filed under that subject.
            </p>
          </div>
          <Link href="/browse" className="font-body text-sm font-medium text-ink/60 hover:text-ink">
            Rather search? Go to the catalog &rarr;
          </Link>
        </div>
        <div className="mt-10">
          <SubjectFolders />
        </div>
      </section>

      {/* Rationale */}
      <section className="border-t border-ink/10 bg-parchment-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl text-ink">Why this exists</h2>
          </div>
          <div className="md:col-span-2 space-y-4 font-body text-ink/70">
            <p>
              Every batch rebuilds the same reviewers from scratch, because
              the good ones never leave the group chat they were posted in.
              Incoming students start from zero, and continuing students
              lose hours hunting for materials that already exist somewhere
              on someone&rsquo;s drive.
            </p>
            <p>
              Psych Hero consolidates that into one catalogued library —
              covering both Psychology major subjects and the GE courses
              PsyMS members take alongside them — so finding a reviewer is a
              search, not a favor.
            </p>
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbers are earned */}
      <section className="border-y border-ink/10 bg-ink-900 py-20 text-parchment-100">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-2xl">How a submission gets shelved</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="font-display text-3xl text-gold">{s.n}</span>
                <h3 className="mt-3 font-display text-lg">{s.title}</h3>
                <p className="mt-2 font-body text-sm text-parchment-100/65">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="rounded-sm border border-ink/15 bg-parchment-100 p-10 text-center">
          <h2 className="font-display text-2xl text-ink">
            Have a reviewer sitting in your files?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-ink/70">
            File it once, and every batch after yours gets to use it too.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100 transition hover:bg-ink-800"
          >
            File a resource
          </Link>
        </div>
      </section>
    </div>
  );
}
