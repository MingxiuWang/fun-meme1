import "server-only";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const VOTER_COOKIE = "voter_id";

export async function getVoterId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VOTER_COOKIE)?.value;
  if (existing) return existing;
  const fresh = nanoid(16);
  jar.set({
    name: VOTER_COOKIE,
    value: fresh,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
  return fresh;
}

export async function getVoterIdOrNull(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(VOTER_COOKIE)?.value ?? null;
}
