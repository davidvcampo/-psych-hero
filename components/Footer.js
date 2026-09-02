export default function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-ink text-parchment-100">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 font-display text-lg">
              <span>Ψ</span>
              <span>Psych Hero</span>
            </div>
            <p className="mt-2 max-w-sm font-body text-sm text-parchment-100/70">
              A subject-catalogued library of notes, reviewers, and modules,
              built by PsyMS members for PsyMS members.
            </p>
          </div>
          <div className="font-body text-sm text-parchment-100/60">
            <p>Psychology Majors&rsquo; Society &mdash; MSU-GSC</p>
            <p className="mt-1 italic">per mentem ad cor, per munus ad animam</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
