import "server-only";
import { put } from "@vercel/blob";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export class BlobUploadError extends Error {}

export async function uploadImage(file: File, prefix: string): Promise<string> {
  if (file.size === 0) {
    throw new BlobUploadError("empty");
  }
  if (file.size > MAX_BYTES) {
    throw new BlobUploadError("too_big");
  }
  if (!ALLOWED.has(file.type)) {
    throw new BlobUploadError("bad_type");
  }
  const ext = file.type.split("/")[1] ?? "bin";
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { url } = await put(path, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });
  return url;
}

export function isImageFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}
