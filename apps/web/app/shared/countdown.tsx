"use client";

import { useEffect, useState } from "react";
import { timeRemaining } from "../lib/format";

export function Countdown({ expiryTs, className }: { expiryTs: string; className?: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className={className} dateTime={expiryTs} suppressHydrationWarning>
      {timeRemaining(expiryTs, now)}
    </time>
  );
}
