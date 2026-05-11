import "server-only";
import type { Dictionary } from "./types";

const dictionaries = {
  en: () => import("./en").then((m) => m.default),
  zh: () => import("./zh").then((m) => m.default),
} as const;

export type Locale = keyof typeof dictionaries;
export const LOCALES = Object.keys(dictionaries) as Locale[];
export const DEFAULT_LOCALE: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  value in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
