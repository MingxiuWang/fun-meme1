import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(url);

const statements: Array<{ name: string; sql: string }> = [
  {
    name: "add bathrooms.cover_image_url",
    sql: `ALTER TABLE "bathrooms" ADD COLUMN IF NOT EXISTS "cover_image_url" text`,
  },
  {
    name: "create bathroom_images",
    sql: `CREATE TABLE IF NOT EXISTS "bathroom_images" (
      "id" text PRIMARY KEY NOT NULL,
      "bathroom_id" text NOT NULL REFERENCES "bathrooms"("id") ON DELETE cascade,
      "url" text NOT NULL,
      "position" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
  },
  {
    name: "bathroom_images_bathroom_idx",
    sql: `CREATE INDEX IF NOT EXISTS "bathroom_images_bathroom_idx" ON "bathroom_images" ("bathroom_id")`,
  },
  {
    name: "create review_likes",
    sql: `CREATE TABLE IF NOT EXISTS "review_likes" (
      "id" text PRIMARY KEY NOT NULL,
      "vote_id" text NOT NULL REFERENCES "votes"("id") ON DELETE cascade,
      "voter_fingerprint" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "review_likes_vote_voter_unique" UNIQUE ("vote_id","voter_fingerprint")
    )`,
  },
  {
    name: "review_likes_vote_idx",
    sql: `CREATE INDEX IF NOT EXISTS "review_likes_vote_idx" ON "review_likes" ("vote_id")`,
  },
  {
    name: "votes unique constraint",
    sql: `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'votes_bathroom_voter_unique'
        ) THEN
          ALTER TABLE "votes" ADD CONSTRAINT "votes_bathroom_voter_unique"
            UNIQUE ("bathroom_id","voter_fingerprint");
        END IF;
      END $$`,
  },
];

async function main() {
  for (const s of statements) {
    process.stdout.write(`→ ${s.name}... `);
    await sql.query(s.sql);
    console.log("ok");
  }
  console.log("\n✅ migration applied.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
