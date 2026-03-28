"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

export async function getSettingsBySection(section: string) {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.section, section));

  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? "";
  }
  return map;
}

export async function getAllSettings() {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? "";
  }
  return map;
}

export async function upsertSettings(
  entries: { key: string; value: string; section: string }[]
) {
  for (const entry of entries) {
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, entry.key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value: entry.value, section: entry.section, updatedAt: new Date() })
        .where(eq(siteSettings.key, entry.key));
    } else {
      await db.insert(siteSettings).values({
        key: entry.key,
        value: entry.value,
        section: entry.section,
      });
    }
  }

  updateTag("site-settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}
