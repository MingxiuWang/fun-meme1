"use client";

import { useTransition, useState, useRef } from "react";
import { toast } from "sonner";
import { voteOnBathroom } from "@/app/actions";
import { ScorePicker } from "@/components/score-picker";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/types";

type Props = {
  bathroomId: string;
  lang: string;
  dict: Pick<Dictionary, "detail" | "scoreFlair">;
};

export function VoteForm({ bathroomId, lang, dict }: Props) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [key, setKey] = useState(0);

  async function action(formData: FormData) {
    startTransition(async () => {
      const result = await voteOnBathroom(formData);
      if (result.ok) {
        toast.success(dict.detail.voteRecorded);
        formRef.current?.reset();
        setKey((k) => k + 1);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="bathroomId" value={bathroomId} />
      <input type="hidden" name="lang" value={lang} />
      <div>
        <Label className="text-base mb-2 block">{dict.detail.yourRating}</Label>
        <ScorePicker key={key} flair={dict.scoreFlair} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="review">{dict.detail.leaveReview}</Label>
        <Textarea
          id="review"
          name="review"
          rows={3}
          placeholder={dict.detail.reviewPlaceholder}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-amber-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-300 transition disabled:opacity-60"
      >
        {pending ? dict.detail.voting : dict.detail.vote}
      </button>
    </form>
  );
}
