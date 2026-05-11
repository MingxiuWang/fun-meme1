"use client";

import { useTransition, useState } from "react";
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
