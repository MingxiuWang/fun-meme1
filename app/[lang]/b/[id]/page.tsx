import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBathroomById,
  getBathroomGallery,
  getReviewsForBathroom,
  hasViewerVoted,
} from "@/lib/db/queries";
import { scoreToTier, TIER_STYLE } from "@/lib/tiers";
import { VoteForm } from "@/components/vote-form";
import { ImageGallery } from "@/components/image-gallery";
import { ReviewList } from "@/components/review-list";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BathroomPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const b = await getBathroomById(id);
  if (!b) notFound();

  const [gallery, reviews, alreadyVoted] = await Promise.all([
    getBathroomGallery(id),
    getReviewsForBathroom(id),
    hasViewerVoted(id),
  ]);

  const tier = scoreToTier(b.avgScore);
  const style = TIER_STYLE[tier];

  const heroImages = b.coverImageUrl
    ? [{ id: "cover", url: b.coverImageUrl }, ...gallery]
    : gallery;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={`/${lang}`}
        className="text-sm text-zinc-400 hover:text-zinc-200"
      >
        {dict.detail.back}
      </Link>

      <div className="mt-4 flex flex-col sm:flex-row gap-5 items-start">
        <div
          className={cn(
            "h-28 w-28 shrink-0 rounded-2xl flex flex-col items-center justify-center font-black",
            style.bg,
            style.text,
          )}
        >
          <span className="text-6xl leading-none">{tier}</span>
          <span className="mt-1 text-[10px] uppercase tracking-wider opacity-70">
            {dict.detail.tierBadge}
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
              {dict.home.voteCount(b.voteCount)}
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 italic text-zinc-400">
              {dict.tiers[tier]}
            </span>
          </div>
        </div>
      </div>

      {heroImages.length > 0 ? (
        <ImageGallery images={heroImages} alt={b.name} />
      ) : (
        <div className="mt-6 flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-sm text-zinc-500 italic">
          {dict.detail.galleryEmpty}
        </div>
      )}

      <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
        <h2 className="text-xl font-bold mb-4">{dict.detail.voteHeading}</h2>
        <VoteForm
          bathroomId={b.id}
          lang={lang}
          alreadyVoted={alreadyVoted}
          dict={{ detail: dict.detail, scoreFlair: dict.scoreFlair }}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">
          {dict.detail.reviewsHeading}{" "}
          <span className="text-sm text-zinc-500 font-normal">
            ({reviews.length})
          </span>
        </h2>
        {reviews.length === 0 ? (
          <div className="text-sm text-zinc-500 italic">
            {dict.detail.noReviews}
          </div>
        ) : (
          <ReviewList
            bathroomId={b.id}
            lang={lang}
            reviews={reviews.map((r) => ({
              id: r.id,
              score: r.score,
              review: r.review,
              likeCount: r.likeCount,
              viewerLiked: r.viewerLiked,
              createdAtISO: r.createdAt.toISOString(),
            }))}
            likeAction={dict.detail.likeAction}
            unlikeAction={dict.detail.unlikeAction}
          />
        )}
      </section>
    </div>
  );
}
