"use client";

import { useEffect, useState } from "react";
import { getDeadlineSnapshot } from "@/lib/deadline";

type Props = {
  headline: string;
  daysLeftTemplate: string;
  ended: string;
};

export function CountdownBanner({ headline, daysLeftTemplate, ended }: Props) {
  const [snap, setSnap] = useState(() => getDeadlineSnapshot());

  useEffect(() => {
    setSnap(getDeadlineSnapshot());
    const id = setInterval(() => setSnap(getDeadlineSnapshot()), 60_000);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round(snap.progress * 100);
  const label = snap.ended
    ? ended
    : daysLeftTemplate.replace("{n}", String(snap.daysLeft));

  return (
    <div className="mb-8 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-400/15 via-amber-300/5 to-fuchsia-500/15 p-5 sm:p-6 shadow-[0_0_30px_-10px_rgba(251,191,36,0.4)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-base sm:text-lg font-black text-amber-200 leading-snug">
          🚽 {headline}
        </p>
        <span className="font-mono text-xs sm:text-sm text-amber-300 tabular-nums">
          {label}
        </span>
      </div>
      <div className="mt-3 h-3 sm:h-4 w-full overflow-hidden rounded-full border border-amber-400/30 bg-zinc-900/70">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-fuchsia-400 transition-[width] duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
