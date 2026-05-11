import { db } from "./client";
import { bathrooms, votes } from "./schema";
import { eq, sql, desc } from "drizzle-orm";

export type BathroomWithStats = {
  id: string;
  name: string;
  school: string;
  building: string | null;
  floor: string | null;
  description: string | null;
  createdAt: Date;
  voteCount: number;
  avgScore: number | null;
};

export async function getAllBathroomsWithStats(): Promise<BathroomWithStats[]> {
  const rows = await db
    .select({
      id: bathrooms.id,
      name: bathrooms.name,
      school: bathrooms.school,
      building: bathrooms.building,
      floor: bathrooms.floor,
      description: bathrooms.description,
      createdAt: bathrooms.createdAt,
      voteCount: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      avgScore: sql<number | null>`avg(${votes.score})::float`,
    })
    .from(bathrooms)
    .leftJoin(votes, eq(votes.bathroomId, bathrooms.id))
    .groupBy(bathrooms.id)
    .orderBy(desc(sql`avg(${votes.score})`));

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

export async function getReviewsForBathroom(id: string) {
  return db
    .select()
    .from(votes)
    .where(eq(votes.bathroomId, id))
    .orderBy(desc(votes.createdAt));
}
