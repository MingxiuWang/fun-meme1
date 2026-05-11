export type Tier = "S" | "A" | "B" | "C" | "D" | "F";

export const TIERS: Tier[] = ["S", "A", "B", "C", "D", "F"];

export const TIER_STYLE: Record<
  Tier,
  { bg: string; text: string; ring: string }
> = {
  S: {
    bg: "bg-gradient-to-br from-yellow-300 to-amber-500",
    text: "text-zinc-900",
    ring: "ring-amber-400",
  },
  A: {
    bg: "bg-gradient-to-br from-lime-300 to-emerald-500",
    text: "text-zinc-900",
    ring: "ring-emerald-400",
  },
  B: {
    bg: "bg-gradient-to-br from-sky-300 to-blue-500",
    text: "text-zinc-900",
    ring: "ring-blue-400",
  },
  C: {
    bg: "bg-gradient-to-br from-violet-300 to-purple-500",
    text: "text-zinc-900",
    ring: "ring-purple-400",
  },
  D: {
    bg: "bg-gradient-to-br from-orange-300 to-red-500",
    text: "text-zinc-900",
    ring: "ring-red-400",
  },
  F: {
    bg: "bg-gradient-to-br from-zinc-700 to-zinc-900",
    text: "text-zinc-100",
    ring: "ring-zinc-700",
  },
};

export function scoreToTier(avg: number | null): Tier {
  if (avg === null) return "C";
  if (avg >= 9) return "S";
  if (avg >= 7.5) return "A";
  if (avg >= 6) return "B";
  if (avg >= 4.5) return "C";
  if (avg >= 3) return "D";
  return "F";
}
