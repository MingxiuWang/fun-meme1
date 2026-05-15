# King of Shit 🚽

A crowd-sourced tier list of university & school bathrooms. Submit, upload photos, rate (1–10), and let the average decide who sits on the porcelain throne. One vote per stall per browser. No login.

Live: <https://king-of-shit.vercel.app> (EN) · <https://king-of-shit.vercel.app/zh> (中)

Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · Drizzle ORM · Neon Postgres · Vercel Blob · Server Actions.

## First-time setup

You need a Neon database and a Vercel Blob store. Both are free-tier on Vercel Marketplace.

```bash
# 1. Sign in & link this directory to a Vercel project
vercel login
vercel link

# 2. Provision Neon Postgres
vercel integration add neon

# 3. Provision Vercel Blob (non-interactive form for CI / agent shells)
vercel blob create-store --yes \
  --environment production --environment preview --environment development

# 4. Pull DATABASE_URL + BLOB_READ_WRITE_TOKEN into .env.local
vercel env pull .env.local

# 5. Push the schema (drizzle-kit, fresh DB) OR run migrate-2 (existing DB)
pnpm db:push                       # fresh DB
pnpm tsx scripts/migrate-2.ts      # adds cover/gallery/likes/unique-vote idempotently

# 6. (Optional) Seed with starter bathrooms
pnpm db:seed

# 7. Run it
pnpm dev
```

Open <http://localhost:3000>.

## What's where

| Path | What |
|---|---|
| `app/[lang]/page.tsx` | Tier list (S/A/B/C/D/F) + countdown banner |
| `app/[lang]/submit/page.tsx` | Submit a new bathroom (cover + gallery first) |
| `app/[lang]/b/[id]/page.tsx` | Bathroom detail: image gallery, vote form, reviews |
| `app/actions.ts` | Server actions: `submitBathroom`, `voteOnBathroom`, `toggleReviewLike` |
| `proxy.ts` | Locale redirect + sets the `voter_id` cookie |
| `components/countdown-banner.tsx` | Live D/H/M/S countdown to the deadline |
| `components/image-gallery.tsx` | Detail-page hero + thumbnail grid |
| `components/submit-form.tsx` | Add gallery photos one at a time, with previews |
| `components/review-list.tsx` | Reviews with optimistic like toggling |
| `lib/blob.ts` | Vercel Blob upload wrapper (8MB cap, image MIME guard) |
| `lib/voter.ts` | Cookie-based anonymous voter id |
| `lib/deadline.ts` | Vote window (start, end, days/hours/min/sec snapshot) |
| `lib/i18n/{en,zh,types,index}.ts` | Server-only locale dictionaries |
| `lib/db/schema.ts` | Drizzle schema: `bathrooms`, `bathroom_images`, `votes`, `review_likes` |
| `lib/db/queries.ts` | Reads with avg score, gallery, like-weighted review sort |
| `lib/tiers.ts` | Tier thresholds + colors |
| `scripts/migrate-2.ts` | Targeted ALTER for the gallery/like/unique-vote schema |
| `scripts/wipe-bathrooms.ts` | One-shot DELETE FROM bathrooms (FKs cascade) |

## How voting works

- Every visitor gets a `voter_id` cookie set in `proxy.ts` (httpOnly, SameSite=lax, 1y).
- Postgres `unique(bathroom_id, voter_fingerprint)` enforces **one vote per stall per browser**. Duplicate inserts hit error code `23505` and the action returns `ALREADY_VOTED`.
- Reviews can be liked. Order is `count(distinct likes) + extract(epoch from created_at) / 86400` — one like ≈ one day of freshness.
- The vote window lives in `lib/deadline.ts` (default: 2026-05-14 → 2026-05-29 23:59 Beijing).

## Scoring → tier

| Score range | Tier | Vibe |
|---|---|---|
| 9.0–10  | S | porcelain throne — life-changing flush |
| 7.5–8.9 | A | would poop here again |
| 6.0–7.4 | B | respectable, no complaints |
| 4.5–5.9 | C | mid. holds liquid. |
| 3.0–4.4 | D | use only if desperate |
| < 3.0   | F | biohazard. condemn the building. |

## Deploy

```bash
vercel deploy            # preview
vercel deploy --prod     # production
```

Both `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are auto-wired into the Vercel project from their respective integrations. If a `git push` doesn't trigger an auto-deploy, fall back to `vercel deploy --prod`.

## Roadmap

- [x] Photos (Vercel Blob) — cover + gallery
- [x] Anti-spam: one vote per stall per voter (cookie + unique constraint)
- [x] Like-weighted review ordering
- [x] Live countdown to vote deadline
- [ ] Per-school leaderboards
- [ ] BotID for bot mitigation on the vote action
- [ ] Optional sign-in for editing your reviews
