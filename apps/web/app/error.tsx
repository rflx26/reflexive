"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page narrow">
      <section className="panel glass panel-stack">
        <p className="eyebrow">Unavailable</p>
        <h1>Can&apos;t reach market data</h1>
        <p className="muted">
          The read API didn&apos;t respond. Check that it&apos;s running on port 4000, then retry.
        </p>
        <button type="button" onClick={reset}>
          Retry
        </button>
      </section>
    </main>
  );
}
