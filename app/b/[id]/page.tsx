import Link from "next/link";
import { notFound } from "next/navigation";
import { getBathroomById, getReviewsForBathroom } from "@/lib/db/queries";
import { scoreToTier, TIER_META } from "@/lib/tiers";
import { VoteForm } from "@/components/vote-form";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BathroomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const b = await getBathroomById(id);
  if (!b) notFound();

  const reviews = await getReviewsForBathroom(id);
  const tier = scoreToTier(b.avgScore);
  const meta = TIER_META[tier];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← back to tier list
      </Link>

      <div className="mt-4 flex flex-col sm:flex-row gap-5 items-start">
        <div
          className={cn(
            "h-28 w-28 shrink-0 rounded-2xl flex flex-col items-center justify-center font-black",
            meta.bg,
            meta.text,
          )}
        >
          <span className="text-6xl leading-none">{meta.label}</span>
          <span className="mt-1 text-[10px] uppercase tracking-wider opacity-70">
            tier
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {b.name}
          </h1>
          <p className="mt-1 text-zinc-400">
            {b.school}
            {b.building ? ` · ${b.building}` : ""}
            {b.floor ? ` · ${b.floor}` : ""}
          </p>
          {b.description && (
            <p className="mt-3 text-zinc-300">{b.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono">
              {b.avgScore !== null ? b.avgScore.toFixed(2) : "—"}/10
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1">
              {b.voteCount} vote{b.voteCount === 1 ? "" : "s"}
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 italic text-zinc-400">
              {meta.tagline}
            </span>
          </div>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Cast your vote</h2>
        <VoteForm bathroomId={b.id} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">
          Reviews{" "}
          <span className="text-sm text-zinc-500 font-normal">
            ({reviews.length})
          </span>
        </h2>
        {reviews.length === 0 ? (
          <div className="text-sm text-zinc-500 italic">No reviews yet.</div>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-amber-400 font-bold">
                    {r.score}/10
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {r.review && (
                  <p className="mt-2 text-sm text-zinc-300 whitespace-pre-wrap">
                    {r.review}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
