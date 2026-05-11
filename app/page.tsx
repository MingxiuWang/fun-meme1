import Link from "next/link";
import { getAllBathroomsWithStats } from "@/lib/db/queries";
import { TIERS, scoreToTier, type Tier } from "@/lib/tiers";
import { TierRow } from "@/components/tier-row";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getAllBathroomsWithStats();

  const grouped: Record<Tier, typeof all> = {
    S: [], A: [], B: [], C: [], D: [], F: [],
  };
  for (const b of all) {
    grouped[scoreToTier(b.avgScore)].push(b);
  }

  const totalVotes = all.reduce((sum, b) => sum + b.voteCount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <section className="mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
          The Uni Bathroom <span className="text-amber-400">Tier List</span>
        </h1>
        <p className="mt-3 text-zinc-400 max-w-2xl">
          Crowd-sourced rankings of every campus toilet worth visiting (and a
          few you should burn down). Rate 1–10 — the average determines the
          tier. No login. No mercy.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
            {all.length} bathroom{all.length === 1 ? "" : "s"}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
            {totalVotes} vote{totalVotes === 1 ? "" : "s"}
          </span>
          <Link
            href="/submit"
            className="rounded-full bg-amber-400 px-3 py-1 font-semibold text-zinc-950 hover:bg-amber-300 transition"
          >
            Add one →
          </Link>
        </div>
      </section>

      {all.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {TIERS.map((tier) => (
            <TierRow key={tier} tier={tier} bathrooms={grouped[tier]} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center">
      <div className="text-6xl">🚽</div>
      <h2 className="mt-3 text-xl font-bold">No bathrooms yet.</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Be the first to nominate a porcelain throne (or a war crime).
      </p>
      <Link
        href="/submit"
        className="mt-5 inline-block rounded-md bg-amber-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-300 transition"
      >
        Submit the first one
      </Link>
    </div>
  );
}
