import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });
import { db } from "../lib/db/client";
import { bathrooms, votes } from "../lib/db/schema";

const seed: Array<{
  bathroom: typeof bathrooms.$inferInsert;
  votes: Array<{ score: number; review?: string }>;
}> = [
  {
    bathroom: {
      name: "The Old Arts Throne Room",
      school: "University of Melbourne",
      building: "Old Arts",
      floor: "Ground floor",
      description: "Cathedral acoustics. Solid mahogany stalls. Always candlelit somehow.",
    },
    votes: [
      { score: 10, review: "Wept softly. Ten out of ten." },
      { score: 9, review: "Door locks. Soap exists. We have peace." },
      { score: 9 },
    ],
  },
  {
    bathroom: {
      name: "Engineering Building Bunker",
      school: "University of Melbourne",
      building: "Engineering",
      floor: "Basement",
      description: "Flickering fluorescents. The hum never stops.",
    },
    votes: [
      { score: 3, review: "Found a circuit diagram drawn on the stall door. 2 hours of my life gone." },
      { score: 4 },
    ],
  },
  {
    bathroom: {
      name: "Library 4th Floor Quiet Room",
      school: "Monash University",
      building: "Matheson Library",
      floor: "Level 4",
      description: "Silent. Pristine. Used exclusively during finals week breakdowns.",
    },
    votes: [
      { score: 8, review: "Cried here in May. Will return in November." },
      { score: 7 },
      { score: 8, review: "10/10 for crying, 6/10 for hand dryer power." },
    ],
  },
  {
    bathroom: {
      name: "The Cafeteria-Adjacent Disaster",
      school: "RMIT",
      building: "Building 8",
      floor: "Level 2",
      description: "Smells like fries and despair. Sticky floor. No questions answered.",
    },
    votes: [
      { score: 2 },
      { score: 1, review: "Saw a seagull inside. Don't ask how." },
    ],
  },
  {
    bathroom: {
      name: "Science Centre Sky Toilet",
      school: "University of Sydney",
      building: "F23 Admin",
      floor: "Top floor",
      description: "Floor-to-ceiling windows. You feel observed by the city itself.",
    },
    votes: [
      { score: 9, review: "Peed at golden hour. Spiritual." },
      { score: 8 },
    ],
  },
  {
    bathroom: {
      name: "The Gymnasium Locker Disaster",
      school: "UNSW",
      building: "Sports Centre",
      description: "Hot. Loud. Steamy. Not in the good way.",
    },
    votes: [
      { score: 4, review: "Someone left protein shake residue everywhere." },
      { score: 5 },
      { score: 3 },
    ],
  },
  {
    bathroom: {
      name: "The Mid Bathroom",
      school: "ANU",
      building: "Chifley Library",
      floor: "Level 1",
      description: "It exists. It functions. It is here.",
    },
    votes: [
      { score: 6, review: "Nothing went wrong. Nothing went right." },
      { score: 5 },
      { score: 6 },
    ],
  },
];

async function main() {
  console.log("🚽 Seeding bathrooms...");
  for (const entry of seed) {
    const [inserted] = await db
      .insert(bathrooms)
      .values(entry.bathroom)
      .returning({ id: bathrooms.id });
    for (const v of entry.votes) {
      await db.insert(votes).values({
        bathroomId: inserted.id,
        score: v.score,
        review: v.review,
      });
    }
    console.log(`  ✓ ${entry.bathroom.name} (${entry.votes.length} votes)`);
  }
  console.log("✅ Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
