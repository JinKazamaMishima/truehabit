import { cookies } from "next/headers";
import type { Locale } from "./index";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("NEXT_LOCALE")?.value;
  if (value === "en" || value === "es") return value;
  return "es";
}
