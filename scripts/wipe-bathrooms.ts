import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  const before = (await sql.query(
    `SELECT count(*)::text AS count FROM bathrooms`,
  )) as Array<{ count: string }>;
  console.log(`bathrooms before: ${before[0]?.count ?? "?"}`);

  await sql.query(`DELETE FROM bathrooms`);

  const after = (await sql.query(
    `SELECT
       (SELECT count(*)::text FROM bathrooms) AS bathrooms,
       (SELECT count(*)::text FROM votes) AS votes,
       (SELECT count(*)::text FROM bathroom_images) AS images,
       (SELECT count(*)::text FROM review_likes) AS likes`,
  )) as Array<{ bathrooms: string; votes: string; images: string; likes: string }>;
  console.log("after wipe:", after[0]);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
