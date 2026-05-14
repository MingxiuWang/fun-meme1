"use client";

import { useEffect, useState } from "react";
import { getDeadlineSnapshot, type DeadlineSnapshot } from "@/lib/deadline";

type Props = {
  headline: string;
  daysLeftTemplate: string;
  ended: string;
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
  progressLabel: string;
};

export function CountdownBanner({
  headline,
  daysLeftTemplate,
  ended,
  daysLabel,
  hoursLabel,
  minutesLabel,
  secondsLabel,
  progressLabel,
}: Props) {
  const [snap, setSnap] = useState<DeadlineSnapshot>(() => getDeadlineSnapshot());

  useEffect(() => {
    setSnap(getDeadlineSnapshot());
    const id = setInterval(() => setSnap(getDeadlineSnapshot()), 1000);
    return () => clearInterval(id);
  }, []);

  if (snap.ended) {
    return (
      <div className="mb-8 rounded-2xl border border-zinc-700 bg-zinc-900/70 px-4 py-6 text-center shadow-[0_0_40px_-20px_rgba(244,114,182,0.4)]">
        <p className="text-base sm:text-lg font-black tracking-tight text-zinc-200">
          {ended}
        </p>
      </div>
    );
  }

  const pct = Math.round(snap.progress * 100);
  const dayLine = daysLeftTemplate.replace("{n}", String(snap.days));

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-400/60 bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-fuchsia-600/30 p-4 sm:p-5 shadow-[0_0_50px_-20px_rgba(251,191,36,0.6)]">
      <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-amber-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-fuchsia-500/25 blur-3xl" />

      <div className="relative">
        <p className="max-w-3xl text-sm sm:text-lg md:text-xl font-black leading-tight tracking-tight text-amber-100 drop-shadow-[0_0_14px_rgba(251,191,36,0.5)]">
          <span className="mr-1.5 inline-block animate-bounce text-base sm:text-xl">🚽</span>
          {headline}
        </p>

        <p className="mt-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-amber-300/80">
          {dayLine}
        </p>

        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2.5">
          <TimeUnit value={snap.days} label={daysLabel} hero />
          <TimeUnit value={snap.hours} label={hoursLabel} />
          <TimeUnit value={snap.minutes} label={minutesLabel} />
          <TimeUnit value={snap.seconds} label={secondsLabel} pulse />
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-amber-300/80">
            <span>{progressLabel}</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="relative h-2.5 sm:h-3.5 w-full overflow-hidden rounded-full border border-amber-400/50 bg-zinc-950 shadow-inner">
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-gradient-to-r from-amber-400 via-orange-400 to-fuchsia-500 transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent 0 8px, rgba(255,255,255,0.25) 8px 14px)",
                  animation: "bar-shimmer 1.2s linear infinite",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({
  value,
  label,
  hero,
  pulse,
}: {
  value: number;
  label: string;
  hero?: boolean;
  pulse?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div
        className={
          hero
            ? "w-full rounded-xl border border-amber-300/70 bg-zinc-950/85 px-1 py-1.5 sm:py-2 text-center font-mono font-black tabular-nums text-2xl sm:text-4xl md:text-5xl leading-none text-amber-300"
            : "w-full rounded-lg border border-zinc-700/70 bg-zinc-950/70 px-1 py-1.5 text-center font-mono font-bold tabular-nums text-base sm:text-2xl md:text-3xl leading-none text-zinc-100"
        }
        style={
          hero
            ? { animation: "countdown-glow 2.4s ease-in-out infinite" }
            : undefined
        }
      >
        <span className={pulse ? "inline-block animate-pulse" : undefined}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        className={
          hero
            ? "mt-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-amber-200"
            : "mt-1 text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400"
        }
      >
        {label}
      </span>
    </div>
  );
}
