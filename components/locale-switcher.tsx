"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {
  current: "en" | "zh";
  otherLabel: string;
};

export function LocaleSwitcher({ current, otherLabel }: Props) {
  const pathname = usePathname();
  const other = current === "en" ? "zh" : "en";

  const stripped = pathname.replace(/^\/(en|zh)(?=\/|$)/, "") || "/";
  const target = `/${other}${stripped === "/" ? "" : stripped}`;

  return (
    <Link
      href={target}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      }}
      className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition"
      aria-label={`Switch language to ${otherLabel}`}
    >
      {otherLabel}
    </Link>
  );
}
