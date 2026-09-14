import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riverside Live - Coras Embed (Next.js embedded example)",
};

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

        <main className="host-main">{children}</main>

        <footer className="host-footer">
          © Riverside Live - a host-owned footer
        </footer>
      </body>
    </html>
  );
}
