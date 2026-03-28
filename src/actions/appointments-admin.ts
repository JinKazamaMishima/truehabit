"use server";

import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(
  id: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  await db
    .update(appointments)
    .set({ status })
    .where(eq(appointments.id, id));

  revalidatePath("/admin/appointments");
}
