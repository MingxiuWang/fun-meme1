"use client";

import { useTransition, useState, useRef } from "react";
import { toast } from "sonner";
import { voteOnBathroom } from "@/app/actions";
import { ScorePicker } from "@/components/score-picker";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function VoteForm({ bathroomId }: { bathroomId: string }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [key, setKey] = useState(0);

  async function action(formData: FormData) {
    startTransition(async () => {
      const result = await voteOnBathroom(formData);
      if (result.ok) {
        toast.success("Vote recorded. Flush counted.");
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
      <div>
        <Label className="text-base mb-2 block">Your rating</Label>
        <ScorePicker key={key} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="review">Leave a review (optional)</Label>
        <Textarea
          id="review"
          name="review"
          rows={3}
          placeholder="What was the experience like?"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-amber-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-300 transition disabled:opacity-60"
      >
        {pending ? "Voting..." : "Cast your vote"}
      </button>
    </form>
  );
}
