import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page narrow">
      <section className="panel glass panel-stack">
        <p className="eyebrow">404</p>
        <h1>No market here</h1>
        <p className="muted">The launch may not exist yet, or the link is wrong.</p>
        <Link className="button" href="/">
          Back to markets
        </Link>
      </section>
    </main>
  );
}
