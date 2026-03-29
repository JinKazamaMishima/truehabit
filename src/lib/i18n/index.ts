import type { Dictionary } from "./messages/es";

export type Locale = "es" | "en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("./messages/es").then((m) => m.default),
  en: () => import("./messages/en").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = dictionaries[locale];
  if (!load) return dictionaries.es();
  return load();
}

export type { Dictionary };
