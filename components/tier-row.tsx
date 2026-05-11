import Link from "next/link";
import { TIER_META, type Tier } from "@/lib/tiers";
import type { BathroomWithStats } from "@/lib/db/queries";
import { cn } from "@/lib/utils";

type Props = {
  tier: Tier;
  bathrooms: BathroomWithStats[];
};

export function TierRow({ tier, bathrooms }: Props) {
  const meta = TIER_META[tier];

  return (
    <div className="flex rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-24 sm:w-28 shrink-0 px-3 py-4",
          meta.bg,
          meta.text,
        )}
      >
        <div className="text-5xl sm:text-6xl font-black leading-none">
          {meta.label}
        </div>
        <div className="mt-2 text-[10px] sm:text-xs text-center font-medium opacity-80 leading-tight">
          {meta.tagline}
        </div>
      </div>
      <div className="flex-1 p-3 sm:p-4">
        {bathrooms.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-500 italic">
            empty — nominate one
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {bathrooms.map((b) => (
              <Link
                key={b.id}
                href={`/b/${b.id}`}
                className={cn(
                  "group flex flex-col rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 transition px-3 py-2 min-w-[180px] max-w-[260px]",
                  "ring-0 hover:ring-2",
                  meta.ring,
                )}
              >
                <div className="text-sm font-semibold truncate">{b.name}</div>
                <div className="text-xs text-zinc-400 truncate">
                  {b.school}
                  {b.building ? ` · ${b.building}` : ""}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{b.voteCount} vote{b.voteCount === 1 ? "" : "s"}</span>
                  <span className="font-mono text-zinc-300">
                    {b.avgScore !== null ? b.avgScore.toFixed(1) : "—"}/10
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
