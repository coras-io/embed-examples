import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riverside Live - Coras Embed (Next.js embedded example)",
};

// The host app's own chrome: a navbar and footer that stay on every route.
// Coras renders none of this - `chrome: false` in the mount means the SDK
// draws page content only, inside the <main> content region below.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="host-nav">
          <Link className="brand" href="/">
            Riverside Live
          </Link>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/tickets">Tickets</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        {/* The host's content region. Host pages render here; so does Coras. */}
        <main className="host-main">{children}</main>

        <footer className="host-footer">
          © Riverside Live - a host-owned footer
        </footer>
      </body>
    </html>
  );
}
