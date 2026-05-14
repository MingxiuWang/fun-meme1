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
      <div className="mb-10 rounded-3xl border-2 border-zinc-700 bg-zinc-900/70 px-6 py-10 text-center shadow-[0_0_60px_-20px_rgba(244,114,182,0.4)]">
        <p className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-200">
          {ended}
        </p>
      </div>
    );
  }

  const pct = Math.round(snap.progress * 100);
  const dayLine = daysLeftTemplate.replace("{n}", String(snap.days));

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-fuchsia-600/30 p-6 sm:p-8 shadow-[0_0_80px_-20px_rgba(251,191,36,0.7)]">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />

      <div className="relative">
        <p className="max-w-3xl text-xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-amber-100 drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]">
          <span className="mr-2 inline-block animate-bounce">🚽</span>
          {headline}
        </p>

        <p className="mt-2 text-sm sm:text-base font-mono uppercase tracking-[0.25em] text-amber-300/80">
          {dayLine}
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
          <TimeUnit value={snap.days} label={daysLabel} hero />
          <TimeUnit value={snap.hours} label={hoursLabel} />
          <TimeUnit value={snap.minutes} label={minutesLabel} />
          <TimeUnit value={snap.seconds} label={secondsLabel} pulse />
        </div>

        <div className="mt-7">
          <div className="mb-1.5 flex justify-between font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-amber-300/80">
            <span>{progressLabel}</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="relative h-5 sm:h-7 w-full overflow-hidden rounded-full border-2 border-amber-400/50 bg-zinc-950 shadow-inner">
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
            ? "w-full rounded-2xl border-2 border-amber-300/70 bg-zinc-950/85 px-2 py-2 sm:py-3 text-center font-mono font-black tabular-nums text-5xl sm:text-7xl md:text-8xl leading-none text-amber-300"
            : "w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-2 py-2 sm:py-2.5 text-center font-mono font-bold tabular-nums text-2xl sm:text-4xl md:text-5xl leading-none text-zinc-100"
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
            ? "mt-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.35em] text-amber-200"
            : "mt-1.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400"
        }
      >
        {label}
      </span>
    </div>
  );
}
