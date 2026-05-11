"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { submitBathroom } from "@/app/actions";
import { ScorePicker } from "@/components/score-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function SubmitForm() {
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
      <Field id="name" label="Bathroom name / nickname *">
        <Input
          id="name"
          name="name"
          required
          placeholder='e.g. "The 3rd Floor Stinkpit"'
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="school" label="School / University *">
          <Input
            id="school"
            name="school"
            required
            placeholder="e.g. University of Melbourne"
          />
        </Field>
        <Field id="building" label="Building">
          <Input id="building" name="building" placeholder="e.g. Old Arts" />
        </Field>
      </div>

      <Field id="floor" label="Floor / location">
        <Input id="floor" name="floor" placeholder="e.g. 3rd floor, west wing" />
      </Field>

      <Field id="description" label="Vibe / description">
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Describe the ambiance. Be honest."
        />
      </Field>

      <div className="border-t border-zinc-800 pt-5">
        <Label className="text-base mb-2 block">Your rating *</Label>
        <ScorePicker />
      </div>

      <Field id="review" label="Quick review (optional)">
        <Textarea
          id="review"
          name="review"
          rows={3}
          placeholder='"Soft lighting, hard truths." Tell us what you saw.'
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
        {pending ? "Submitting..." : "Submit & rate 🚽"}
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
