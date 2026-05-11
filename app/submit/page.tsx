import Link from "next/link";
import { SubmitForm } from "@/components/submit-form";

export const metadata = { title: "Submit a bathroom — King of Shit" };

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← back to tier list
      </Link>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
        Submit a bathroom
      </h1>
      <p className="mt-2 text-zinc-400">
        Drop a new toilet into the list — your rating starts the average.
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-7">
        <SubmitForm />
      </div>
    </div>
  );
}
