import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./styles.css";

export const metadata: Metadata = {
  title: "Reflexive Graduation Market",
  description: "Trade the probability a launch graduates."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/">
            Forecast.fun
          </Link>
          <nav>
            <Link href="/launch">Launch</Link>
            <Link href="/profile">Profile</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
