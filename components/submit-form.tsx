"use client";

import { useTransition, useState, useRef } from "react";
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

export function SubmitForm({ lang, dict }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function action(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitBathroom(formData);
      if (result && "ok" in result && !result.ok) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="lang" value={lang} />

      <Field id="name" label={dict.submit.nameLabel}>
        <Input id="name" name="name" required placeholder={dict.submit.namePlaceholder} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="school" label={dict.submit.schoolLabel}>
          <Input id="school" name="school" required placeholder={dict.submit.schoolPlaceholder} />
        </Field>
        <Field id="building" label={dict.submit.buildingLabel}>
          <Input id="building" name="building" placeholder={dict.submit.buildingPlaceholder} />
        </Field>
      </div>

      <Field id="floor" label={dict.submit.floorLabel}>
        <Input id="floor" name="floor" placeholder={dict.submit.floorPlaceholder} />
      </Field>

      <Field id="description" label={dict.submit.descLabel}>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder={dict.submit.descPlaceholder}
        />
      </Field>

      <div className="border-t border-zinc-800 pt-5 space-y-4">
        <ImageField
          id="coverImage"
          label={dict.submit.coverImageLabel}
          hint={dict.submit.coverImageHint}
          inputRef={coverInputRef}
          onChange={handleCoverChange}
        >
          {coverPreview && (
            <div className="mt-2 relative h-40 w-40 overflow-hidden rounded-lg border border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverPreview} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </ImageField>

        <ImageField
          id="contentImages"
          label={dict.submit.contentImagesLabel}
          hint={dict.submit.contentImagesHint}
          inputRef={galleryInputRef}
          onChange={handleGalleryChange}
          multiple
        >
          {galleryPreviews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {galleryPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-lg border border-zinc-700"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </ImageField>
      </div>

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

function ImageField({
  id,
  label,
  hint,
  inputRef,
  onChange,
  multiple,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple={multiple}
        onChange={onChange}
        className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-zinc-100 hover:file:bg-zinc-700 cursor-pointer"
      />
      <p className="text-xs text-zinc-500">{hint}</p>
      {children}
    </div>
  );
}
