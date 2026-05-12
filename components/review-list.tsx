"use client";

import { useTransition, useOptimistic } from "react";
import { toggleReviewLike } from "@/app/actions";
import type { ReviewWithLikes } from "@/lib/db/queries";

type Props = {
  bathroomId: string;
  lang: string;
  reviews: Array<
    Pick<ReviewWithLikes, "id" | "score" | "review" | "likeCount" | "viewerLiked"> & {
      createdAtISO: string;
    }
  >;
  likeAction: string;
  unlikeAction: string;
};

export function ReviewList({
  bathroomId,
  lang,
  reviews,
  likeAction,
  unlikeAction,
}: Props) {
  const [optimisticReviews, applyOptimistic] = useOptimistic(
    reviews,
    (state, voteId: string) =>
      state.map((r) =>
        r.id === voteId
          ? {
              ...r,
              viewerLiked: !r.viewerLiked,
              likeCount: r.likeCount + (r.viewerLiked ? -1 : 1),
            }
          : r,
      ),
  );
  const [pending, startTransition] = useTransition();

  function onLike(voteId: string) {
    startTransition(async () => {
      applyOptimistic(voteId);
      const fd = new FormData();
      fd.set("voteId", voteId);
      fd.set("bathroomId", bathroomId);
      fd.set("lang", lang);
      await toggleReviewLike(fd);
    });
  }

  return (
    <ul className="space-y-3">
      {optimisticReviews.map((r) => (
        <li
          key={r.id}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-amber-400 font-bold">{r.score}/10</span>
            <span className="text-xs text-zinc-500">
              {new Date(r.createdAtISO).toLocaleDateString(
                lang === "zh" ? "zh-CN" : "en-US",
              )}
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-300 whitespace-pre-wrap">{r.review}</p>
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              disabled={pending}
              onClick={() => onLike(r.id)}
              aria-pressed={r.viewerLiked}
              className={
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition disabled:opacity-60 " +
                (r.viewerLiked
                  ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500")
              }
            >
              <span>{r.viewerLiked ? unlikeAction : likeAction}</span>
              <span className="font-mono tabular-nums">{r.likeCount}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
