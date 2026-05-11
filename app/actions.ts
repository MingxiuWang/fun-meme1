"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { bathrooms, votes } from "@/lib/db/schema";

const LANG = z.enum(["en", "zh"]).default("en");

const submitBathroomSchema = z.object({
  lang: LANG,
  name: z.string().trim().min(2).max(120),
  school: z.string().trim().min(2).max(120),
  building: z.string().trim().max(120).optional().or(z.literal("")),
  floor: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  score: z.coerce.number().int().min(1).max(10),
  review: z.string().trim().max(500).optional().or(z.literal("")),
});

const voteSchema = z.object({
  lang: LANG,
  bathroomId: z.string().min(1),
  score: z.coerce.number().int().min(1).max(10),
  review: z.string().trim().max(500).optional().or(z.literal("")),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function submitBathroom(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = submitBathroomSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;

  const [inserted] = await db
    .insert(bathrooms)
    .values({
      name: d.name,
      school: d.school,
      building: d.building || null,
      floor: d.floor || null,
      description: d.description || null,
    })
    .returning({ id: bathrooms.id });

  await db.insert(votes).values({
    bathroomId: inserted.id,
    score: d.score,
    review: d.review || null,
  });

  revalidatePath("/[lang]", "layout");
  redirect(`/${d.lang}/b/${inserted.id}`);
}

export async function voteOnBathroom(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = voteSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;

  await db.insert(votes).values({
    bathroomId: d.bathroomId,
    score: d.score,
    review: d.review || null,
  });

  revalidatePath(`/${d.lang}`);
  revalidatePath(`/${d.lang}/b/${d.bathroomId}`);
  return { ok: true };
}
