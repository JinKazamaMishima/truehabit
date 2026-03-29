"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Locale } from "./index";

export async function setLocaleAction(locale: Locale) {
  if (locale !== "es" && locale !== "en") return;

  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const session = await auth();
  if (session?.user?.id) {
    await db
      .update(users)
      .set({ locale })
      .where(eq(users.id, session.user.id));
  }

  revalidatePath("/", "layout");
}
