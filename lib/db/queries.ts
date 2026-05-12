import { db } from "./client";
import { bathrooms, bathroomImages, reviewLikes, votes } from "./schema";
import { and, asc, eq, sql, desc, isNotNull, ne } from "drizzle-orm";
import { getVoterIdOrNull } from "@/lib/voter";

export type BathroomWithStats = {
  id: string;
  name: string;
  school: string;
  building: string | null;
  floor: string | null;
  description: string | null;
  coverImageUrl: string | null;
  language: string;
  createdAt: Date;
  voteCount: number;
  avgScore: number | null;
};

export async function getAllBathroomsWithStats(
  preferredLanguage?: string,
): Promise<BathroomWithStats[]> {
  const rows = await db
    .select({
      id: bathrooms.id,
      name: bathrooms.name,
      school: bathrooms.school,
      building: bathrooms.building,
      floor: bathrooms.floor,
      description: bathrooms.description,
      coverImageUrl: bathrooms.coverImageUrl,
      language: bathrooms.language,
      createdAt: bathrooms.createdAt,
      voteCount: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      avgScore: sql<number | null>`avg(${votes.score})::float`,
    })
    .from(bathrooms)
    .leftJoin(votes, eq(votes.bathroomId, bathrooms.id))
    .groupBy(bathrooms.id)
    .orderBy(
      preferredLanguage
        ? sql`(${bathrooms.language} = ${preferredLanguage}) desc, avg(${votes.score}) desc nulls last`
        : desc(sql`avg(${votes.score})`),
    );

  return rows;
}

export async function getBathroomById(id: string) {
  const [row] = await db
    .select({
      id: bathrooms.id,
      name: bathrooms.name,
      school: bathrooms.school,
      building: bathrooms.building,
      floor: bathrooms.floor,
      description: bathrooms.description,
      coverImageUrl: bathrooms.coverImageUrl,
      language: bathrooms.language,
      createdAt: bathrooms.createdAt,
      voteCount: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      avgScore: sql<number | null>`avg(${votes.score})::float`,
    })
    .from(bathrooms)
    .leftJoin(votes, eq(votes.bathroomId, bathrooms.id))
    .where(eq(bathrooms.id, id))
    .groupBy(bathrooms.id);

  return row ?? null;
}

export async function getBathroomGallery(bathroomId: string) {
  return db
    .select({ id: bathroomImages.id, url: bathroomImages.url, position: bathroomImages.position })
    .from(bathroomImages)
    .where(eq(bathroomImages.bathroomId, bathroomId))
    .orderBy(asc(bathroomImages.position), asc(bathroomImages.createdAt));
}

const LIKE_WEIGHT_SECONDS = 24 * 60 * 60;

export type ReviewWithLikes = {
  id: string;
  score: number;
  review: string;
  createdAt: Date;
  likeCount: number;
  viewerLiked: boolean;
};

export async function getReviewsForBathroom(bathroomId: string): Promise<ReviewWithLikes[]> {
  const voterId = await getVoterIdOrNull();

  const rows = await db
    .select({
      id: votes.id,
      score: votes.score,
      review: votes.review,
      createdAt: votes.createdAt,
      likeCount: sql<number>`coalesce(count(distinct ${reviewLikes.id}), 0)::int`,
      viewerLiked: voterId
        ? sql<boolean>`bool_or(${reviewLikes.voterFingerprint} = ${voterId})`
        : sql<boolean>`false`,
    })
    .from(votes)
    .leftJoin(reviewLikes, eq(reviewLikes.voteId, votes.id))
    .where(
      and(
        eq(votes.bathroomId, bathroomId),
        isNotNull(votes.review),
        ne(votes.review, ""),
      ),
    )
    .groupBy(votes.id)
    .orderBy(
      desc(
        sql`coalesce(count(distinct ${reviewLikes.id}), 0) + extract(epoch from ${votes.createdAt}) / ${LIKE_WEIGHT_SECONDS}`,
      ),
    );

  return rows.map((r) => ({
    id: r.id,
    score: r.score,
    review: r.review ?? "",
    createdAt: r.createdAt,
    likeCount: Number(r.likeCount),
    viewerLiked: Boolean(r.viewerLiked),
  }));
}

export async function hasViewerVoted(bathroomId: string): Promise<boolean> {
  const voterId = await getVoterIdOrNull();
  if (!voterId) return false;
  const [row] = await db
    .select({ id: votes.id })
    .from(votes)
    .where(
      and(eq(votes.bathroomId, bathroomId), eq(votes.voterFingerprint, voterId)),
    )
    .limit(1);
  return Boolean(row);
}
