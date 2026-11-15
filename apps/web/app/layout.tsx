import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import "./styles.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Reflexive",
  description: "Trade the probability a launch graduates.",
  icons: { icon: "/logo.png" }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <header className="topbar">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" />
            Reflexive
          </Link>
          <nav>
            <Link href="/">Markets</Link>
            <Link href="/launch">Launch</Link>
            <Link href="/profile">Profile</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
