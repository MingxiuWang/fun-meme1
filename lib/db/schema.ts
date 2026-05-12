import { pgTable, text, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
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
    coverImageUrl: text("cover_image_url"),
    language: text("language").notNull().default("en"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("bathrooms_school_idx").on(t.school),
    index("bathrooms_language_idx").on(t.language),
  ],
);

export const bathroomImages = pgTable(
  "bathroom_images",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid(12)),
    bathroomId: text("bathroom_id")
      .notNull()
      .references(() => bathrooms.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("bathroom_images_bathroom_idx").on(t.bathroomId)],
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
  (t) => [
    index("votes_bathroom_idx").on(t.bathroomId),
    unique("votes_bathroom_voter_unique").on(t.bathroomId, t.voterFingerprint),
  ],
);

export const reviewLikes = pgTable(
  "review_likes",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid(12)),
    voteId: text("vote_id")
      .notNull()
      .references(() => votes.id, { onDelete: "cascade" }),
    voterFingerprint: text("voter_fingerprint").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("review_likes_vote_idx").on(t.voteId),
    unique("review_likes_vote_voter_unique").on(t.voteId, t.voterFingerprint),
  ],
);

export type Bathroom = typeof bathrooms.$inferSelect;
export type NewBathroom = typeof bathrooms.$inferInsert;
export type BathroomImage = typeof bathroomImages.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
export type ReviewLike = typeof reviewLikes.$inferSelect;
