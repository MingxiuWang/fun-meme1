"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FLAIR: Record<number, string> = {
  1: "war crime",
  2: "biohazard",
  3: "rough",
  4: "questionable",
  5: "mid",
  6: "fine, i guess",
  7: "solid",
  8: "great",
  9: "elite",
  10: "porcelain throne",
};

export function ScorePicker({
  name = "score",
  defaultValue = 7,
}: {
  name?: string;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = n === value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setValue(n)}
              className={cn(
                "h-10 w-10 rounded-md border text-sm font-bold transition",
                active
                  ? "bg-amber-400 text-zinc-950 border-amber-300 scale-110"
                  : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500",
              )}
              aria-label={`Score ${n}: ${FLAIR[n]}`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-sm text-zinc-400">
        <span className="font-mono text-amber-400">{value}/10</span> ·{" "}
        <span className="italic">{FLAIR[value]}</span>
      </div>
    </div>
  );
}
