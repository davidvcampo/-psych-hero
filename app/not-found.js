import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <span className="font-mono text-xs text-ink/50">CARD NOT FOUND</span>
      <h1 className="mt-2 font-display text-3xl text-ink">
        Nothing filed under that call number.
      </h1>
      <p className="mt-3 font-body text-ink/60">
        The page you&rsquo;re looking for isn&rsquo;t in the catalog.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-ink px-6 py-3 font-body text-sm font-medium text-parchment-100"
      >
        Back to the shelf
      </Link>
    </div>
  );
}
