# King of Shit 🚽

A crowd-sourced tier list of university & school bathrooms. Submit, rate (1–10), and let the average decide who sits on the porcelain throne. No login.

Stack: Next.js 16 (App Router) · Tailwind v4 · shadcn/ui · Drizzle ORM · Neon Postgres (Vercel Marketplace) · Server Actions.

## First-time setup

You need a Neon database. The fastest path is via Vercel Marketplace (free tier).

```bash
# 1. Sign in to Vercel (one time)
vercel login

# 2. Link this directory to a new (or existing) Vercel project
vercel link

# 3. Provision Neon Postgres via the marketplace
vercel integration add neon

# 4. Pull DATABASE_URL into .env.local
vercel env pull .env.local

# 5. Push the schema to your new database
pnpm db:push

# 6. (Optional) Seed with some starter bathrooms
pnpm db:seed

# 7. Run it
pnpm dev
```

Open <http://localhost:3000>.

## What's where

| Path | What |
|---|---|
| `app/page.tsx` | The tier list (S/A/B/C/D/F) |
| `app/submit/page.tsx` | Submit a new bathroom |
| `app/b/[id]/page.tsx` | Bathroom detail + vote form + reviews |
| `app/actions.ts` | Server actions: submitBathroom, voteOnBathroom |
| `lib/db/schema.ts` | Drizzle schema (`bathrooms`, `votes`) |
| `lib/db/queries.ts` | Read queries with average-score aggregations |
| `lib/tiers.ts` | Tier thresholds + colors |

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

The Neon `DATABASE_URL` is automatically wired into your Vercel project from the integration.

## Roadmap

- [ ] Photos (Vercel Blob)
- [ ] Per-school leaderboards
- [ ] Rate-limit / anti-spam (BotID + voter fingerprint)
- [ ] Optional sign-in for editing your reviews
