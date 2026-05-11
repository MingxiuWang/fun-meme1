import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const bathrooms = pgTable(
  "bathrooms",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid(10)),
    name: text("name").notNull(),
    school: text("school").notNull(),
    building: text("building"),
    floor: text("floor"),
    description: text("description"),
    language: text("language").notNull().default("en"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("bathrooms_school_idx").on(t.school),
    index("bathrooms_language_idx").on(t.language),
  ],
);

export const votes = pgTable(
  "votes",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid(12)),
    bathroomId: text("bathroom_id")
      .notNull()
      .references(() => bathrooms.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    review: text("review"),
    voterFingerprint: text("voter_fingerprint"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("votes_bathroom_idx").on(t.bathroomId)],
);

export type Bathroom = typeof bathrooms.$inferSelect;
export type NewBathroom = typeof bathrooms.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
