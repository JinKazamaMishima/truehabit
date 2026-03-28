"use server";

import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

export async function getTestimonials() {
  return db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.displayOrder));
}

export async function createTestimonial(data: {
  clientName: string;
  clientTitle: string | null;
  quote: string;
  isFeatured?: boolean;
  displayOrder?: number;
}) {
  await db.insert(testimonials).values({
    clientName: data.clientName,
    clientTitle: data.clientTitle,
    quote: data.quote,
    isFeatured: data.isFeatured ?? false,
    displayOrder: data.displayOrder ?? 0,
  });

  updateTag("testimonials");
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateTestimonial(
  id: string,
  data: {
    clientName: string;
    clientTitle: string | null;
    quote: string;
    isFeatured?: boolean;
    displayOrder?: number;
  }
) {
  await db
    .update(testimonials)
    .set({
      clientName: data.clientName,
      clientTitle: data.clientTitle,
      quote: data.quote,
      isFeatured: data.isFeatured ?? false,
      displayOrder: data.displayOrder ?? 0,
    })
    .where(eq(testimonials.id, id));

  updateTag("testimonials");
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id));

  updateTag("testimonials");
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
