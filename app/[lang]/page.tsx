import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBathroomsWithStats } from "@/lib/db/queries";
import { TIERS, scoreToTier, type Tier } from "@/lib/tiers";
import { TierRow } from "@/components/tier-row";
import { CountdownBanner } from "@/components/countdown-banner";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const all = await getAllBathroomsWithStats(lang);

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
          {dict.home.titleA}
          <span className="text-amber-400">{dict.home.titleB}</span>
        </h1>
        <p className="mt-3 text-zinc-400 max-w-2xl">{dict.home.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
            {dict.home.bathroomCount(all.length)}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
            {dict.home.voteCount(totalVotes)}
          </span>
          <Link
            href={`/${lang}/submit`}
            className="rounded-full bg-amber-400 px-3 py-1 font-semibold text-zinc-950 hover:bg-amber-300 transition"
          >
            {dict.home.addOne}
          </Link>
        </div>
      </section>

      <CountdownBanner
        headline={dict.countdown.headline}
        daysLeftTemplate={dict.countdown.daysLeftTemplate}
        ended={dict.countdown.ended}
      />

      {all.length === 0 ? (
        <EmptyState lang={lang} dict={dict.home} />
      ) : (
        <div className="flex flex-col gap-3">
          {TIERS.map((tier) => (
            <TierRow
              key={tier}
              tier={tier}
              bathrooms={grouped[tier]}
              tagline={dict.tiers[tier]}
              rowEmpty={dict.home.rowEmpty}
              voteCount={dict.home.voteCount}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  lang,
  dict,
}: {
  lang: string;
  dict: { emptyTitle: string; emptyBody: string; emptyCta: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center">
      <div className="text-6xl">🚽</div>
      <h2 className="mt-3 text-xl font-bold">{dict.emptyTitle}</h2>
      <p className="mt-1 text-sm text-zinc-400">{dict.emptyBody}</p>
      <Link
        href={`/${lang}/submit`}
        className="mt-5 inline-block rounded-md bg-amber-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-300 transition"
      >
        {dict.emptyCta}
      </Link>
    </div>
  );
}
