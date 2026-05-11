import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitForm } from "@/components/submit-form";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href={`/${lang}`}
        className="text-sm text-zinc-400 hover:text-zinc-200"
      >
        {dict.submit.back}
      </Link>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
        {dict.submit.title}
      </h1>
      <p className="mt-2 text-zinc-400">{dict.submit.intro}</p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-7">
        <SubmitForm
          lang={lang}
          dict={{ submit: dict.submit, scoreFlair: dict.scoreFlair }}
        />
      </div>
    </div>
  );
}
