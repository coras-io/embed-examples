import Link from "next/link";

export default function HomePage() {
  return (
    <article className="host-page">
      <h1>What&apos;s on</h1>
      <p>
        Live music and events all year round.{" "}
        <Link href="/tickets">Browse tickets →</Link>
      </p>
    </article>
  );
}
