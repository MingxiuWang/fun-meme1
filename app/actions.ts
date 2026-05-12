"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bathrooms, bathroomImages, reviewLikes, votes } from "@/lib/db/schema";
import { getVoterId } from "@/lib/voter";
import { uploadImage, isImageFile, BlobUploadError } from "@/lib/blob";

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

const likeSchema = z.object({
  lang: LANG,
  voteId: z.string().min(1),
  bathroomId: z.string().min(1),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

function blobErrorMessage(err: BlobUploadError): string {
  switch (err.message) {
    case "too_big":
      return "图片太大,单张不超过 8MB / Image too large (max 8MB).";
    case "bad_type":
      return "只接受 JPG/PNG/WEBP/GIF/AVIF / Unsupported image type.";
    default:
      return "图片上传失败 / Image upload failed.";
  }
}

export async function submitBathroom(formData: FormData): Promise<ActionResult> {
  const raw = {
    lang: formData.get("lang"),
    name: formData.get("name"),
    school: formData.get("school"),
    building: formData.get("building"),
    floor: formData.get("floor"),
    description: formData.get("description"),
    score: formData.get("score"),
    review: formData.get("review"),
  };
  const parsed = submitBathroomSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;

  let coverImageUrl: string | null = null;
  const galleryUrls: string[] = [];

  try {
    const cover = formData.get("coverImage");
    if (isImageFile(cover)) {
      coverImageUrl = await uploadImage(cover, "covers");
    }
    const contentFiles = formData.getAll("contentImages").filter(isImageFile);
    for (const f of contentFiles.slice(0, 8)) {
      galleryUrls.push(await uploadImage(f, "gallery"));
    }
  } catch (err) {
    if (err instanceof BlobUploadError) {
      return { ok: false, error: blobErrorMessage(err) };
    }
    throw err;
  }

  const voterId = await getVoterId();

  const [inserted] = await db
    .insert(bathrooms)
    .values({
      name: d.name,
      school: d.school,
      building: d.building || null,
      floor: d.floor || null,
      description: d.description || null,
      coverImageUrl,
      language: d.lang,
    })
    .returning({ id: bathrooms.id });

  if (galleryUrls.length > 0) {
    await db.insert(bathroomImages).values(
      galleryUrls.map((url, i) => ({
        bathroomId: inserted.id,
        url,
        position: i,
      })),
    );
  }

  await db.insert(votes).values({
    bathroomId: inserted.id,
    score: d.score,
    review: d.review || null,
    voterFingerprint: voterId,
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
  const voterId = await getVoterId();

  try {
    await db.insert(votes).values({
      bathroomId: d.bathroomId,
      score: d.score,
      review: d.review || null,
      voterFingerprint: voterId,
    });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "23505") {
      return { ok: false, error: "ALREADY_VOTED" };
    }
    throw err;
  }

  revalidatePath(`/${d.lang}`);
  revalidatePath(`/${d.lang}/b/${d.bathroomId}`);
  return { ok: true };
}

export async function toggleReviewLike(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = likeSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  const voterId = await getVoterId();

  const existing = await db
    .select({ id: reviewLikes.id })
    .from(reviewLikes)
    .where(and(eq(reviewLikes.voteId, d.voteId), eq(reviewLikes.voterFingerprint, voterId)))
    .limit(1);

  if (existing[0]) {
    await db.delete(reviewLikes).where(eq(reviewLikes.id, existing[0].id));
  } else {
    await db
      .insert(reviewLikes)
      .values({ voteId: d.voteId, voterFingerprint: voterId })
      .onConflictDoNothing();
  }

  revalidatePath(`/${d.lang}/b/${d.bathroomId}`);
  return { ok: true };
}
