import Link from "next/link";
import { TIER_STYLE, type Tier } from "@/lib/tiers";
import type { BathroomWithStats } from "@/lib/db/queries";
import { cn } from "@/lib/utils";

type Props = {
  tier: Tier;
  bathrooms: BathroomWithStats[];
  tagline: string;
  rowEmpty: string;
  voteCount: (n: number) => string;
  lang: string;
};

export function TierRow({ tier, bathrooms, tagline, rowEmpty, voteCount, lang }: Props) {
  const style = TIER_STYLE[tier];

  return (
    <div className="flex rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-20 sm:w-28 shrink-0 px-2 py-4",
          style.bg,
          style.text,
        )}
      >
        <div className="text-4xl sm:text-6xl font-black leading-none">{tier}</div>
        <div className="mt-2 text-[10px] sm:text-xs text-center font-medium opacity-80 leading-tight">
          {tagline}
        </div>
      </div>
      <div className="flex-1 p-3 sm:p-4">
        {bathrooms.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-500 italic">
            {rowEmpty}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {bathrooms.map((b) => (
              <Card key={b.id} bathroom={b} lang={lang} ring={style.ring} voteCount={voteCount} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  bathroom: b,
  lang,
  ring,
  voteCount,
}: {
  bathroom: BathroomWithStats;
  lang: string;
  ring: string;
  voteCount: (n: number) => string;
}) {
  return (
    <Link
      href={`/${lang}/b/${b.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 hover:border-zinc-500 transition",
        "ring-0 hover:ring-2",
        ring,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        {b.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.coverImageUrl}
            alt={b.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl opacity-50">
            🚽
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2">
          <div className="text-sm font-bold leading-tight text-white drop-shadow line-clamp-2">
            {b.name}
          </div>
          <div className="text-[11px] text-zinc-300 truncate">
            {b.school}
            {b.building ? ` · ${b.building}` : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] text-zinc-400">
        <span>{voteCount(b.voteCount)}</span>
        <span className="font-mono text-zinc-200">
          {b.avgScore !== null ? b.avgScore.toFixed(1) : "—"}/10
        </span>
      </div>
    </Link>
  );
}
