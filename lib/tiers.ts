export type Tier = "S" | "A" | "B" | "C" | "D" | "F";

export const TIERS: Tier[] = ["S", "A", "B", "C", "D", "F"];

export const TIER_META: Record<
  Tier,
  { label: string; tagline: string; bg: string; text: string; ring: string }
> = {
  S: {
    label: "S",
    tagline: "porcelain throne — life-changing flush",
    bg: "bg-gradient-to-br from-yellow-300 to-amber-500",
    text: "text-zinc-900",
    ring: "ring-amber-400",
  },
  A: {
    label: "A",
    tagline: "would poop here again",
    bg: "bg-gradient-to-br from-lime-300 to-emerald-500",
    text: "text-zinc-900",
    ring: "ring-emerald-400",
  },
  B: {
    label: "B",
    tagline: "respectable, no complaints",
    bg: "bg-gradient-to-br from-sky-300 to-blue-500",
    text: "text-zinc-900",
    ring: "ring-blue-400",
  },
  C: {
    label: "C",
    tagline: "mid. holds liquid.",
    bg: "bg-gradient-to-br from-violet-300 to-purple-500",
    text: "text-zinc-900",
    ring: "ring-purple-400",
  },
  D: {
    label: "D",
    tagline: "use only if desperate",
    bg: "bg-gradient-to-br from-orange-300 to-red-500",
    text: "text-zinc-900",
    ring: "ring-red-400",
  },
  F: {
    label: "F",
    tagline: "biohazard. condemn the building.",
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
