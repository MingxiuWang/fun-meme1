"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { submitBathroom } from "@/app/actions";
import { ScorePicker } from "@/components/score-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/types";

type Props = {
  lang: string;
  dict: Pick<Dictionary, "submit" | "scoreFlair">;
};

const MAX_GALLERY = 8;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

export function SubmitForm({ lang, dict }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const coverPreview = useObjectUrl(coverFile);
  const galleryPreviews = useObjectUrls(galleryFiles);

  async function action(formData: FormData) {
    formData.delete("coverImage");
    formData.delete("contentImages");
    if (coverFile) formData.set("coverImage", coverFile);
    for (const f of galleryFiles) formData.append("contentImages", f);

    setError(null);
    startTransition(async () => {
      const result = await submitBathroom(formData);
      if (result && "ok" in result && !result.ok) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  function pickCover() {
    coverInputRef.current?.click();
  }

  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    e.target.value = "";
  }

  function clearCover() {
    setCoverFile(null);
  }

  function pickGallery() {
    galleryInputRef.current?.click();
  }

  function onGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryFiles((g) =>
        g.length >= MAX_GALLERY ? g : [...g, file].slice(0, MAX_GALLERY),
      );
    }
    e.target.value = "";
  }

  function removeGallery(i: number) {
    setGalleryFiles((g) => g.filter((_, idx) => idx !== i));
  }

  const galleryFull = galleryFiles.length >= MAX_GALLERY;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="lang" value={lang} />

      <section className="space-y-5 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 sm:p-5">
        <div className="space-y-2">
          <Label className="text-base">{dict.submit.coverImageLabel}</Label>
          <p className="text-xs text-zinc-500">{dict.submit.coverImageHint}</p>
          <input
            ref={coverInputRef}
            type="file"
            accept={ACCEPT}
            onChange={onCoverChange}
            className="hidden"
          />
          {coverPreview ? (
            <div className="relative inline-block">
              <div className="relative h-44 w-44 overflow-hidden rounded-xl border-2 border-amber-400/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={clearCover}
                className="absolute -top-2 -right-2 rounded-full bg-zinc-900 border border-zinc-600 px-2 py-0.5 text-xs text-zinc-200 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={pickCover}
              className="flex h-44 w-44 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-amber-400/50 bg-zinc-950/40 text-amber-300 hover:bg-zinc-950/70 transition"
            >
              <span className="text-3xl">📷</span>
              <span className="text-xs font-semibold">
                {dict.submit.coverImageLabel}
              </span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-base">{dict.submit.contentImagesLabel}</Label>
            <span className="font-mono text-xs text-zinc-500 tabular-nums">
              {dict.submit.imageCountTemplate.replace(
                "{n}",
                String(galleryFiles.length),
              )}
            </span>
          </div>
          <p className="text-xs text-zinc-500">{dict.submit.contentImagesHint}</p>
          <input
            ref={galleryInputRef}
            type="file"
            accept={ACCEPT}
            onChange={onGalleryChange}
            className="hidden"
          />
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {galleryPreviews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-lg border border-zinc-700"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGallery(i)}
                  aria-label={dict.submit.removeImageButton}
                  className="absolute top-1 right-1 rounded-full bg-zinc-900/85 border border-zinc-600 px-1.5 py-0 text-xs text-zinc-100 hover:bg-zinc-800"
                >
                  ✕
                </button>
              </div>
            ))}
            {!galleryFull && (
              <button
                type="button"
                onClick={pickGallery}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:border-amber-400/60 hover:text-amber-300 transition"
              >
                <span className="text-2xl">＋</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {dict.submit.addImageButton.replace(/^[+＋]\s*/, "")}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      <Field id="name" label={dict.submit.nameLabel}>
        <Input
          id="name"
          name="name"
          required
          placeholder={dict.submit.namePlaceholder}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="school" label={dict.submit.schoolLabel}>
          <Input
            id="school"
            name="school"
            required
            placeholder={dict.submit.schoolPlaceholder}
          />
        </Field>
        <Field id="building" label={dict.submit.buildingLabel}>
          <Input
            id="building"
            name="building"
            placeholder={dict.submit.buildingPlaceholder}
          />
        </Field>
      </div>

      <Field id="floor" label={dict.submit.floorLabel}>
        <Input
          id="floor"
          name="floor"
          placeholder={dict.submit.floorPlaceholder}
        />
      </Field>

      <Field id="description" label={dict.submit.descLabel}>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder={dict.submit.descPlaceholder}
        />
      </Field>

      <div className="border-t border-zinc-800 pt-5">
        <Label className="text-base mb-2 block">{dict.submit.ratingLabel}</Label>
        <ScorePicker flair={dict.scoreFlair} />
      </div>

      <Field id="review" label={dict.submit.reviewLabel}>
        <Textarea
          id="review"
          name="review"
          rows={3}
          placeholder={dict.submit.reviewPlaceholder}
        />
      </Field>

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-amber-400 px-4 py-3 font-semibold text-zinc-950 hover:bg-amber-300 transition disabled:opacity-60"
      >
        {pending ? dict.submit.submitting : dict.submit.submit}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

function useObjectUrls(files: File[]): string[] {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => {
      next.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);
  return urls;
}
