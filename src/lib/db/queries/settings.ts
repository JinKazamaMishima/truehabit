import { db } from "@/lib/db";
import { siteSettings, testimonials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getSiteSettings = unstable_cache(
  async () => {
    const rows = await db.select().from(siteSettings);
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value ?? "";
    }
    return map;
  },
  ["site-settings"],
  { tags: ["site-settings"] }
);

export const getSiteSettingsBySection = unstable_cache(
  async (section: string) => {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.section, section));
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value ?? "";
    }
    return map;
  },
  ["site-settings-section"],
  { tags: ["site-settings"] }
);

export const getFeaturedTestimonials = unstable_cache(
  async () => {
    return db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isFeatured, true))
      .orderBy(asc(testimonials.displayOrder));
  },
  ["featured-testimonials"],
  { tags: ["testimonials"] }
);

export const getAllTestimonials = unstable_cache(
  async () => {
    return db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.displayOrder));
  },
  ["all-testimonials"],
  { tags: ["testimonials"] }
);
